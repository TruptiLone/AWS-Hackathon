import boto3
import json
import time
from datetime import datetime

rekognition = boto3.client('rekognition', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

def lambda_handler(event, context):
    """
    Lambda 2: Run Rekognition face search on video
    """
    print("=" * 60)
    print("LAMBDA 2: Run Rekognition Face Search")
    print("=" * 60)
    
    # Get data from Lambda 1
    job_id = event['job_id']
    record_id = event['record_id']
    bucket = event['bucket']
    video_key = event['video_key']
    collection_id = event['collection_id']
    student_ids = event.get('student_ids', [])
    
    print(f"\nJob Info:")
    print(f"  Job ID: {job_id}")
    print(f"  Record ID: {record_id}")
    print(f"  Video: s3://{bucket}/{video_key}")
    print(f"  Expected students: {len(student_ids)}")
    
    # Start Rekognition face search
    print(f"\nStarting Rekognition face search...")
    
    try:
        response = rekognition.start_face_search(
            Video={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': video_key
                }
            },
            CollectionId=collection_id,
            FaceMatchThreshold=80.0
        )
        
        rekognition_job_id = response['JobId']
        print(f"Rekognition job started: {rekognition_job_id}")
        
    except Exception as e:
        print(f"Error starting Rekognition: {e}")
        return {
            'job_id': job_id,
            'record_id': record_id,
            'status': 'rekognition_failed',
            'error': str(e)
        }
    
    # Wait for Rekognition to complete
    print(f"\nWaiting for Rekognition to process video...")
    
    max_wait = 600  # 10 minutes
    start_time = time.time()
    check_count = 0
    
    while time.time() - start_time < max_wait:
        try:
            status_response = rekognition.get_face_search(JobId=rekognition_job_id)
            status = status_response['JobStatus']
            
            check_count += 1
            elapsed = int(time.time() - start_time)
            
            # Only print every 3rd check to reduce logs
            if check_count % 3 == 0:
                print(f"  [{elapsed}s] Status: {status}")
            
            if status == 'SUCCEEDED':
                print(f"\nRekognition completed in {elapsed}s!")
                break
            elif status == 'FAILED':
                error_msg = status_response.get('StatusMessage', 'Unknown error')
                print(f"\nRekognition job failed: {error_msg}")
                return {
                    'job_id': job_id,
                    'record_id': record_id,
                    'status': 'rekognition_failed',
                    'error': error_msg
                }
            
            time.sleep(10)
            
        except Exception as e:
            print(f"  Error checking status: {e}")
            time.sleep(10)
    else:
        print(f"\nTimeout after {max_wait}s")
        return {
            'job_id': job_id,
            'record_id': record_id,
            'rekognition_job_id': rekognition_job_id,
            'status': 'rekognition_timeout'
        }
    
    # Get all results with pagination
    print(f"\nRetrieving face detection results...")
    
    all_persons = []
    next_token = None
    page_count = 0
    
    while True:
        page_count += 1
        
        params = {'JobId': rekognition_job_id, 'MaxResults': 1000}
        if next_token:
            params['NextToken'] = next_token
        
        try:
            result = rekognition.get_face_search(**params)
            
            if 'Persons' in result:
                persons_in_page = len(result['Persons'])
                all_persons.extend(result['Persons'])
                print(f"  Page {page_count}: {persons_in_page} detections")
            
            next_token = result.get('NextToken')
            if not next_token:
                break
                
        except Exception as e:
            print(f"  Error fetching results: {e}")
            break
    
    print(f"Total detections: {len(all_persons)}")
    
    # Process results - include ALL students (detected and not detected)
    print(f"\nProcessing results for ALL students...")
    structured_results = process_rekognition_results_with_absences(
        all_persons, 
        student_ids
    )
    
    detected_count = sum(1 for data in structured_results.values() if data['PresenceDuration(sec)'] > 0)
    absent_count = len(structured_results) - detected_count
    
    print(f"Students detected in video: {detected_count}")
    print(f"Students NOT detected (absent): {absent_count}")
    
    # Save results to S3
    results_key = f"rekognition-results/{record_id}_results.json"
    
    print(f"\nSaving results to S3...")
    
    try:
        results_content = {
            'job_id': job_id,
            'record_id': record_id,
            'rekognition_job_id': rekognition_job_id,
            'processed_at': datetime.now().isoformat(),
            'total_detections': len(all_persons),
            'students_expected': len(student_ids),
            'students_detected': detected_count,
            'students_absent': absent_count,
            'student_data': structured_results
        }
        
        s3.put_object(
            Bucket=bucket,
            Key=results_key,
            Body=json.dumps(results_content, indent=2),
            ContentType='application/json'
        )
        
        print(f"Results saved")
        
    except Exception as e:
        print(f"Error saving to S3: {e}")
        return {
            'job_id': job_id,
            'record_id': record_id,
            'status': 's3_save_failed',
            'error': str(e)
        }
    
    # Output
    output = {
        'job_id': job_id,
        'record_id': record_id,
        'bucket': bucket,
        'video_key': video_key,
        'results_key': results_key,
        'rekognition_job_id': rekognition_job_id,
        'student_ids': student_ids,
        'total_detections': len(all_persons),
        'students_detected': detected_count,
        'students_absent': absent_count,
        'status': 'rekognition_complete'
    }
    
    print("\n" + "=" * 60)
    print("LAMBDA 2 COMPLETE")
    print("=" * 60)
    
    return output


