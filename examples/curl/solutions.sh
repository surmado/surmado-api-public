#!/bin/bash
# Surmado Solutions - Multi-AI Strategic Advisory
# Get strategic recommendations from multiple AI perspectives
# Docs: https://help.surmado.com/docs/api-reference/

# Required: Set your API key
API_KEY="${SURMADO_API_KEY:-YOUR_API_KEY}"

# Run strategic advisory (always pro tier: 2 credits, $50)
curl -X POST https://api.surmado.com/v1/reports/solutions \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Example Brand",
    "email": "you@example.com",
    "business_story": "We are a 5-year-old e-commerce company selling sustainable products. Annual revenue is $2M with 15% YoY growth.",
    "decision": "Should we launch a subscription box service?",
    "success": "Generate $500K in recurring revenue within 18 months",
    "timeline": "6 months to pilot, 12 months to scale",
    "scale_indicator": "$2M annual revenue, 50K customers"
  }'

# Response: HTTP 202 Accepted
# {
#   "report_id": "rpt_abc123...",
#   "status": "queued",
#   "credits_used": 2
# }

# With optional financial context
# curl -X POST https://api.surmado.com/v1/reports/solutions \
#   -H "X-API-Key: $API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "brand_name": "Example Brand",
#     "email": "you@example.com",
#     "business_story": "We are a 5-year-old e-commerce company selling sustainable products.",
#     "decision": "Should we launch a subscription box service?",
#     "success": "Generate $500K in recurring revenue within 18 months",
#     "timeline": "6 months to pilot, 12 months to scale",
#     "scale_indicator": "$2M annual revenue",
#     "include_financial": "yes",
#     "financial_context": "Profitable but reinvesting in growth",
#     "monthly_revenue": "$170K",
#     "monthly_costs": "$140K",
#     "cash_available": "$300K"
#   }'

