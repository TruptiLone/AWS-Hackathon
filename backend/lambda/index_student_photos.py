import boto3
import os
from botocore.exceptions import ClientError

# Initialize clients
rekognition = boto3.client('rekognition', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

# Configuration
BUCKET_NAME = 'hackathon-attendance-media'  # Your bucket name
COLLECTION_ID = 'hackathon-student-faces'
PHOTOS_PREFIX = 'photos/'

def index_student_photo(bucket, photo_key, student_id):
    """
    Index a single student photo into Rekognition collection
    
    Args:
        bucket: S3 bucket name
        photo_key: S3 key of the photo (e.g., 'photos/student_12345.jpg')
        student_id: Student ID to use as external ID
    """
    try:
        response = rekognition.index_faces(
            CollectionId=COLLECTION_ID,
            Image={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': photo_key
                }
            },
            ExternalImageId=str(student_id),  # This links face to student ID
            MaxFaces=1,  # Only index the primary face
            QualityFilter='AUTO',  # Filter out low-quality faces
            DetectionAttributes=['ALL']  # Get all face attributes
        )
        
        if response['FaceRecords']:
            face_id = response['FaceRecords'][0]['Face']['FaceId']
            print(f"✅ Indexed student {student_id}: Face ID = {face_id}")
            return face_id
        else:
            print(f"⚠️ No face detected in photo for student {student_id}")
            return None
            
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'InvalidImageFormatException':
            print(f"❌ Invalid image format for student {student_id}")
        elif error_code == 'InvalidS3ObjectException':
            print(f"❌ Cannot access S3 object: {photo_key}")
        else:
            print(f"❌ Error indexing student {student_id}: {e}")
        return None

def index_all_student_photos():
    """
    Index all student photos from S3 photos folder
    """
    print(f"🔍 Searching for student photos in s3://{BUCKET_NAME}/{PHOTOS_PREFIX}")
    
    try:
        # List all photos in the photos folder
        response = s3.list_objects_v2(
            Bucket=BUCKET_NAME,
            Prefix=PHOTOS_PREFIX
        )
        
        if 'Contents' not in response:
            print("⚠️ No photos found in the photos folder!")
            return
        
        photos = [obj for obj in response['Contents'] if not obj['Key'].endswith('/')]
        print(f"📸 Found {len(photos)} photos to index\n")
        
        indexed_count = 0
        failed_count = 0
        
        for photo_obj in photos:
            photo_key = photo_obj['Key']
            
            # Extract student ID from filename
            # Assuming format: photos/student_12345.jpg
            filename = os.path.basename(photo_key)
            
            # Extract student ID (between 'student_' and file extension)
            if filename.startswith('student_'):
                student_id = filename.replace('student_', '').split('.')[0]
                
                # Try to convert to int to validate
                try:
                    student_id_int = int(student_id)
                    
                    # Index the photo
                    face_id = index_student_photo(BUCKET_NAME, photo_key, student_id_int)
                    
                    if face_id:
                        indexed_count += 1
                    else:
                        failed_count += 1
                        
                except ValueError:
                    print(f"⚠️ Invalid student ID format in filename: {filename}")
                    failed_count += 1
            else:
                print(f"⚠️ Skipping file (invalid naming): {filename}")
                failed_count += 1
        
        print(f"\n{'='*50}")
        print(f"✅ Successfully indexed: {indexed_count} students")
        print(f"❌ Failed: {failed_count} photos")
        print(f"{'='*50}")
        
    except ClientError as e:
        print(f"❌ Error accessing S3: {e}")

def list_indexed_faces():
    """
    List all faces currently in the collection
    """
    try:
        response = rekognition.list_faces(
            CollectionId=COLLECTION_ID,
            MaxResults=100
        )
        
        faces = response.get('Faces', [])
        print(f"\n📋 Collection '{COLLECTION_ID}' contains {len(faces)} indexed faces:")
        
        for face in faces:
            print(f"   Student ID: {face['ExternalImageId']} | Face ID: {face['FaceId']}")
        
        return faces
        
    except ClientError as e:
        print(f"❌ Error listing faces: {e}")
        return []

if __name__ == '__main__':
    print("🎓 Student Photo Indexing System\n")
    
    # Index all photos
    index_all_student_photos()
    
    # List what's in the collection
    list_indexed_faces()