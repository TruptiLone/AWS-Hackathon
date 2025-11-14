import boto3
import json
from datetime import datetime
from decimal import Decimal

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

TABLE_NAME = 'StudentlyticsData'
BUCKET_NAME = 'hackathon-attendance-media'
MODEL_ID = 'us.anthropic.claude-3-haiku-20240307-v1:0'  # Or whichever worked for you

table = dynamodb.Table(TABLE_NAME)

def get_latest_record_id():
    """Return latest VIDEO_NAME based on timestamp or name order"""
    try:
        all_videos = get_all_record_ids()
        if not all_videos:
            return None
        latest = all_videos[0]
        print(f"Latest video/session: {latest}")
        return latest
    except Exception as e:
        print(f"Error getting latest record_id: {e}")
        return None


def get_all_record_ids():
    """Get list of all unique VIDEO_NAMEs (not full record_ids)"""
    try:
        response = table.scan(ProjectionExpression='record_id')
        items = response.get('Items', [])
        
        # Extract only VIDEO_NAME part before '#'
        video_names = set()
        for item in items:
            rid = item.get('record_id')
            if rid and '#' in rid:
                video_names.add(rid.split('#')[0])  # only video name
            elif rid:
                video_names.add(rid)  # fallback if no '#'

        # Sort alphabetically or by timestamp if you store dates in name
        video_list = sorted(list(video_names), reverse=True)
        return video_list
        
    except Exception as e:
        print(f"Error getting record_ids: {e}")
        return []


def decimal_to_float(obj):
    """Convert Decimal objects to float for JSON serialization"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def clean_dynamodb_item(item):
    """Recursively convert all Decimal objects in a dict to float"""
    if isinstance(item, list):
        return [clean_dynamodb_item(i) for i in item]
    elif isinstance(item, dict):
        return {k: clean_dynamodb_item(v) for k, v in item.items()}
    elif isinstance(item, Decimal):
        return float(item)
    else:
        return item

def lambda_handler(event, context):
    """Chatbot with function calling capabilities"""
    
    print("Event received:")
    print(json.dumps(event, default=str))
    
    # Handle CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return handle_options()
    
    # Parse request - handle multiple formats
    try:
        if 'body' in event and isinstance(event['body'], str):
            body = json.loads(event['body'])
            user_message = body.get('message', '')
        elif 'body' in event and isinstance(event['body'], dict):
            user_message = event['body'].get('message', '')
        elif 'message' in event:
            user_message = event.get('message', '')
        else:
            user_message = event.get('message', '')
        
        print(f"Parsed message: {user_message}")
        
    except Exception as e:
        print(f"Error parsing request: {e}")
        return error_response('Invalid request format')
    
    if not user_message:
        return error_response('No message provided')

    # ✅ Define tools at the same indentation level
    tools = [
        {
            "name": "get_student_data",
            "description": "Get attendance and engagement data for a specific student by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "student_id": {"type": "integer"},
                    "record_id": {"type": "string"}
                },
                "required": ["student_id"]
            }
        },
        {
            "name": "get_class_summary",
            "description": "Get summary statistics for a class session.",
            "input_schema": {
                "type": "object",
                "properties": {"record_id": {"type": "string"}}
            }
        },
        # ... (rest of your tool definitions)
    ]

    # ✅ These two lines must align exactly with 'tools = [...]'
    response = call_claude_with_tools(user_message, tools)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
    }



def call_claude_with_tools(user_message, tools, max_iterations=5):
    """
    Call Claude with function calling capability
    """
    messages = [{"role": "user", "content": user_message}]
    
    for iteration in range(max_iterations):
        print(f"Iteration {iteration + 1}")
        
        # Call Bedrock
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2000,
           "system": """You are an AI assistant for Studentlytics, an attendance and engagement tracking system.

            When presenting attendance results:
            - Always report both present and absent counts.
            - Never assume all students were present unless the absent count is exactly zero.
            - Use the exact numbers returned by the tool (e.g., 'present': 5, 'absent': 1).
            - If the function returns an attendance_rate below 100%, clearly state that not all students attended.
            - Use concise, natural phrasing such as:
            "Out of 6 students, 5 were present and 1 was absent (83.3% attendance)."
            When presenting engagement or attendance summaries:
            - Reference the session name or record_id.
            - Include averages and attendance_rate values in sentences.
            - Avoid summarizing incorrectly; trust the tool's numeric output.""",
            "messages": messages,
            "tools": tools,
            "temperature": 0.5
        }
        
        try:
            response = bedrock.invoke_model(
                modelId=MODEL_ID,
                body=json.dumps(request_body)
            )
            
            response_body = json.loads(response['body'].read())
            
            # Check stop reason
            stop_reason = response_body.get('stop_reason')
            content = response_body.get('content', [])
            
            # Add assistant response to messages
            messages.append({
                "role": "assistant",
                "content": content
            })
            
            if stop_reason == 'end_turn':
                # Claude is done, return final text
                for block in content:
                    if block.get('type') == 'text':
                        return block['text']
                return "I completed the task."
            
            elif stop_reason == 'tool_use':
                # Claude wants to use a tool
                tool_results = []
                
                for block in content:
                    if block.get('type') == 'tool_use':
                        tool_name = block['name']
                        tool_input = block['input']
                        tool_use_id = block['id']
                        
                        print(f"Using tool: {tool_name} with {tool_input}")
                        
                        # Execute the tool
                        result = execute_tool(tool_name, tool_input)
                        
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": tool_use_id,
                            "content": json.dumps(result)
                        })
                
                # Add tool results to messages
                messages.append({
                    "role": "user",
                    "content": tool_results
                })
                
                # Continue loop to get Claude's next response
                continue
            
        except Exception as e:
            print(f"Error calling Bedrock: {e}")
            return f"Error: {str(e)}"
    
    return "Maximum iterations reached."


