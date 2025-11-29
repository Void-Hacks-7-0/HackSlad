import requests
import json

url = "http://localhost:8000/predict/"

# Data matching the frontend initial state where missing fields are empty strings
data = {
    "Age": 55,
    "Gender": 0,
    "Ethnicity": 0,
    "EducationLevel": 0,
    "BMI": 25.0,
    "Smoking": 0,
    "AlcoholConsumption": "", # Missing in form
    "PhysicalActivity": "", # Missing in form
    "DietQuality": "", # Missing in form
    "SleepQuality": "", # Missing in form
    "FamilyHistoryAlzheimers": 0,
    "CardiovascularDisease": 0,
    "Diabetes": 0,
    "Depression": 0,
    "HeadInjury": 0,
    "Hypertension": 0,
    "SystolicBP": 120,
    "DiastolicBP": 80,
    "CholesterolTotal": 200,
    "CholesterolLDL": "", # Missing in form
    "CholesterolHDL": "", # Missing in form
    "CholesterolTriglycerides": "", # Missing in form
    "MMSE": 25,
    "FunctionalAssessment": "", # Missing in form
    "MemoryComplaints": 0,
    "BehavioralProblems": 0,
    "ADL": "", # Missing in form
    "Confusion": 0,
    "Disorientation": 0,
    "PersonalityChanges": 0,
    "DifficultyCompletingTasks": 0,
    "Forgetfulness": 0
}

try:
    print("Sending request with missing fields...")
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
