import requests
import json

url = "http://localhost:8000/predict/"

# Data matching the backend requirement (all 32 fields)
data = {
    "Age": 55,
    "Gender": 0,
    "Ethnicity": 0,
    "EducationLevel": 0,
    "BMI": 25.0,
    "Smoking": 0,
    "AlcoholConsumption": 5.0,
    "PhysicalActivity": 5.0,
    "DietQuality": 5.0,
    "SleepQuality": 7.0,
    "FamilyHistoryAlzheimers": 0,
    "CardiovascularDisease": 0,
    "Diabetes": 0,
    "Depression": 0,
    "HeadInjury": 0,
    "Hypertension": 0,
    "SystolicBP": 120,
    "DiastolicBP": 80,
    "CholesterolTotal": 200,
    "CholesterolLDL": 100.0,
    "CholesterolHDL": 50.0,
    "CholesterolTriglycerides": 150.0,
    "MMSE": 25.0,
    "FunctionalAssessment": 5.0,
    "MemoryComplaints": 0,
    "BehavioralProblems": 0,
    "ADL": 10.0,
    "Confusion": 0,
    "Disorientation": 0,
    "PersonalityChanges": 0,
    "DifficultyCompletingTasks": 0,
    "Forgetfulness": 0
}

try:
    print("Sending request with FULL fields...")
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