def execute_tool(tool_name, tool_input):
    """Execute tool"""
    if tool_name == "get_student_data":
        return get_student_data(
            tool_input['student_id'],
            tool_input.get('record_id')
        )
    elif tool_name == "get_class_summary":
        return get_class_summary(tool_input.get('record_id'))
    elif tool_name == "get_engagement_rankings":
        return get_engagement_rankings(
            tool_input.get('limit', 5),
            tool_input.get('record_id')
        )
    elif tool_name == "get_absent_students":
        return get_absent_students(tool_input.get('record_id'))
    elif tool_name == "list_all_sessions":
        return list_all_sessions()
    elif tool_name == "compare_sessions":
        return compare_sessions(
            tool_input['record_id_1'],
            tool_input['record_id_2']
        )
    else:
        return {"error": f"Unknown tool: {tool_name}"}


def get_student_data(student_id, record_id=None):
    """Get data for a specific student, optionally filtered by session"""
    try:
        if record_id:
            # Specific session
            response = table.scan(
                FilterExpression='student_id = :sid AND begins_with(record_id, :rid_prefix)',
                ExpressionAttributeValues={
                    ':sid': student_id,
                    ':rid_prefix': record_id
                }
            )
        else:
            # All sessions for this student
            response = table.scan(
                FilterExpression='student_id = :sid',
                ExpressionAttributeValues={':sid': student_id}
            )
        
        items = response.get('Items', [])
        
        if not items:
            return {"error": f"No data found for student {student_id}"}
        
        clean_items = [clean_dynamodb_item(item) for item in items]
        
        return {
            "student_id": student_id,
            "student_name": clean_items[0].get('student_name') if clean_items else 'Unknown',
            "records": clean_items,
            "total_sessions": len(clean_items),
            "sessions": list(set(item.get('record_id') for item in clean_items))
        }
        
    except Exception as e:
        return {"error": str(e)}


