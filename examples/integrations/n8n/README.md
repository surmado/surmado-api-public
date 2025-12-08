# n8n Integration

Connect Surmado to your self-hosted automation workflows with n8n.

## Setup

1. Create a new Workflow in n8n
2. Add a **Webhook** node as the trigger
3. Set HTTP Method to POST
4. Copy the webhook URL n8n provides (Production or Test URL)
5. Add that URL as `webhook_url` in your Surmado API requests

## Example Workflows

### Report to PostgreSQL

```
[Webhook] → [Postgres: Insert Row]
```

Store report metadata in your database for tracking and analysis.

### Report to S3

```
[Webhook] → [HTTP Request: Download PDF] → [AWS S3: Upload]
```

Archive reports to your own storage.

### Report with Slack Notification

```
[Webhook] → [Slack: Send Message]
```

Get notified when reports complete.

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

## Calling the Surmado API from n8n

Trigger Surmado reports from n8n:

1. Add an **HTTP Request** node
2. Configure:
   - Method: POST
   - URL: `https://api.surmado.com/v1/reports/signal`
   - Authentication: Header Auth
   - Header Name: `X-API-Key`
   - Header Value: Your API key
   - Body Content Type: JSON
   - Body: Your report parameters

## Example: Scheduled Weekly Reports

```
[Schedule Trigger: Weekly] → [HTTP Request: Create Report] → [Wait] → [HTTP Request: Get Report] → [Slack: Send Message]
```

## Documentation

- [Surmado API Docs](https://help.surmado.com/docs/api-reference/)
- [n8n Webhook Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)


