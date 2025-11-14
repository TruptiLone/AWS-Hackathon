#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📦 Lambda 3 Packaging Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

LAMBDA_FILE="lambda3_process_and_store.py"
PACKAGE_DIR="lambda3_package"
OUTPUT_ZIP="lambda3_process_and_store.zip"

echo -e "${YELLOW}Step 1: Checking if $LAMBDA_FILE exists...${NC}"
if [ ! -f "$LAMBDA_FILE" ]; then
    echo -e "${RED}❌ Error: $LAMBDA_FILE not found!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Found $LAMBDA_FILE${NC}"
echo ""

echo -e "${YELLOW}Step 2: Cleaning up...${NC}"
rm -rf "$PACKAGE_DIR" "$OUTPUT_ZIP"
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

echo -e "${YELLOW}Step 3: Creating package...${NC}"
mkdir -p "$PACKAGE_DIR"
cp "$LAMBDA_FILE" "$PACKAGE_DIR/"
echo -e "${GREEN}✅ Package created${NC}"
echo ""

echo -e "${YELLOW}Step 4: Installing dependencies...${NC}"
cd "$PACKAGE_DIR"
pip3 install --target . boto3 --quiet --no-warn-conflicts 2>&1 | grep -v "dependency conflicts" | grep -v "awscli" || true
cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 5: Creating ZIP...${NC}"
cd "$PACKAGE_DIR"
zip -r ../"$OUTPUT_ZIP" . -q
cd ..
echo -e "${GREEN}✅ ZIP created${NC}"
echo ""

echo -e "${YELLOW}Step 6: Cleaning up...${NC}"
rm -rf "$PACKAGE_DIR"
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ LAMBDA 3 PACKAGING COMPLETE!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
ls -lh "$OUTPUT_ZIP"
echo ""
echo -e "${GREEN}Next: Upload to Lambda and set handler to:${NC}"
echo "lambda3_process_and_store.lambda_handler"
echo ""