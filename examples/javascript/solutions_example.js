/**
 * Surmado Solutions - Multi-AI Strategic Advisory Example
 * Get strategic recommendations from multiple AI perspectives.
 * Docs: https://help.surmado.com/docs/api-reference/
 */

const API_KEY = process.env.SURMADO_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://api.surmado.com/v1';

/**
 * Create a Solutions (strategic advisory) report.
 * Always uses Pro tier: 2 credits, $50.
 * @param {Object} params - Report parameters
 * @returns {Promise<Object>} Report data with report_id
 */
async function createSolutionsReport({
  brandName,
  email,
  businessStory,
  decision,
  success,
  timeline,
  scaleIndicator,
}) {
  const response = await fetch(`${BASE_URL}/reports/solutions`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      brand_name: brandName,
      email,
      business_story: businessStory,
      decision,
      success,
      timeline,
      scale_indicator: scaleIndicator,
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
    // Create a Solutions report
    console.log('Creating Solutions report...');
    const result = await createSolutionsReport({
      brandName: 'Example Brand',
      email: 'you@example.com',
      businessStory: 'We are a 5-year-old e-commerce company selling sustainable products. Annual revenue is $2M with 15% YoY growth. Team of 12 people.',
      decision: 'Should we launch a subscription box service?',
      success: 'Generate $500K in recurring revenue within 18 months while maintaining current profit margins',
      timeline: '6 months to pilot, 12 months to scale nationally',
      scaleIndicator: '$2M annual revenue, 50K customers, 12 employees',
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
    if (completed.intelligence_download_url) {
      console.log(`JSON: ${completed.intelligence_download_url}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

