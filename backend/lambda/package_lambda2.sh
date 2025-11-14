#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📦 Lambda 2 Packaging Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

LAMBDA_FILE="lambda2_run_rekognition.py"
PACKAGE_DIR="lambda2_package"
OUTPUT_ZIP="lambda2_run_rekognition.zip"

# Check file exists
echo -e "${YELLOW}Step 1: Checking if $LAMBDA_FILE exists...${NC}"
if [ ! -f "$LAMBDA_FILE" ]; then
    echo -e "${RED}❌ Error: $LAMBDA_FILE not found!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Found $LAMBDA_FILE${NC}"
echo ""

# Clean up
echo -e "${YELLOW}Step 2: Cleaning up old files...${NC}"
rm -rf "$PACKAGE_DIR" "$OUTPUT_ZIP"
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

# Create package
echo -e "${YELLOW}Step 3: Creating package directory...${NC}"
mkdir -p "$PACKAGE_DIR"
echo -e "${GREEN}✅ Created $PACKAGE_DIR/${NC}"
echo ""

# Copy Lambda
echo -e "${YELLOW}Step 4: Copying Lambda function...${NC}"
cp "$LAMBDA_FILE" "$PACKAGE_DIR/"
echo -e "${GREEN}✅ Copied $LAMBDA_FILE${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}Step 5: Installing dependencies...${NC}"
cd "$PACKAGE_DIR"
pip3 install --target . boto3 --quiet --no-warn-conflicts 2>&1 | grep -v "dependency conflicts" | grep -v "awscli" || true
cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Create ZIP
echo -e "${YELLOW}Step 6: Creating ZIP archive...${NC}"
cd "$PACKAGE_DIR"
zip -r ../"$OUTPUT_ZIP" . -q
cd ..
echo -e "${GREEN}✅ ZIP created${NC}"
echo ""

# Clean up
echo -e "${YELLOW}Step 7: Cleaning up...${NC}"
rm -rf "$PACKAGE_DIR"
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

# Results
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ LAMBDA 2 PACKAGING COMPLETE!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
ls -lh "$OUTPUT_ZIP"
echo ""
echo -e "${GREEN}Next: Upload to Lambda and set handler to:${NC}"
echo "lambda2_run_rekognition.lambda_handler"
echo ""