def get_class_summary(record_id=None):
    """Get summary statistics for a specific session (VIDEO_NAME) considering 'status' correctly"""
    try:
        if not record_id:
            record_id = get_latest_record_id()
            if not record_id:
                return {"error": "No data found in database"}

        response = table.scan(
            FilterExpression='begins_with(record_id, :rid_prefix)',
            ExpressionAttributeValues={':rid_prefix': record_id}
        )
        
        items = response.get('Items', [])
        if not items:
            return {"error": f"No data found for session {record_id}"}
        
        clean_items = [clean_dynamodb_item(i) for i in items]
        total = len(clean_items)
        
        present = 0
        absent = 0

        for item in clean_items:
            status = item.get('status', None)
            student_id = item.get('student_id')
            student_name = item.get('student_name')
            
            print(f"DEBUG Student {student_id} ({student_name}): Raw status='{status}', type={type(status)}")
            
            # Normalize all possible variants - FIRST check for explicit strings
            normalized_status = status
            
            if status is not None:
                # Convert to string first to handle any edge cases
                status_str = str(status).strip().lower()
                
                # Now check against all possible "false" values
                if status_str in ['false', 'f', '0', 'no', 'absent', 'n']:
                    normalized_status = False
                    print(f"  -> Detected as FALSE: '{status}'")
                elif status_str in ['true', 't', '1', 'yes', 'present', 'y']:
                    normalized_status = True
                    print(f"  -> Detected as TRUE: '{status}'")
                else:
                    # Try boolean conversion
                    if isinstance(status, bool):
                        normalized_status = status
                    elif isinstance(status, (int, float)):
                        normalized_status = bool(status)
                    else:
                        normalized_status = None
                        print(f"  -> Unknown status value: '{status}'")
            
            print(f"DEBUG Student {student_id}: Final normalized status={normalized_status}")
            
            # Count using the NORMALIZED status
            if normalized_status is True:
                present += 1
                print(f"  -> Counting as PRESENT")
            elif normalized_status is False:
                absent += 1
                print(f"  -> Counting as ABSENT")
            else:
                print(f"  -> Not counting (None/unknown)")
        
        avg_attendance = sum(i.get('attendance', 0) for i in clean_items) / total if total else 0
        avg_engagement = sum(i.get('engagement', 0) for i in clean_items) / total if total else 0

        print(f"DEBUG FINAL: present={present}, absent={absent}, total={total}")
        
        # Return with debug info
        result = {
            "record_id": record_id,
            "total_students": total,
            "present": present,
            "absent": absent,
            "attendance_rate": round((present / total) * 100, 1) if total else 0,
            "avg_attendance_score": round(avg_attendance, 1),
            "avg_engagement_score": round(avg_engagement, 1),
            "debug_info": {  # Temporary debug info
                "raw_items_count": len(items),
                "present_count": present,
                "absent_count": absent
            }
        }
        
        # Print all statuses for debugging
        status_debug = []
        for i, item in enumerate(clean_items):
            student_id = item.get('student_id')
            student_name = item.get('student_name')
            raw_status = item.get('status')
            print(f"DEBUG Item {i}: student_id={student_id}, status={raw_status}, type={type(raw_status)}")
            status_debug.append({
                'student_id': student_id,
                'student_name': student_name,
                'raw_status': str(raw_status),
                'raw_status_type': str(type(raw_status))
            })
        
        result['debug_info']['all_statuses'] = status_debug
        
        return result

    except Exception as e:
        return {"error": str(e)}



