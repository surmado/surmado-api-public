"""
Surmado Signal - AI Visibility Testing Example
Test how your brand appears across 7 AI platforms:
ChatGPT, Perplexity, Google Gemini, Claude, Meta AI, Grok, DeepSeek
Docs: https://help.surmado.com/docs/api-reference/
"""
import os
import time
import requests

API_KEY = os.environ.get("SURMADO_API_KEY", "YOUR_API_KEY")
BASE_URL = "https://api.surmado.com/v1"


def create_signal_report(
    url: str,
    brand_name: str,
    email: str,
    industry: str,
    location: str,
    persona: str,
    pain_points: str,
    brand_details: str,
    direct_competitors: str,
    tier: str = "basic",
):
    """
    Create a Signal (AI visibility) report.
    
    Args:
        url: Your website URL
        brand_name: Your brand name
        email: Email for notifications
        industry: Your industry/sector
        location: Primary market location
        persona: Target customer description
        pain_points: Problems your product solves (string, not list)
        brand_details: Your brand positioning
        direct_competitors: Comma-separated competitor names (string, not list)
        tier: "basic" (1 credit, $25) or "pro" (2 credits, $50)
    
    Returns:
        Report data with report_id
    """
    response = requests.post(
        f"{BASE_URL}/reports/signal",
        headers={
            "X-API-Key": API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "url": url,
            "brand_name": brand_name,
            "email": email,
            "industry": industry,
            "location": location,
            "persona": persona,
            "pain_points": pain_points,  # Must be a string
            "brand_details": brand_details,
            "direct_competitors": direct_competitors,  # Must be a string
            "tier": tier,
        },
    )
    response.raise_for_status()
    return response.json()


def get_report(report_id: str):
    """Get report status and results."""
    response = requests.get(
        f"{BASE_URL}/reports/{report_id}",
        headers={"X-API-Key": API_KEY},
    )
    response.raise_for_status()
    return response.json()


def wait_for_completion(report_id: str, timeout_minutes: int = 20):
    """Poll until report completes or fails."""
    start = time.time()
    timeout_seconds = timeout_minutes * 60
    
    while time.time() - start < timeout_seconds:
        report = get_report(report_id)
        status = report.get("status")
        
        if status == "completed":
            print(f"Report completed in {int(time.time() - start)} seconds")
            return report
        elif status == "failed":
            raise Exception(f"Report failed: {report.get('error')}")
        
        print(f"Status: {status}. Waiting...")
        time.sleep(30)
    
    raise TimeoutError(f"Report did not complete within {timeout_minutes} minutes")


if __name__ == "__main__":
    # Create a Signal report
    print("Creating Signal report...")
    result = create_signal_report(
        url="https://example.com",
        brand_name="Example Brand",
        email="you@example.com",
        industry="E-commerce",
        location="United States",
        persona="Small business owners looking for affordable solutions",
        pain_points="Finding reliable vendors, managing inventory costs",
        brand_details="We provide affordable e-commerce solutions for growing businesses",
        direct_competitors="Shopify, BigCommerce, WooCommerce",
        tier="basic",
    )
    
    report_id = result["report_id"]
    print(f"Report created: {report_id}")
    print(f"Credits used: {result.get('credits_used')}")
    
    # Wait for completion
    print("\nWaiting for report to complete...")
    completed = wait_for_completion(report_id)
    
    # Download results
    if completed.get("download_url"):
        print(f"\nPDF: {completed['download_url']}")
    if completed.get("pptx_download_url"):
        print(f"PPTX: {completed['pptx_download_url']}")
    if completed.get("intelligence_download_url"):
        print(f"JSON: {completed['intelligence_download_url']}")

