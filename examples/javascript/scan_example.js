/**
 * Surmado Scan - SEO Audit Example
 * Run an SEO audit on any website.
 * Docs: https://help.surmado.com/docs/api-reference/
 */

const API_KEY = process.env.SURMADO_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://api.surmado.com/v1';

/**
 * Create a Scan (SEO audit) report.
 * @param {string} url - Website URL to audit
 * @param {string} brandName - Your brand name
 * @param {string} email - Email for notifications
 * @param {string} tier - "basic" (1 credit, $25) or "premium" (2 credits, $50)
 * @returns {Promise<Object>} Report data with report_id
 */
async function createScanReport(url, brandName, email, tier = 'basic') {
  const response = await fetch(`${BASE_URL}/reports/scan`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      brand_name: brandName,
      email,
      tier,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Get report status and results.
 * @param {string} reportId - The report ID to check
 * @returns {Promise<Object>} Report data
 */
async function getReport(reportId) {
  const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
    headers: { 'X-API-Key': API_KEY },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Poll until report completes or fails.
 * @param {string} reportId - The report ID to poll
 * @param {number} timeoutMinutes - Maximum time to wait (default 20 min)
 * @returns {Promise<Object>} Completed report data
 */
async function waitForCompletion(reportId, timeoutMinutes = 20) {
  const start = Date.now();
  const timeoutMs = timeoutMinutes * 60 * 1000;

  while (Date.now() - start < timeoutMs) {
    const report = await getReport(reportId);
    const status = report.status;

    if (status === 'completed') {
      console.log(`Report completed in ${Math.round((Date.now() - start) / 1000)} seconds`);
      return report;
    } else if (status === 'failed') {
      throw new Error(`Report failed: ${report.error}`);
    }

    console.log(`Status: ${status}. Waiting...`);
    await new Promise(resolve => setTimeout(resolve, 30000)); // Poll every 30 seconds
  }

  throw new Error(`Report did not complete within ${timeoutMinutes} minutes`);
}

// Main example
async function main() {
  try {
    // Create a Scan report
    console.log('Creating Scan report...');
    const result = await createScanReport(
      'https://example.com',
      'Example Brand',
      'you@example.com',
      'basic'
    );

    const reportId = result.report_id;
    console.log(`Report created: ${reportId}`);
    console.log(`Credits used: ${result.credits_used}`);

    // Wait for completion
    console.log('\nWaiting for report to complete...');
    const completed = await waitForCompletion(reportId);

    // Download results
    if (completed.download_url) {
      console.log(`\nPDF: ${completed.download_url}`);
    }
    if (completed.intelligence_download_url) {
      console.log(`JSON: ${completed.intelligence_download_url}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();


