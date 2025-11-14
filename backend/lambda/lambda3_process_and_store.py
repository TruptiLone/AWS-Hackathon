import boto3
import json
from datetime import datetime
from decimal import Decimal
import math

s3 = boto3.client('s3', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Table name
TABLE_NAME = 'StudentlyticsData'
TABLE = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Lambda 3: Process results and store to StudentlyticsData table
    """
    print("=" * 60)
    print("LAMBDA 3: Process & Store to StudentlyticsData")
    print("=" * 60)
    
    # Get data from Lambda 2
    job_id = event['job_id']
    record_id = event['record_id']
    bucket = event['bucket']
    results_key = event['results_key']
    video_key = event.get('video_key', '')
    
    print(f"\nJob Info:")
    print(f"  Job ID: {job_id}")
    print(f"  Record ID: {record_id}")
    print(f"  Results: s3://{bucket}/{results_key}")
    
    # Fetch JSON results from S3
    print(f"\nFetching results from S3...")
    
    try:
        response = s3.get_object(Bucket=bucket, Key=results_key)
        results_json = response['Body'].read().decode('utf-8')
        results_data = json.loads(results_json)
        
        student_detections = results_data.get('student_data', {})
        
        print(f"Loaded results for {len(student_detections)} students")
        
    except Exception as e:
        print(f"Error fetching results from S3: {e}")
        return {
            'job_id': job_id,
            'record_id': record_id,
            'status': 'fetch_failed',
            'error': str(e)
        }
    
    # Extract metadata (customize as needed)
    session_date = datetime.now().strftime('%Y-%m-%d')
    class_id = 101
    class_name = "Computer Science 101"
    department = "Computer Science"
    session_id = f"session_{record_id}"
    topic = "Introduction to Programming"
    room = "Room 204"
    start_time = "09:00 AM"
    end_time = "10:30 AM"
    schedule = "MWF 9:00-10:30"
    teacher_id = "teacher_001"
    teacher_name = "Dr. Smith"
    teacher_email = "smith@university.edu"
    
    print(f"\nSession Metadata:")
    print(f"  Date: {session_date}")
    print(f"  Class: {class_name}")
    print(f"  Session ID: {session_id}")
    
    # Process each student
    print(f"\nProcessing student records...")
    
    records_written = 0
    records_failed = 0
    
    for student_id_str, student_data in student_detections.items():
        student_id = int(student_id_str)
        
        print(f"\n  Student {student_id}:")
        
        # Calculate Attendance Score
        attendance_score = calculate_attendance_score(student_data)
        print(f"    Attendance Score: {attendance_score}/100")
        
        # Calculate Engagement Score
        engagement_score = calculate_engagement_score(student_data)
        print(f"    Engagement Score: {engagement_score}/100")
        
        # Calculate other metrics
        time_inside_class = int(student_data.get('PresenceDuration(sec)', 0))
        speaking_time = estimate_speaking_time(student_data, time_inside_class)
        
        print(f"    Time in Class: {time_inside_class}s")
        print(f"    Speaking Time: {speaking_time}s")
        
        # Determine status (present if in class)
        status = time_inside_class > 0
        status_text = "PRESENT" if status else "ABSENT"

        print(f"    Status: {status_text}")
        print(f"    Attendance: {attendance_score}")
        print(f"    Engagement: {engagement_score}")
        print(f"    Time in Class: {time_inside_class}s")
        print(f"    Speaking Time: {speaking_time}s")
        
        # Get student details
        student_name = f"Student {student_id}"
        student_email = f"student{student_id}@university.edu"
        photo_url = f"s3://{bucket}/photos/student_{student_id}.jpg"
        
        # Create composite primary key (record_id + student_id)
        composite_key = f"{record_id}#{student_id}"
        
        # Prepare record for DynamoDB (with proper Decimal conversion)
        record = {
            # Primary key (composite: record_id#student_id)
            'record_id': composite_key,
            
            # Student info
            'student_id': student_id,
            'student_name': student_name,
            'student_email': student_email,
            'photo_url': photo_url,
            'grade': 90,  # Actual grade placeholder
            
            # Class info
            'class_id': class_id,
            'class_name': class_name,
            'department': department,
            'room': room,
            'schedule': schedule,
            'topic': topic,
            
            # Session info
            'session_id': session_id,
            'session_date': session_date,
            'start_time': start_time,
            'end_time': end_time,
            
            # Teacher info
            'teacher_id': teacher_id,
            'teacher_name': teacher_name,
            'teacher_email': teacher_email,
            
            # Attendance metrics (convert to Decimal)
            'status': status,
            'time_inside_class': time_inside_class,
            'speaking_time': speaking_time,
            'attendance': Decimal(str(round(attendance_score, 2))),
            
            # Engagement metrics (convert to Decimal)
            'engagement': Decimal(str(round(engagement_score, 2))),
            
            # Timestamp
            'timestamp': int(datetime.now().timestamp())
        }
        
        # Write to DynamoDB
        try:
            TABLE.put_item(Item=record)
            print(f"    ✅ Saved to StudentlyticsData (Key: {composite_key})")
            records_written += 1
            
        except Exception as e:
            print(f"    ❌ Error saving: {e}")
            records_failed += 1
    
    print("\n" + "=" * 60)
    print("LAMBDA 3 COMPLETE")
    print("=" * 60)
    print(f"\nSummary:")
    print(f"  Records written: {records_written}")
    print(f"  Records failed: {records_failed}")
    
    return {
        'job_id': job_id,
        'record_id': record_id,
        'session_id': session_id,
        'session_date': session_date,
        'records_written': records_written,
        'records_failed': records_failed,
        'status': 'complete'
    }


def calculate_attendance_score(student_data):
    """
    Calculate Attendance Score (0-100) based on:
    - Presence Duration (50%)
    - Confidence (25%)
    - Similarity (25%)
    """
    # Get raw values
    presence_duration = student_data.get('PresenceDuration(sec)', 0)
    avg_confidence = student_data.get('AvgConfidence', 0)
    avg_similarity = student_data.get('AvgSimilarity', 0)
    
    # Normalize presence duration (assume 50-minute class = 3000 seconds)
    max_class_duration = 3000
    presence_score = min(100, (presence_duration / max_class_duration) * 100)
    
    # Confidence and similarity are already 0-100
    confidence_score = avg_confidence
    similarity_score = avg_similarity
    
    # Weighted average: 50% presence, 25% confidence, 25% similarity
    attendance_score = (
        0.50 * presence_score +
        0.25 * confidence_score +
        0.25 * similarity_score
    )
    
    return round(attendance_score, 1)


def calculate_engagement_score(student_data):
    """
    Calculate Engagement Score (0-100) based on:
    - Head Orientation (40%): Yaw, Pitch, Roll
    - Visibility (30%): Brightness, Sharpness
    - Proximity (30%): BoundingBoxSize
    """
    # Get raw values
    avg_yaw = abs(student_data.get('AvgYaw', 0))
    avg_pitch = abs(student_data.get('AvgPitch', 0))
    avg_roll = abs(student_data.get('AvgRoll', 0))
    avg_brightness = student_data.get('AvgBrightness', 0)
    avg_sharpness = student_data.get('AvgSharpness', 0)
    avg_bbox_size = student_data.get('AvgBoundingBoxSize', 0)
    
    # Head Orientation Score (lower angles = better engagement)
    yaw_score = max(0, 100 - (avg_yaw / 180 * 100))
    pitch_score = max(0, 100 - (abs(avg_pitch) / 90 * 100))
    roll_score = max(0, 100 - (avg_roll / 180 * 100))
    orientation_score = (yaw_score + pitch_score + roll_score) / 3
    
    # Visibility Score (higher = better)
    brightness_score = min(100, avg_brightness)
    sharpness_score = min(100, avg_sharpness * 5)
    visibility_score = (brightness_score + sharpness_score) / 2
    
    # Proximity Score (larger bbox = closer = more engaged)
    min_bbox = 0.005
    max_bbox = 0.03
    proximity_score = min(100, max(0, 
        ((avg_bbox_size - min_bbox) / (max_bbox - min_bbox)) * 100
    ))
    
    # Final Engagement Score
    engagement_score = (
        0.40 * orientation_score +
        0.30 * visibility_score +
        0.30 * proximity_score
    )
    
    return round(engagement_score, 1)


def estimate_speaking_time(student_data, time_inside_class):
    """
    Estimate speaking time based on engagement indicators
    """
    avg_yaw = abs(student_data.get('AvgYaw', 0))
    avg_pitch = abs(student_data.get('AvgPitch', 0))
    avg_roll = abs(student_data.get('AvgRoll', 0))
    
    # Base speaking time (15% of presence)
    base_speaking = time_inside_class * 0.15
    
    # Bonus for head movement
    movement_factor = (avg_yaw + avg_pitch + avg_roll) / 450
    movement_bonus = time_inside_class * 0.10 * movement_factor
    
    # Bonus for forward orientation
    if avg_yaw < 20 and abs(avg_pitch) < 30:
        orientation_bonus = time_inside_class * 0.10
    else:
        orientation_bonus = 0
    
    total_speaking = base_speaking + movement_bonus + orientation_bonus
    
    # Cap at 50% of time in class
    max_speaking = time_inside_class * 0.50
    
    return int(min(total_speaking, max_speaking))