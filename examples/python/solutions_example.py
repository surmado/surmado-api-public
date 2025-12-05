"""
Surmado Solutions - Multi-AI Strategic Advisory Example
Get strategic recommendations from multiple AI perspectives.
Docs: https://help.surmado.com/docs/api-reference/
"""
import os
import time
import requests

API_KEY = os.environ.get("SURMADO_API_KEY", "YOUR_API_KEY")
BASE_URL = "https://api.surmado.com/v1"


def create_solutions_report(
    brand_name: str,
    email: str,
    business_story: str,
    decision: str,
    success: str,
    timeline: str,
    scale_indicator: str,
):
    """
    Create a Solutions (strategic advisory) report.
    
    Always uses Pro tier: 2 credits, $50.
    
    Args:
        brand_name: Your brand name
        email: Email for notifications
        business_story: Tell us about your business
        decision: Key decision or challenge you're facing
        success: What does success look like?
        timeline: Timeline for decision
        scale_indicator: Business scale (revenue, employees, etc.)
    
    Returns:
        Report data with report_id
    """
    response = requests.post(
        f"{BASE_URL}/reports/solutions",
        headers={
            "X-API-Key": API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "brand_name": brand_name,
            "email": email,
            "business_story": business_story,
            "decision": decision,
            "success": success,
            "timeline": timeline,
            "scale_indicator": scale_indicator,
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
    # Create a Solutions report
    print("Creating Solutions report...")
    result = create_solutions_report(
        brand_name="Example Brand",
        email="you@example.com",
        business_story="We are a 5-year-old e-commerce company selling sustainable products. Annual revenue is $2M with 15% YoY growth. Team of 12 people.",
        decision="Should we launch a subscription box service?",
        success="Generate $500K in recurring revenue within 18 months while maintaining current profit margins",
        timeline="6 months to pilot, 12 months to scale nationally",
        scale_indicator="$2M annual revenue, 50K customers, 12 employees",
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
    if completed.get("intelligence_download_url"):
        print(f"JSON: {completed['intelligence_download_url']}")

