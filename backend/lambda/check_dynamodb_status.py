#!/usr/bin/env python3
"""Check DynamoDB for students with different status values"""
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('StudentlyticsData')

# Query all records for record_test006
response = table.scan(
    FilterExpression='begins_with(record_id, :rid_prefix)',
    ExpressionAttributeValues={':rid_prefix': 'record_test006'}
)

items = response.get('Items', [])

print(f"Found {len(items)} records for record_test006\n")
print("="*80)

for item in items:
    student_id = item.get('student_id')
    student_name = item.get('student_name', 'Unknown')
    status = item.get('status')
    
    print(f"Student ID: {student_id}")
    print(f"Name: {student_name}")
    print(f"Status: {status} (type: {type(status).__name__})")
    print(f"Status value: {repr(status)}")
    print("-"*80)

# Also check if there are any students with 'false' status in ANY record
print("\n\nChecking for records with status='false' (string)...")
print("="*80)

response_all = table.scan()
all_items = response_all.get('Items', [])

false_string_count = 0
false_bool_count = 0
true_string_count = 0
true_bool_count = 0

for item in all_items:
    status = item.get('status')
    if status == 'false' or status == 'False':
        false_string_count += 1
        print(f"Found string 'false': {item.get('student_id')}, session: {item.get('record_id')}")
    elif status == False:
        false_bool_count += 1
    elif status == 'true' or status == 'True':
        true_string_count += 1
    elif status == True:
        true_bool_count += 1

print(f"\nSummary:")
print(f"  Students with status='false' (string): {false_string_count}")
print(f"  Students with status=False (boolean): {false_bool_count}")
print(f"  Students with status='true' (string): {true_string_count}")
print(f"  Students with status=True (boolean): {true_bool_count}")

