# Surmado API

Official API examples and integrations for Surmado.

Surmado is AI marketing intelligence for small business. SEO audits, AI visibility testing, and strategic analysis. Reports from $25. No subscriptions.

## Quick Start

### Authentication

All API requests require an API key. Pass it in the `X-API-Key` header:

```bash
X-API-Key: sur_live_YOUR_KEY
```

Test keys start with `sur_test_`. Live keys start with `sur_live_`.

### Run an SEO Audit (Scan)

```bash
curl -X POST https://api.surmado.com/v1/reports/scan \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "brand_name": "Example Brand",
    "email": "you@example.com"
  }'
```

### Run an AI Visibility Test (Signal)

```bash
curl -X POST https://api.surmado.com/v1/reports/signal \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "brand_name": "Example Brand",
    "email": "you@example.com",
    "industry": "E-commerce",
    "location": "United States",
    "persona": "Small business owners looking for affordable solutions",
    "pain_points": "Finding reliable vendors, managing costs",
    "brand_details": "Affordable solutions for growing businesses",
    "direct_competitors": "Competitor A, Competitor B"
  }'
```

### Run Strategic Advisory (Solutions)

```bash
curl -X POST https://api.surmado.com/v1/reports/solutions \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Example Brand",
    "email": "you@example.com",
    "business_story": "We help small businesses grow online",
    "decision": "Should we expand to new markets?",
    "success": "Increase revenue by 50% in 12 months",
    "timeline": "6-12 months",
    "scale_indicator": "$500K annual revenue"
  }'
```

## How It Works

1. **You send a request.** The API returns immediately with a `report_id` and `status: queued`.
2. **We run the analysis.** Takes about 15 minutes.
3. **Results arrive via webhook or polling.** You choose.
4. **You get PDF + JSON.** Every report includes both formats.

Async by design. Webhook delivery. Stable JSON schema.

## Products

| Product | What it does | Price | Tiers |
|---------|--------------|-------|-------|
| **Surmado Scan** | SEO auditing | $25 or $50 | basic (1 credit), premium (2 credits) |
| **Surmado Signal** | AI visibility testing across 7 platforms | $25 or $50 | basic (1 credit), pro (2 credits) |
| **Surmado Solutions** | Multi-AI strategic advisory | $50 | pro (2 credits) |

### AI Platforms Tested (Signal)

ChatGPT, Perplexity, Google Gemini, Claude, Meta AI, Grok, DeepSeek

### Surmado Scout

Our AI marketing analyst. Scout reads every report and explains what matters in plain English. Included free with every report.

## Response Format

All report creation endpoints return HTTP 202 Accepted:

```json
{
  "report_id": "rpt_abc123def456",
  "org_id": "org_xyz789",
  "product": "scan",
  "status": "queued",
  "brand_slug": "example_brand",
  "brand_name": "Example Brand",
  "credits_used": 1,
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Checking Status

Poll the report endpoint or use webhooks:

```bash
curl https://api.surmado.com/v1/reports/rpt_abc123def456 \
  -H "X-API-Key: YOUR_API_KEY"
```

### Completed Report

When `status` is `completed`, you get download URLs:

```json
{
  "report_id": "rpt_abc123def456",
  "status": "completed",
  "download_url": "https://storage.googleapis.com/...",
  "pptx_download_url": "https://storage.googleapis.com/...",
  "intelligence_download_url": "https://storage.googleapis.com/...",
  "completed_at": "2025-01-15T10:45:00Z"
}
```

| Field | Description |
|-------|-------------|
| `download_url` | Signed PDF URL (expires in 15 minutes) |
| `pptx_download_url` | Signed PPTX URL (Pro/Premium tiers only) |
| `intelligence_download_url` | Signed JSON URL with full report data |

## Webhooks

Add `webhook_url` to any request to receive a POST when the report completes:

```json
{
  "brand_name": "Example Brand",
  "email": "you@example.com",
  "webhook_url": "https://your-server.com/webhook"
}
```

Requirements:
- HTTPS only
- No private/internal IPs
- Must respond within 30 seconds

## Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `401 Unauthorized` | 401 | Invalid or missing API key |
| `402 Payment Required` | 402 | Insufficient credits |
| `404 Not Found` | 404 | Report or brand not found |
| `422 Unprocessable Entity` | 422 | Invalid request data |
| `429 Too Many Requests` | 429 | Rate limit exceeded |

## Documentation

Full API documentation: [help.surmado.com/docs/api-reference/](https://help.surmado.com/docs/api-reference/)

Interactive API explorer: [api.surmado.com/docs](https://api.surmado.com/docs)

## Examples

- [curl examples](./examples/curl/)
- [Python examples](./examples/python/)
- [JavaScript examples](./examples/javascript/)

## Integrations

- [Zapier](./examples/integrations/zapier/)
- [Make](./examples/integrations/make/)
- [n8n](./examples/integrations/n8n/)

## Links

- Website: [surmado.com](https://surmado.com)
- API Docs: [help.surmado.com](https://help.surmado.com/docs/api-reference/)
- Contact: [hi@surmado.com](mailto:hi@surmado.com)
- Twitter: [@surmado](https://twitter.com/surmado)
- LinkedIn: [linkedin.com/company/surmado](https://linkedin.com/company/surmado)

## License

MIT License applies to the example code and schemas in this repository only.

The Surmado API service, report outputs, and underlying technology are proprietary and subject to our [Terms of Service](https://surmado.com/terms).

Pricing is subject to change. See [surmado.com](https://surmado.com) for current pricing.

