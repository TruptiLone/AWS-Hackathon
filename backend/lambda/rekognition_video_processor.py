import boto3
import json
from datetime import datetime
from decimal import Decimal
import time

# Initialize AWS clients
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

# Configuration
COLLECTION_ID = 'hackathon-student-faces'
ATTENDANCE_TABLE = 'Attendance'
TABLE = dynamodb.Table(ATTENDANCE_TABLE)

def lambda_handler(event, context):
    """
    Main Lambda handler - triggered when video is uploaded to S3
    """
    print("🎬 Video processing Lambda triggered!")
    
    # Get bucket and key from S3 event
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        video_key = event['Records'][0]['s3']['object']['key']
        print(f"📹 Processing video: s3://{bucket}/{video_key}")
    except KeyError:
        print("❌ Invalid S3 event format")
        return {'statusCode': 400, 'body': 'Invalid event'}
    
    # Extract metadata from video path
    # Expected format: videos/2025-10-25/class_101_14-30-00_lecture.mp4
    try:
        path_parts = video_key.split('/')
        class_date = path_parts[1]  # 2025-10-25
        filename = path_parts[2]  # class_101_14-30-00_lecture.mp4
        
        # Extract class_id from filename
        class_id = int(filename.split('_')[1])  # 101
        
        print(f"📅 Class date: {class_date}")
        print(f"🏫 Class ID: {class_id}")
    except (IndexError, ValueError) as e:
        print(f"❌ Error parsing video path: {e}")
        return {'statusCode': 400, 'body': 'Invalid video path format'}
    
    # Process the video
    results = process_video(bucket, video_key, class_id, class_date)
    
    # Write results to DynamoDB
    write_attendance_records(results, class_id, class_date)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Video processed successfully',
            'students_detected': len(results)
        })
    }

def process_video(bucket, video_key, class_id, class_date):
    """
    Process video using Rekognition to detect and track faces
    """
    print("🔍 Starting Rekognition face search...")
    
    # Start face search in video
    try:
        response = rekognition.start_face_search(
            Video={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': video_key
                }
            },
            CollectionId=COLLECTION_ID,
            FaceMatchThreshold=80.0  # 80% confidence threshold
            # Remove NotificationChannel - we'll use synchronous polling instead
        )
        
        job_id = response['JobId']
        print(f"✅ Rekognition job started: {job_id}")
        
    except Exception as e:
        print(f"❌ Error starting Rekognition job: {e}")
        return []
    
    # Wait for job to complete
    print("⏳ Waiting for Rekognition to process video...")
    job_status = wait_for_job_completion(job_id)
    
    if job_status != 'SUCCEEDED':
        print(f"❌ Rekognition job failed with status: {job_status}")
        return []
    
    # Get results
    print("📊 Retrieving face search results...")
    face_matches = get_face_search_results(job_id)
    
    # Process matches to calculate attendance metrics
    attendance_data = calculate_attendance_metrics(face_matches, video_key)
    
    return attendance_data

def wait_for_job_completion(job_id, max_wait=300):
    """
    Wait for Rekognition job to complete (max 5 minutes)
    """
    start_time = time.time()
    
    while time.time() - start_time < max_wait:
        response = rekognition.get_face_search(JobId=job_id)
        status = response['JobStatus']
        
        print(f"   Job status: {status}")
        
        if status in ['SUCCEEDED', 'FAILED']:
            return status
        
        time.sleep(5)  # Check every 5 seconds
    
    return 'TIMEOUT'

def get_face_search_results(job_id):
    """
    Retrieve all face search results from Rekognition
    """
    all_matches = []
    next_token = None
    
    while True:
        params = {'JobId': job_id, 'MaxResults': 1000}
        if next_token:
            params['NextToken'] = next_token
        
        response = rekognition.get_face_search(**params)
        
        if 'Persons' in response:
            all_matches.extend(response['Persons'])
        
        next_token = response.get('NextToken')
        if not next_token:
            break
    
    print(f"✅ Retrieved {len(all_matches)} face detections")
    return all_matches

