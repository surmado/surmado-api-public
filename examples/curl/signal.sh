#!/bin/bash
# Surmado Signal - AI Visibility Testing
# Tests your brand across 7 AI platforms:
# ChatGPT, Perplexity, Google Gemini, Claude, Meta AI, Grok, DeepSeek
# Docs: https://help.surmado.com/docs/api-reference/

# Required: Set your API key
API_KEY="${SURMADO_API_KEY:-YOUR_API_KEY}"

# Run AI visibility test (basic tier: 1 credit, $25)
curl -X POST https://api.surmado.com/v1/reports/signal \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "brand_name": "Example Brand",
    "email": "you@example.com",
    "industry": "E-commerce",
    "location": "United States",
    "persona": "Small business owners looking for affordable solutions",
    "pain_points": "Finding reliable vendors, managing inventory costs",
    "brand_details": "We provide affordable e-commerce solutions for growing businesses",
    "direct_competitors": "Shopify, BigCommerce, WooCommerce",
    "tier": "basic"
  }'

# Response: HTTP 202 Accepted
# {
#   "report_id": "rpt_abc123...",
#   "status": "queued",
#   "credits_used": 1
# }

# Pro tier with PPTX output (2 credits, $50)
# curl -X POST https://api.surmado.com/v1/reports/signal \
#   -H "X-API-Key: $API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "url": "https://example.com",
#     "brand_name": "Example Brand",
#     "email": "you@example.com",
#     "industry": "E-commerce",
#     "location": "United States",
#     "persona": "Small business owners looking for affordable solutions",
#     "pain_points": "Finding reliable vendors, managing inventory costs",
#     "brand_details": "We provide affordable e-commerce solutions for growing businesses",
#     "direct_competitors": "Shopify, BigCommerce, WooCommerce",
#     "indirect_competitors": "Amazon, Etsy",
#     "tier": "pro",
#     "generate_pptx": true
#   }'