def get_engagement_rankings(limit=5, record_id=None):
    """Get top students by engagement for a specific session"""
    try:
        # If no record_id, get latest
        if not record_id:
            record_id = get_latest_record_id()
            if not record_id:
                return {"error": "No data found"}
        
        # Query specific session
        response = table.scan(
            FilterExpression='begins_with(record_id, :rid_prefix)',
            ExpressionAttributeValues={':rid_prefix': record_id}
        )
        
        items = response.get('Items', [])
        
        if not items:
            return {"error": f"No data for session {record_id}"}
        
        # Clean and sort
        clean_items = [clean_dynamodb_item(item) for item in items]
        sorted_items = sorted(
            clean_items,
            key=lambda x: x.get('engagement', 0),
            reverse=True
        )[:limit]
        
        rankings = []
        for i, item in enumerate(sorted_items, 1):
            rankings.append({
                "rank": i,
                "student_id": item.get('student_id'),
                "student_name": item.get('student_name'),
                "engagement": item.get('engagement', 0),
                "attendance": item.get('attendance', 0)
            })
        
        return {
            "record_id": record_id,
            "session_date": clean_items[0].get('session_date'),
            "top_students": rankings
        }
        
    except Exception as e:
        return {"error": str(e)}


def get_absent_students(record_id=None):
    """Get absent students for a specific session"""
    try:
        # If no record_id, get latest
        if not record_id:
            record_id = get_latest_record_id()
            if not record_id:
                return {"error": "No data found"}
        
        # Query specific session - scan all records
        response = table.scan(
            FilterExpression='begins_with(record_id, :rid_prefix)',
            ExpressionAttributeValues={
                ':rid_prefix': record_id
            }
        )
        
        items = response.get('Items', [])
        clean_items = [clean_dynamodb_item(item) for item in items]
        
        # Filter for absent students in Python
        absent_list = []
        for item in clean_items:
            status = item.get('status', None)
            
            # Normalize status same way as get_class_summary
            if isinstance(status, str):
                if status.strip().lower() in ['false', '0', 'no', 'absent']:
                    status = False
                elif status.strip().lower() in ['true', '1', 'yes', 'present']:
                    status = True
                else:
                    status = None
            elif isinstance(status, bool):
                pass  # Already boolean, keep as is
            elif isinstance(status, (int, float)):
                status = bool(status)
            else:
                status = None
            
            # Only add if status is explicitly False (absent)
            if status is False:
                absent_list.append({
                    "student_id": item.get('student_id'),
                    "student_name": item.get('student_name'),
                    "session_date": item.get('session_date')
                })
        
        return {
            "record_id": record_id,
            "absent_students": absent_list,
            "total_absent": len(absent_list)
        }
        
    except Exception as e:
        return {"error": str(e)}


def handle_options():
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': ''
    }


def error_response(message):
    return {
        'statusCode': 400,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': message})
    }

def list_all_sessions():
    """List all available sessions"""
    try:
        record_ids = get_all_record_ids()
        
        # Get more info about each session
        sessions = []
        for rid in record_ids[:10]:  # Limit to 10 most recent
            response = table.scan(
                FilterExpression='begins_with(record_id, :rid_prefix)',
                ExpressionAttributeValues={':rid_prefix': rid},
                Limit=1
            )
            if response.get('Items'):
                item = clean_dynamodb_item(response['Items'][0])
                sessions.append({
                    "record_id": rid,
                    "session_date": item.get('session_date', 'Unknown')
                })
        
        return {
            "total_sessions": len(record_ids),
            "recent_sessions": sessions
        }
        
    except Exception as e:
        return {"error": str(e)}


def compare_sessions(record_id_1, record_id_2):
    """Compare two sessions"""
    try:
        session1 = get_class_summary(record_id_1)
        session2 = get_class_summary(record_id_2)
        
        if "error" in session1 or "error" in session2:
            return {"error": "One or both sessions not found"}
        
        return {
            "session_1": session1,
            "session_2": session2,
            "comparison": {
                "attendance_diff": session1['attendance_rate'] - session2['attendance_rate'],
                "engagement_diff": session1['avg_engagement_score'] - session2['avg_engagement_score'],
                "student_count_diff": session1['total_students'] - session2['total_students']
            }
        }
        
    except Exception as e:
        return {"error": str(e)}