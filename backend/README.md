# Infrastructure Setup

## AWS Resources

### DynamoDB Table
- **Name:** `StudentlyticsData`
- **Partition Key:** `record_id` (String)
- **Billing Mode:** On-demand

### S3 Buckets
- **Name:** `hackathon-attendance-media`
- **Folders:**
  - `photos/` - Student headshots
  - `videos/` - Class recordings
  - `rekognition-results/` - Processed JSON results

### Rekognition Collection
- **Collection ID:** `hackathon-student-faces`

### Lambda Functions
1. **GenerateJobForVideo** - 1024 MB, 2 min timeout
2. **RunRekognition** - 2048 MB, 15 min timeout
3. **ProcessAndStore** - 1024 MB, 5 min timeout

### IAM Role
- **Name:** `Lambda-Rekognition-Role`
- **Permissions:**
  - S3 Read/Write
  - Rekognition Full Access
  - DynamoDB Full Access
  - CloudWatch Logs

### Step Functions
- **Name:** `VideoProcessingPipeline`
- **Type:** Standard

### EventBridge Rule
- **Name:** `TriggerVideoProcessingPipeline`
- **Event Pattern:** S3 Object Created in videos/ folder
- **Target:** VideoProcessingPipeline