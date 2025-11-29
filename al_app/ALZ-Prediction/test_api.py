import requests
import sys

try:
    # Test Signup
    print("Testing Signup...")
    response = requests.post(
        "http://localhost:8000/auth/signup",
        json={"username": "testuser_script", "password": "testpassword"}
    )
    print(f"Signup Status: {response.status_code}")
    print(f"Signup Response: {response.text}")

    if response.status_code == 201:
        print("Signup Successful")
    elif response.status_code == 400 and "already registered" in response.text:
        print("User already exists (Expected if running multiple times)")
    else:
        print("Signup Failed")

except Exception as e:
    print(f"Error: {e}")
