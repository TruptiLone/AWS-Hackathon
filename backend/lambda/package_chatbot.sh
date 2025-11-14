#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Packaging Chatbot Lambda${NC}"

LAMBDA_FILE="lambda_chatbot_advanced.py"
PACKAGE_DIR="chatbot_package"
OUTPUT_ZIP="lambda_chatbot.zip"

echo "Cleaning up..."
rm -rf "$PACKAGE_DIR" "$OUTPUT_ZIP"

echo "Creating package..."
mkdir -p "$PACKAGE_DIR"
cp "$LAMBDA_FILE" "$PACKAGE_DIR/"

echo "Installing dependencies..."
cd "$PACKAGE_DIR"
pip3 install --target . boto3 --quiet --no-warn-conflicts
cd ..

echo "Creating ZIP..."
cd "$PACKAGE_DIR"
zip -r ../"$OUTPUT_ZIP" . -q
cd ..
rm -rf "$PACKAGE_DIR"

echo -e "${GREEN}✅ Package created: $OUTPUT_ZIP${NC}"
ls -lh "$OUTPUT_ZIP"