import requests
import json

url = "http://localhost:8000/predict/general"
data = {
    "fever": True,
    "cough": True,
    "muscle_pain": True,
    "fatigue": True
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
