#!/bin/bash

# Colors for output (optional, makes it prettier)
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📦 Lambda 1 Packaging Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Configuration
LAMBDA_FILE="lambda1_generate_job.py"
PACKAGE_DIR="lambda1_package"
OUTPUT_ZIP="lambda1_generate_job.zip"

# Step 1: Check if Python file exists
echo -e "${YELLOW}Step 1: Checking if $LAMBDA_FILE exists...${NC}"
if [ ! -f "$LAMBDA_FILE" ]; then
    echo -e "${RED}❌ Error: $LAMBDA_FILE not found!${NC}"
    echo -e "${RED}   Make sure you saved the file in the current directory.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Found $LAMBDA_FILE${NC}"
echo ""

# Step 2: Clean up old files
echo -e "${YELLOW}Step 2: Cleaning up old files...${NC}"
rm -rf "$PACKAGE_DIR" "$OUTPUT_ZIP"
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

# Step 3: Create package directory
echo -e "${YELLOW}Step 3: Creating package directory...${NC}"
mkdir -p "$PACKAGE_DIR"
echo -e "${GREEN}✅ Created $PACKAGE_DIR/${NC}"
echo ""

# Step 4: Copy Lambda function
echo -e "${YELLOW}Step 4: Copying Lambda function...${NC}"
cp "$LAMBDA_FILE" "$PACKAGE_DIR/"
echo -e "${GREEN}✅ Copied $LAMBDA_FILE to package${NC}"
echo ""

# Step 5: Install dependencies
echo -e "${YELLOW}Step 5: Installing dependencies (this may take 20-30 seconds)...${NC}"
cd "$PACKAGE_DIR"
pip3 install --target . boto3 --quiet
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: Failed to install dependencies${NC}"
    cd ..
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 6: Create ZIP file
echo -e "${YELLOW}Step 6: Creating ZIP archive...${NC}"
cd "$PACKAGE_DIR"
zip -r ../"$OUTPUT_ZIP" . -q
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: Failed to create ZIP file${NC}"
    cd ..
    exit 1
fi
cd ..
echo -e "${GREEN}✅ ZIP archive created${NC}"
echo ""

# Step 7: Clean up temporary directory
echo -e "${YELLOW}Step 7: Cleaning up temporary files...${NC}"
rm -rf "$PACKAGE_DIR"
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

# Step 8: Display results
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ PACKAGING COMPLETE!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Package created:${NC}"
ls -lh "$OUTPUT_ZIP"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Download the ZIP file from Cursor"
echo "2. Upload to AWS Lambda Console"
echo "3. Set handler to: lambda1_generate_job.lambda_handler"
echo ""
echo -e "${BLUE}========================================${NC}"