def process_rekognition_results_with_absences(persons, expected_student_ids):
    """
    Process Rekognition results and include students NOT detected
    
    Returns data for ALL students (present and absent)
    """
    # First, process detected students
    student_detections = {}
    
    for person in persons:
        timestamp_ms = person.get('Timestamp', 0)
        face_matches = person.get('FaceMatches', [])
        
        if not face_matches:
            continue
        
        best_match = face_matches[0]
        matched_face = best_match.get('Face', {})
        similarity = best_match.get('Similarity', 0)
        
        if similarity < 80:
            continue
        
        try:
            student_id = str(int(matched_face['ExternalImageId']))
        except (ValueError, KeyError):
            continue
        
        # Get face details
        person_face = person.get('Person', {}).get('Face', {})
        confidence = person_face.get('Confidence', 0)
        
        pose = person_face.get('Pose', {})
        yaw = pose.get('Yaw', 0)
        pitch = pose.get('Pitch', 0)
        roll = pose.get('Roll', 0)
        
        quality = person_face.get('Quality', {})
        brightness = quality.get('Brightness', 0)
        sharpness = quality.get('Sharpness', 0)
        
        bbox = person_face.get('BoundingBox', {})
        bbox_width = bbox.get('Width', 0)
        bbox_height = bbox.get('Height', 0)
        bbox_size = bbox_width * bbox_height
        
        # Initialize or update student data
        if student_id not in student_detections:
            student_detections[student_id] = {
                'timestamps': [],
                'confidences': [],
                'similarities': [],
                'yaws': [],
                'pitches': [],
                'rolls': [],
                'brightnesses': [],
                'sharpnesses': [],
                'bbox_sizes': []
            }
        
        student_detections[student_id]['timestamps'].append(timestamp_ms)
        student_detections[student_id]['confidences'].append(confidence)
        student_detections[student_id]['similarities'].append(similarity)
        student_detections[student_id]['yaws'].append(yaw)
        student_detections[student_id]['pitches'].append(pitch)
        student_detections[student_id]['rolls'].append(roll)
        student_detections[student_id]['brightnesses'].append(brightness)
        student_detections[student_id]['sharpnesses'].append(sharpness)
        student_detections[student_id]['bbox_sizes'].append(bbox_size)
    
    # Now create results for ALL expected students
    results = {}
    
    for student_id in expected_student_ids:
        student_id_str = str(student_id)
        
        if student_id_str in student_detections:
            # Student WAS detected - calculate metrics
            data = student_detections[student_id_str]
            timestamps = data['timestamps']
            
            timestamp_start = min(timestamps)
            timestamp_end = max(timestamps)
            presence_duration_sec = (timestamp_end - timestamp_start) / 1000.0
            
            results[student_id_str] = {
                'StudentName': student_id_str,
                'TimestampStart': timestamp_start,
                'TimestampEnd': timestamp_end,
                'PresenceDuration(sec)': round(presence_duration_sec, 2),
                'AvgConfidence': round(sum(data['confidences']) / len(data['confidences']), 1),
                'AvgSimilarity': round(sum(data['similarities']) / len(data['similarities']), 1),
                'AvgYaw': round(sum(data['yaws']) / len(data['yaws']), 2),
                'AvgPitch': round(sum(data['pitches']) / len(data['pitches']), 2),
                'AvgRoll': round(sum(data['rolls']) / len(data['rolls']), 2),
                'AvgBrightness': round(sum(data['brightnesses']) / len(data['brightnesses']), 1),
                'AvgSharpness': round(sum(data['sharpnesses']) / len(data['sharpnesses']), 2),
                'AvgBoundingBoxSize': round(sum(data['bbox_sizes']) / len(data['bbox_sizes']), 5)
            }
            
            print(f"  Student {student_id_str}: PRESENT ({presence_duration_sec:.1f}s)")
            
        else:
            # Student was NOT detected - create absent record with zeros
            results[student_id_str] = {
                'StudentName': student_id_str,
                'TimestampStart': 0,
                'TimestampEnd': 0,
                'PresenceDuration(sec)': 0,
                'AvgConfidence': 0,
                'AvgSimilarity': 0,
                'AvgYaw': 0,
                'AvgPitch': 0,
                'AvgRoll': 0,
                'AvgBrightness': 0,
                'AvgSharpness': 0,
                'AvgBoundingBoxSize': 0
            }
            
            print(f"  Student {student_id_str}: ABSENT (not detected)")
    
    return results