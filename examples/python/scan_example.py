"""
Surmado Scan - SEO Audit Example
Run an SEO audit on any website.
Docs: https://help.surmado.com/docs/api-reference/
"""
import os
import time
import requests

API_KEY = os.environ.get("SURMADO_API_KEY", "YOUR_API_KEY")
BASE_URL = "https://api.surmado.com/v1"


def create_scan_report(url: str, brand_name: str, email: str, tier: str = "basic"):
    """
    Create a Scan (SEO audit) report.
    
    Args:
        url: Website URL to audit
        brand_name: Your brand name
        email: Email for notifications
        tier: "basic" (1 credit, $25) or "premium" (2 credits, $50)
    
    Returns:
        Report data with report_id
    """
    response = requests.post(
        f"{BASE_URL}/reports/scan",
        headers={
            "X-API-Key": API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "url": url,
            "brand_name": brand_name,
            "email": email,
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
    """
    Poll until report completes or fails.
    
    Args:
        report_id: The report ID to poll
        timeout_minutes: Maximum time to wait (default 20 min)
    
    Returns:
        Completed report data
    """
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
        time.sleep(30)  # Poll every 30 seconds
    
    raise TimeoutError(f"Report did not complete within {timeout_minutes} minutes")


if __name__ == "__main__":
    # Create a Scan report
    print("Creating Scan report...")
    result = create_scan_report(
        url="https://example.com",
        brand_name="Example Brand",
        email="you@example.com",
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
    if completed.get("intelligence_download_url"):
        print(f"JSON: {completed['intelligence_download_url']}")

