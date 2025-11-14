#!/bin/bash

echo "📦 Packaging Lambda function..."

# Create deployment directory
mkdir -p lambda_package
cd lambda_package

# Copy Lambda function
cp ../rekognition_video_processor.py .

# Install dependencies (boto3 is included in Lambda runtime, but adding for completeness)
pip3 install --target . boto3

# Create ZIP file
zip -r ../rekognition_lambda.zip .

cd ..
rm -rf lambda_package

echo "✅ Lambda package created: rekognition_lambda.zip"
ls -lh rekognition_lambda.zip