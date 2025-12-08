/**
 * Surmado Webhook Handler Example
 * Receive report completion notifications via webhook.
 * Docs: https://help.surmado.com/docs/api-reference/
 */

const http = require('http');

const PORT = process.env.PORT || 8080;

/**
 * Handle incoming webhooks from Surmado.
 */
function handleWebhook(payload) {
  const { report_id, status, product } = payload;

  console.log('\n' + '='.repeat(50));
  console.log(`Webhook received for ${product} report: ${report_id}`);
  console.log(`Status: ${status}`);

  if (status === 'completed') {
    handleCompletedReport(payload);
  } else if (status === 'failed') {
    handleFailedReport(payload);
  }
}

/**
 * Handle a completed report.
 * 
 * Payload structure for completed reports:
 * {
 *   report_id: "rpt_abc123",
 *   status: "completed",
 *   product: "signal",
 *   brand_slug: "example_brand",
 *   brand_name: "Example Brand",
 *   download_url: "https://...",
 *   pptx_download_url: "https://...",
 *   intelligence_download_url: "https://...",
 *   completed_at: "2025-01-15T10:45:00Z"
 * }
 */
function handleCompletedReport(payload) {
  const { report_id, product, download_url, intelligence_download_url, pptx_download_url } = payload;

  console.log(`Report completed: ${report_id}`);

  // Download URLs are pre-signed and expire in 15 minutes
  if (download_url) {
    console.log(`PDF available: ${download_url.substring(0, 80)}...`);
    // Example: Download the PDF
    // const response = await fetch(download_url);
    // const buffer = await response.arrayBuffer();
    // fs.writeFileSync(`${report_id}.pdf`, Buffer.from(buffer));
  }

  if (pptx_download_url) {
    console.log(`PPTX available: ${pptx_download_url.substring(0, 80)}...`);
  }

  if (intelligence_download_url) {
    console.log(`JSON available: ${intelligence_download_url.substring(0, 80)}...`);
    // Example: Download and process the JSON
    // const response = await fetch(intelligence_download_url);
    // const data = await response.json();
    // Process data as needed
  }
}

/**
 * Handle a failed report.
 */
function handleFailedReport(payload) {
  const { report_id, error } = payload;
  console.log(`Report failed: ${report_id}`);
  console.log(`Error: ${error || 'Unknown error'}`);
  // Handle failure (retry, notify, etc.)
}

/**
 * HTTP server to receive webhooks.
 */
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        handleWebhook(payload);

        // Respond quickly. Surmado expects a response within 30 seconds.
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
      } catch (error) {
        console.error('Error processing webhook:', error);
        res.writeHead(500);
        res.end();
      }
    });
  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Set your webhook URL to: https://your-domain.com:${PORT}/webhook`);
  console.log('\nWaiting for webhooks...');
});


