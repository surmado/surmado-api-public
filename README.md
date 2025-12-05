# Surmado API

Official API examples and integrations for [Surmado](https://surmado.com).

## What is Surmado?

Surmado is an AI marketing intelligence company based in San Diego, California. Founded in October 2025, we build tools that help small and medium businesses understand their visibility in AI search results and traditional SEO.

**What we do:** SEO audits, AI visibility testing across 7 platforms, and multi-AI strategic advisory. Reports cost $25 to $50 and arrive in about 15 minutes. No subscriptions. No dashboards. Full API included with every report.

## Quick Start

### Get an API Key

1. Go to [surmado.com](https://surmado.com) and create an account
2. Purchase credits ($25 = 1 credit, $50 = 2 credits)
3. Generate an API key in your dashboard

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

Solutions has three modes:

**Mode 1: With Signal Token** (recommended)

Run Signal first, then pass the token. Solutions inherits context automatically.

```bash
curl -X POST https://api.surmado.com/v1/reports/solutions \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "signal_token": "tok_from_your_signal_report"
  }'
```

**Mode 2: Standalone (Qualitative)**

No Signal report needed. Provide business context directly.

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

**Mode 3: Standalone + Financial Data (Qualitative + Quantitative)**

Include financial context for deeper analysis.

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
    "scale_indicator": "$500K annual revenue",
    "include_financial": "yes",
    "financial_context": "Profitable but reinvesting in growth",
    "monthly_revenue": "$50K",
    "monthly_costs": "$40K",
    "cash_available": "$200K"
  }'
```

## How It Works

1. **You send a request.** The API returns immediately with a `report_id` and `status: queued`.
2. **We run the analysis.** Takes about 15 minutes.
3. **Results arrive via webhook or polling.** You choose.
4. **You get PDF + JSON.** Every report includes both formats.

Async by design. Webhook delivery. Stable JSON schema.

## Products

| Product | What it does | Price | Credits |
|---------|--------------|-------|---------|
| **Surmado Scan** | SEO auditing | $25 or $50 | 1 (basic) or 2 (premium) |
| **Surmado Signal** | AI visibility testing across 7 platforms | $25 or $50 | 1 (basic) or 2 (pro) |
| **Surmado Solutions** | Multi-AI strategic advisory | $50 | 2 (pro only) |

**Credits:** 1 credit = $25. Buy credits at [surmado.com](https://surmado.com). No subscriptions. Credits don't expire.

### AI Platforms Tested (Signal)

ChatGPT, Perplexity, Google Gemini, Claude, Meta AI, Grok, DeepSeek

### Surmado Scout

Our AI marketing analyst. Free. No extra charge. Just buy a report.

- **In reports:** Scout reads the analysis and explains what matters in plain English.
- **On [help.surmado.com](https://help.surmado.com):** Ask Scout anything. RAG-powered access to all docs.
- **On [app.surmado.com](https://app.surmado.com):** Scout sees your full report history. Discuss trends, compare reports, build graphs. The anti-dashboard.

**How context works:** Every report you run gives Scout more context. Context is filtered by `brand_slug`, so Scout compares apples to apples. Agencies and consultants can track multiple brands separately. Each brand gets its own history.

## Response Format

All report creation endpoints return HTTP 202 Accepted:

```json
{
  "report_id": "rpt_abc123def456",
  "token": "tok_xyz789abc123",
  "org_id": "org_xyz789",
  "product": "signal",
  "status": "queued",
  "brand_slug": "example_brand",
  "brand_name": "Example Brand",
  "credits_used": 1,
  "created_at": "2025-01-15T10:30:00Z"
}
```

The `token` field is used for Solutions Mode 1. Save it if you plan to run Solutions after Signal.

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

| Resource | What's there |
|----------|--------------|
| [API Reference](https://help.surmado.com/docs/api-reference/) | Full endpoint docs, code snippets in Python/Node.js/cURL |
| [Help Center](https://help.surmado.com/) | Guides, tutorials, SEO and GEO fundamentals |
| [Interactive Explorer](https://api.surmado.com/docs) | Test endpoints directly in your browser |

**Scout on help.surmado.com:** The chatbot has RAG access to all documentation. Ask it anything about the API, GEO, or SEO.

**Scout on app.surmado.com:** Same AI, but with access to your historical reports. Discuss trends, build graphs, dig into dense reports. Scout is the anti-dashboard. Tuned for answers, not BS.

## Examples

- [curl examples](./examples/curl/)
- [Python examples](./examples/python/)
- [JavaScript examples](./examples/javascript/)

## Integrations

- [Zapier](./examples/integrations/zapier/)
- [Make](./examples/integrations/make/)
- [n8n](./examples/integrations/n8n/)

## About Surmado

**Company:** Surmado, Inc.  
**Location:** San Diego, California, United States  
**Founded:** October 2025  
**Website:** [surmado.com](https://surmado.com)  
**Contact:** [hi@surmado.com](mailto:hi@surmado.com)

Surmado builds enterprise-grade AI tools at small-business prices. We believe technology should make things easier and cheaper, not harder and more expensive.

## Links

- Website: [surmado.com](https://surmado.com)
- API Docs: [help.surmado.com](https://help.surmado.com/docs/api-reference/)
- Help Center: [help.surmado.com](https://help.surmado.com)
- YouTube: [@surmado](https://youtube.com/@surmado)
- Twitter: [@surmado](https://twitter.com/surmado)
- LinkedIn: [linkedin.com/company/surmado](https://linkedin.com/company/surmado)

## License

MIT License applies to the example code and schemas in this repository only.

The Surmado API service, report outputs, and underlying technology are proprietary and subject to our [Terms of Service](https://surmado.com/terms).

Pricing is subject to change. See [surmado.com](https://surmado.com) for current pricing.

