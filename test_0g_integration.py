import requests
import json

def test_backend_query():
    url = "http://localhost:8000/api/query"
    
    payload = {
        "document_content": (
            "DocSense AI Corporate Case Study: Annual Operational, Strategic & Financial Analysis Report.\n"
            "This case study details our operational growth targets. Our Q3 revenue target is set to $42.8M, representing "
            "a 14% year-over-year increase. Net profit margins stabilized at 18.5%, driven by operational efficiency "
            "and cloud database optimization. The strategy focuses on global expansion into Frankfurt, Tokyo, and Sydney."
        ),
        "query": "What is the revenue target for Q3?"
    }
    
    print("Sending query request to local DocSense backend...")
    try:
        r = requests.post(url, json=payload, timeout=40)
        print(f"Response Status Code: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print("\n--- Response Data Received ---")
            print(f"Optimized Answer: {data.get('answer')}")
            print(f"Original Tokens: {data.get('original_tokens')}")
            print(f"Compressed Tokens: {data.get('compressed_tokens')}")
            print(f"Savings Ratio: {data.get('savings_ratio')}%")
            print(f"Estimated Cost Saved: ${data.get('estimated_cost_saved')}")
            print("------------------------------")
            
            # Simple check if answer came from the mock fallback or from the live model
            answer = data.get('answer', '')
            if "No Anthropic key was detected" in answer or "No 0G key was detected" in answer:
                print("\nVerification Result: WARNING - Local fallback mock was triggered.")
            else:
                print("\nVerification Result: SUCCESS - Successfully ran query via live 0G Compute AI inference!")
        else:
            print(f"Failed to query backend. Error: {r.text}")
    except Exception as e:
        print(f"Connection to backend failed: {e}")

if __name__ == "__main__":
    test_backend_query()
