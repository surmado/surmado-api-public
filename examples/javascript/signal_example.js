/**
 * Surmado Signal - AI Visibility Testing Example
 * Test how your brand appears across 7 AI platforms:
 * ChatGPT, Perplexity, Google Gemini, Claude, Meta AI, Grok, DeepSeek
 * Docs: https://help.surmado.com/docs/api-reference/
 */

const API_KEY = process.env.SURMADO_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://api.surmado.com/v1';

/**
 * Create a Signal (AI visibility) report.
 * @param {Object} params - Report parameters
 * @returns {Promise<Object>} Report data with report_id
 */
async function createSignalReport({
  url,
  brandName,
  email,
  industry,
  location,
  persona,
  painPoints,
  brandDetails,
  directCompetitors,
  tier = 'basic',
}) {
  const response = await fetch(`${BASE_URL}/reports/signal`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      brand_name: brandName,
      email,
      industry,
      location,
      persona,
      pain_points: painPoints, // Must be a string, not an array
      brand_details: brandDetails,
      direct_competitors: directCompetitors, // Must be a string, not an array
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
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  throw new Error(`Report did not complete within ${timeoutMinutes} minutes`);
}

// Main example
async function main() {
  try {
    // Create a Signal report
    console.log('Creating Signal report...');
    const result = await createSignalReport({
      url: 'https://example.com',
      brandName: 'Example Brand',
      email: 'you@example.com',
      industry: 'E-commerce',
      location: 'United States',
      persona: 'Small business owners looking for affordable solutions',
      painPoints: 'Finding reliable vendors, managing inventory costs',
      brandDetails: 'We provide affordable e-commerce solutions for growing businesses',
      directCompetitors: 'Shopify, BigCommerce, WooCommerce',
      tier: 'basic',
    });

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
    if (completed.pptx_download_url) {
      console.log(`PPTX: ${completed.pptx_download_url}`);
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

