# Make (Integromat) Integration

Connect Surmado to 1,000+ apps with Make.

## Setup

1. Create a new Scenario in Make
2. Add a **Webhooks** module as the trigger
3. Choose "Custom webhook"
4. Copy the webhook URL Make provides
5. Add that URL as `webhook_url` in your Surmado API requests

## Example Scenarios

### Report to Google Sheets

1. **Trigger:** Webhooks → Custom webhook
2. **Action:** Google Sheets → Add a Row

Map the webhook data to your spreadsheet columns.

### Report to Notion

1. **Trigger:** Webhooks → Custom webhook
2. **Action:** Notion → Create a Database Item

Create a database with properties for report_id, brand_name, status, and download_url.

### Report to Airtable

1. **Trigger:** Webhooks → Custom webhook
2. **Action:** Airtable → Create a Record

## Webhook Payload

When your report completes, Surmado sends:

```json
{
  "report_id": "rpt_abc123",
  "product": "signal",
  "status": "completed",
  "brand_name": "Your Brand",
  "download_url": "https://...",
  "intelligence_download_url": "https://..."
}
```

## Calling the Surmado API from Make

You can also trigger Surmado reports from Make:

1. Add an **HTTP** module
2. Choose "Make a request"
3. Configure:
   - URL: `https://api.surmado.com/v1/reports/signal`
   - Method: POST
   - Headers: `X-API-Key: YOUR_API_KEY`, `Content-Type: application/json`
   - Body: Your report parameters as JSON

## Documentation

- [Surmado API Docs](https://help.surmado.com/docs/api-reference/)
- [Make Webhooks Guide](https://www.make.com/en/help/tools/webhooks)


