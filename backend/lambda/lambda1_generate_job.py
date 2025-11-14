import boto3
import json
import uuid
from datetime import datetime

s3 = boto3.client('s3', region_name='us-east-1')
rekognition = boto3.client('rekognition', region_name='us-east-1')

BUCKET_NAME = 'hackathon-attendance-media'  # Replace with your bucket name
COLLECTION_ID = 'hackathon-student-faces'

def lambda_handler(event, context):
    """
    Lambda 1: Generate job for the newly uploaded video
    
    Triggered by: EventBridge (from S3 upload)
    Input: EventBridge event containing S3 upload information
    Output: Job metadata (job_id, record_id, video info, student list)
    """
    print("=" * 60)
    print("🎬 LAMBDA 1: Generate Job for Uploaded Video")
    print("=" * 60)
    
    print(f"\n📨 Received event:")
    print(json.dumps(event, indent=2))
    
    # Extract video information from event
    # Handle both EventBridge format and direct S3 format
    bucket = None
    video_key = None
    
    try:
        # Try EventBridge format first (from S3 via EventBridge)
        if 'detail' in event and 'bucket' in event['detail']:
            bucket = event['detail']['bucket']['name']
            video_key = event['detail']['object']['key']
            print(f"\n✅ Detected EventBridge format")
            
        # Try direct S3 event format (if triggered directly by S3)
        elif 'Records' in event and len(event['Records']) > 0:
            s3_event = event['Records'][0]['s3']
            bucket = s3_event['bucket']['name']
            video_key = s3_event['object']['key']
            print(f"\n✅ Detected direct S3 event format")
            
        # Try Step Functions direct input format
        elif 'bucket' in event and 'video_key' in event:
            bucket = event['bucket']
            video_key = event['video_key']
            print(f"\n✅ Detected Step Functions input format")
            
        else:
            print(f"\n❌ Unknown event format!")
            print(f"Event keys: {list(event.keys())}")
            raise Exception(f"Unsupported event format. Event keys: {list(event.keys())}")
        
        print(f"\n📹 Video detected:")
        print(f"   Bucket: {bucket}")
        print(f"   Key: {video_key}")
        
    except KeyError as e:
        print(f"❌ Error: Missing required field in event - {e}")
        print(f"Event structure: {json.dumps(event, indent=2)}")
        raise Exception(f"Invalid event structure: {e}")
    
    # Verify this is a video in the videos/ folder
    if not video_key.startswith('videos/'):
        print(f"⚠️  File is not in videos/ folder. Skipping.")
        return {
            'statusCode': 200,
            'message': 'Not a video file, skipping',
            'video_key': video_key
        }
    
    # Extract record_id from video filename
    # Expected format: videos/record_001.mp4 → record_id = "record_001"
    filename = video_key.split('/')[-1]  # Get just the filename
    record_id = filename.rsplit('.', 1)[0]  # Remove file extension
    
    print(f"\n🆔 Record ID extracted: {record_id}")
    
    # Generate unique job ID for this processing job
    job_id = str(uuid.uuid4())
    print(f"🔑 Job ID generated: {job_id}")
    
    # Get list of all student photos from S3
    print(f"\n📸 Fetching student photos from s3://{bucket}/photos/...")
    
    try:
        photos_response = s3.list_objects_v2(
            Bucket=bucket,
            Prefix='photos/'
        )
        
        student_ids = []
        student_photo_keys = {}
        
        if 'Contents' in photos_response:
            for obj in photos_response['Contents']:
                key = obj['Key']
                
                # Only process image files
                if key.lower().endswith(('.jpg', '.jpeg', '.png')):
                    # Extract student_id from filename
                    # Expected format: photos/student_10001.jpg → student_id = 10001
                    filename_only = key.split('/')[-1]
                    
                    # Remove "student_" prefix and file extension
                    student_id_str = filename_only.replace('student_', '').rsplit('.', 1)[0]
                    
                    try:
                        student_id = int(student_id_str)
                        student_ids.append(student_id)
                        student_photo_keys[student_id] = key
                        print(f"   ✅ Found: Student {student_id} ({key})")
                    except ValueError:
                        print(f"   ⚠️  Skipping invalid filename: {key}")
        
        print(f"\n✅ Total students found: {len(student_ids)}")
        
    except Exception as e:
        print(f"❌ Error fetching student photos: {e}")
        raise
    
    # Get video metadata (file size, upload time)
    try:
        video_metadata = s3.head_object(Bucket=bucket, Key=video_key)
        video_size_mb = video_metadata['ContentLength']