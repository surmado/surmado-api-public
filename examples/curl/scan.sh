#!/bin/bash
# Surmado Scan - SEO Audit
# Docs: https://help.surmado.com/docs/api-reference/

# Required: Set your API key
API_KEY="${SURMADO_API_KEY:-YOUR_API_KEY}"

# Run a basic SEO audit (1 credit, $25)
curl -X POST https://api.surmado.com/v1/reports/scan \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "brand_name": "Example Brand",
    "email": "you@example.com",
    "tier": "basic"
  }'

# Response: HTTP 202 Accepted
# {
#   "report_id": "rpt_abc123...",
#   "status": "queued",
#   "credits_used": 1
# }

# Premium tier with competitor analysis (2 credits, $50)
# curl -X POST https://api.surmado.com/v1/reports/scan \
#   -H "X-API-Key: $API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "url": "https://example.com",
#     "brand_name": "Example Brand",
#     "email": "you@example.com",
#     "tier": "premium",
#     "competitor_urls": ["https://competitor1.com", "https://competitor2.com"]
#   }'


