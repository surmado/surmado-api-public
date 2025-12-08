#!/bin/bash
# Check report status and download results
# Docs: https://help.surmado.com/docs/api-reference/

# Required: Set your API key
API_KEY="${SURMADO_API_KEY:-YOUR_API_KEY}"

# Replace with your report_id
REPORT_ID="${1:-rpt_abc123}"

# Check report status
echo "Checking status for report: $REPORT_ID"
curl -s https://api.surmado.com/v1/reports/$REPORT_ID \
  -H "X-API-Key: $API_KEY" | jq .

# When status is "completed", the response includes:
# - download_url: Signed URL for PDF (expires in 15 minutes)
# - pptx_download_url: Signed URL for PPTX (Pro/Premium tiers)
# - intelligence_download_url: Signed URL for full JSON data

# Example: Download the JSON data
# REPORT=$(curl -s https://api.surmado.com/v1/reports/$REPORT_ID -H "X-API-Key: $API_KEY")
# JSON_URL=$(echo $REPORT | jq -r '.intelligence_download_url')
# if [ "$JSON_URL" != "null" ]; then
#   curl -o report_data.json "$JSON_URL"
#   echo "Downloaded report data to report_data.json"
# fi