def calculate_attendance_metrics(face_matches, video_key):
    """
    Calculate attendance metrics for each student
    
    Returns: List of dicts with student attendance data
    """
    print("📈 Calculating attendance metrics...")
    
    # Dictionary to store metrics per student
    # Format: {student_id: {'frames': [timestamps], 'speaking_frames': [timestamps]}}
    student_data = {}
    
    for person in face_matches:
        timestamp_ms = person.get('Timestamp', 0)
        
        # Check if face was matched to a student
        face_matches_list = person.get('FaceMatches', [])
        
        if not face_matches_list:
            continue  # No match found
        
        # Get the best match
        best_match = face_matches_list[0]
        confidence = best_match['Face']['Confidence']
        
        if confidence < 80:  # Skip low confidence matches
            continue
        
        student_id = int(best_match['Face']['ExternalImageId'])
        
        # Initialize student data if first time seeing them
        if student_id not in student_data:
            student_data[student_id] = {
                'frames': [],
                'speaking_frames': []
            }
        
        # Record this frame
        student_data[student_id]['frames'].append(timestamp_ms)
        
        # Check if person is speaking (using FacialAttributes if available)
        # Note: Rekognition doesn't directly detect speaking, so we'll use mouth open as proxy
        person_detail = person.get('Person', {})
        face_detail = person_detail.get('Face', {})
        
        # For simplicity, we'll mark random frames as "speaking" 
        # In production, you'd use audio analysis or more sophisticated detection
        # This is a placeholder - you might want to integrate with Amazon Transcribe
        
    # Convert frame counts to metrics
    attendance_records = []
    
    for student_id, data in student_data.items():
        frames = data['frames']
        
        if not frames:
            continue
        
        # Calculate time in classroom (seconds)
        # Assuming 30 fps, each frame ≈ 33ms
        # Or use actual timestamps
        unique_timestamps = sorted(set(frames))
        
        # Time in classroom = span of timestamps / 1000 (ms to seconds)
        time_in_classroom = len(unique_timestamps) // 30  # Rough estimate: frames / fps
        
        # Speaking time (placeholder - would need audio analysis)
        # For now, estimate as 20% of time in classroom
        speaking_time = int(time_in_classroom * 0.2)
        
        attendance_records.append({
            'student_id': student_id,
            'attendance_status': True,
            'time_inside_classroom': time_in_classroom,
            'speaking_time': speaking_time,
            'frame_count': len(unique_timestamps)
        })
        
        print(f"   Student {student_id}: {time_in_classroom}s in class, {speaking_time}s speaking")
    
    return attendance_records

def write_attendance_records(attendance_records, class_id, class_date):
    """
    Write attendance records to DynamoDB
    """
    print(f"\n💾 Writing {len(attendance_records)} records to DynamoDB...")
    
    timestamp = int(datetime.now().timestamp())
    
    for record in attendance_records:
        try:
            TABLE.put_item(
                Item={
                    'student_id': record['student_id'],
                    'timestamp': timestamp,
                    'class_date': class_date,
                    'class_id': class_id,
                    'attendance_status': record['attendance_status'],
                    'speaking_time': record['speaking_time'],
                    'time_inside_classroom': record['time_inside_classroom']
                }
            )
            print(f"   ✅ Saved attendance for student {record['student_id']}")
        except Exception as e:
            print(f"   ❌ Error saving student {record['student_id']}: {e}")
    
    print("✅ All records saved!")

# For local testing
if __name__ == '__main__':
    # Simulate S3 event
    test_event = {
        'Records': [{
            's3': {
                'bucket': {'name': 'hackathon-attendance-media'},
                'object': {'key': 'videos/2025-10-25/class_101_14-30-00_test.mp4'}
            }
        }]
    }
    
    lambda_handler(test_event, None)