# Zapier Integration

Connect Surmado to 5,000+ apps with Zapier.

## Setup

1. Create a Zap with **Webhooks by Zapier** as the trigger
2. Choose "Catch Hook" to receive Surmado webhooks
3. Copy the webhook URL Zapier provides
4. Add that URL as `webhook_url` in your Surmado API requests

## Example Zaps

### Report to Google Sheets

**Trigger:** Webhooks by Zapier (Catch Hook)
**Action:** Google Sheets (Create Spreadsheet Row)

Map fields:
- `report_id` → Column A
- `brand_name` → Column B
- `status` → Column C
- `download_url` → Column D

### Report to Slack

**Trigger:** Webhooks by Zapier (Catch Hook)
**Action:** Slack (Send Channel Message)

Message template:
```
New {{product}} report completed for {{brand_name}}
PDF: {{download_url}}
```

### Report to Email

**Trigger:** Webhooks by Zapier (Catch Hook)
**Action:** Email by Zapier (Send Outbound Email)

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

## Documentation

- [Surmado API Docs](https://help.surmado.com/docs/api-reference/)
- [Zapier Webhooks Guide](https://zapier.com/apps/webhook/integrations)


