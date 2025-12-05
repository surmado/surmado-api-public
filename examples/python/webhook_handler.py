"""
Surmado Webhook Handler Example
Receive report completion notifications via webhook.
Docs: https://help.surmado.com/docs/api-reference/
"""
import json
import os
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler


class WebhookHandler(BaseHTTPRequestHandler):
    """Handle incoming webhooks from Surmado."""
    
    def do_POST(self):
        """Process webhook payload."""
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        
        try:
            payload = json.loads(body)
            self.handle_webhook(payload)
            
            # Respond quickly. Surmado expects a response within 30 seconds.
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"received": true}')
            
        except Exception as e:
            print(f"Error processing webhook: {e}")
            self.send_response(500)
            self.end_headers()
    
    def handle_webhook(self, payload: dict):
        """
        Process the webhook payload.
        
        Payload structure for completed reports:
        {
            "report_id": "rpt_abc123",
            "status": "completed",
            "product": "signal",
            "brand_slug": "example_brand",
            "brand_name": "Example Brand",
            "download_url": "https://...",
            "pptx_download_url": "https://...",
            "intelligence_download_url": "https://...",
            "completed_at": "2025-01-15T10:45:00Z"
        }
        """
        report_id = payload.get("report_id")
        status = payload.get("status")
        product = payload.get("product")
        
        print(f"\n{'='*50}")
        print(f"Webhook received for {product} report: {report_id}")
        print(f"Status: {status}")
        
        if status == "completed":
            self.handle_completed_report(payload)
        elif status == "failed":
            self.handle_failed_report(payload)
    
    def handle_completed_report(self, payload: dict):
        """Handle a completed report."""
        report_id = payload.get("report_id")
        product = payload.get("product")
        
        print(f"Report completed: {report_id}")
        
        # Download URLs are pre-signed and expire in 15 minutes
        pdf_url = payload.get("download_url")
        json_url = payload.get("intelligence_download_url")
        
        if pdf_url:
            print(f"PDF available: {pdf_url[:80]}...")
            # Example: Download the PDF
            # response = requests.get(pdf_url)
            # with open(f"{report_id}.pdf", "wb") as f:
            #     f.write(response.content)
        
        if json_url:
            print(f"JSON available: {json_url[:80]}...")
            # Example: Download and process the JSON
            # response = requests.get(json_url)
            # data = response.json()
            # Process data as needed
    
    def handle_failed_report(self, payload: dict):
        """Handle a failed report."""
        report_id = payload.get("report_id")
        error = payload.get("error", "Unknown error")
        print(f"Report failed: {report_id}")
        print(f"Error: {error}")
        # Handle failure (retry, notify, etc.)
    
    def log_message(self, format, *args):
        """Suppress default logging."""
        pass


def run_server(port: int = 8080):
    """Start the webhook server."""
    server = HTTPServer(("0.0.0.0", port), WebhookHandler)
    print(f"Webhook server running on port {port}")
    print(f"Set your webhook URL to: https://your-domain.com:{port}/webhook")
    print("\nWaiting for webhooks...")
    server.serve_forever()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    run_server(port)

