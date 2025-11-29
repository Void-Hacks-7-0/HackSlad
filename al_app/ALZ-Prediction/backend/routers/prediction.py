from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os

router = APIRouter(
    prefix="/predict",
    tags=["predict"],
)

# Load model and scaler
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'model_multiclass.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'ml', 'scaler_multiclass.pkl')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    print(f"Error loading model/scaler: {e}")
    model = None
    scaler = None

class SymptomInput(BaseModel):
    # Add all features required by the model
    # Based on the CSV columns (excluding PatientID, DoctorInCharge, Diagnosis)
    Age: int
    Gender: int
    Ethnicity: int
    EducationLevel: int
    BMI: float
    Smoking: int
    AlcoholConsumption: float
    PhysicalActivity: float
    DietQuality: float
    SleepQuality: float
    FamilyHistoryAlzheimers: int
    CardiovascularDisease: int
    Diabetes: int
    Depression: int
    HeadInjury: int
    Hypertension: int
    SystolicBP: int
    DiastolicBP: int
    CholesterolTotal: float
    CholesterolLDL: float
    CholesterolHDL: float
    CholesterolTriglycerides: float
    MMSE: float
    FunctionalAssessment: float
    MemoryComplaints: int
    BehavioralProblems: int
    ADL: float
    Confusion: int
    Disorientation: int
    PersonalityChanges: int
    DifficultyCompletingTasks: int
    Forgetfulness: int

class HealthInsightsInput(BaseModel):
    heart_rate: int
    systolic_bp: int
    diastolic_bp: int
    steps_count: int
    hydration: float # liters
    sleep_hours: float

@router.post("/")
def predict_alzheimers(data: SymptomInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Convert input to array
    input_data = np.array([[
        data.Age, data.Gender, data.Ethnicity, data.EducationLevel, data.BMI,
        data.Smoking, data.AlcoholConsumption, data.PhysicalActivity, data.DietQuality,
        data.SleepQuality, data.FamilyHistoryAlzheimers, data.CardiovascularDisease,
        data.Diabetes, data.Depression, data.HeadInjury, data.Hypertension,
        data.SystolicBP, data.DiastolicBP, data.CholesterolTotal, data.CholesterolLDL,
        data.CholesterolHDL, data.CholesterolTriglycerides, data.MMSE,
        data.FunctionalAssessment, data.MemoryComplaints, data.BehavioralProblems,
        data.ADL, data.Confusion, data.Disorientation, data.PersonalityChanges,
        data.DifficultyCompletingTasks, data.Forgetfulness
    ]])

    # Scale input
    input_scaled = scaler.transform(input_data)

    # Predict
    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0]
    
    # Map prediction to result
    stage_map = {
        0: "No Alzheimer's",
        1: "Low Level Alzheimer's",
        2: "Mild Alzheimer's",
        3: "High Stage Alzheimer's"
    }
    
    result = stage_map.get(prediction, "Unknown")
    confidence = float(probability[prediction])
    
    suggestions = []
    if prediction == 0:
        suggestions.append("Keep up the healthy lifestyle!")
        suggestions.append("Regular checkups are recommended.")
    elif prediction == 1:
        suggestions.append("Early signs detected. Consult a doctor for preventive measures.")
        suggestions.append("Focus on cognitive exercises and diet.")
    elif prediction == 2:
        suggestions.append("Mild symptoms detected. Medical intervention is recommended.")
        suggestions.append("Ensure safety in daily activities.")
    elif prediction == 3:
        suggestions.append("High stage detected. Immediate specialist consultation required.")
        suggestions.append("Full-time care or supervision may be needed.")

    return {
        "prediction": result,
        "probability": confidence,
        "suggestions": suggestions,
        "stage_code": int(prediction) # Helpful for frontend logic
    }

@router.post("/health-insights")
def health_insights(data: HealthInsightsInput):
    score = 100
    precautions = []

    if data.heart_rate > 100 or data.heart_rate < 60:
        score -= 10
        precautions.append("Abnormal heart rate detected. Consult a doctor.")
    
    if data.systolic_bp > 130 or data.diastolic_bp > 85:
        score -= 15
        precautions.append("High blood pressure. Reduce salt intake and monitor BP.")
    
    if data.steps_count < 5000:
        score -= 10
        precautions.append("Low physical activity. Try to walk more.")
    
    if data.hydration < 2.0:
        score -= 5
        precautions.append("Low hydration. Drink more water.")
    
    if data.sleep_hours < 7:
        score -= 10
        precautions.append("Insufficient sleep. Aim for 7-8 hours.")

    return {
        "health_score": score,
        "precautions": precautions
    }

class GeneralSymptomInput(BaseModel):
    fever: bool = False
    cough: bool = False
    headache: bool = False
    sneeze: bool = False
    runny_nose: bool = False
    muscle_pain: bool = False
    joint_pain: bool = False
    nausea: bool = False
    chills: bool = False
    rash: bool = False
    fatigue: bool = False
    sore_throat: bool = False

@router.post("/general")
def predict_general_disease(data: GeneralSymptomInput):
    # Simple rule-based logic
    predictions = []
    
    # Common Cold
    if data.sneeze and data.runny_nose and data.cough:
        predictions.append({"disease": "Common Cold", "probability": 0.85, "advice": "Rest, hydration, and over-the-counter cold meds."})
    
    # Flu (Influenza)
    if data.fever and data.cough and data.muscle_pain and data.fatigue:
        predictions.append({"disease": "Flu (Influenza)", "probability": 0.90, "advice": "Antiviral drugs, rest, fluids. See a doctor if severe."})
        
    # Migraine
    if data.headache and data.nausea and not data.fever:
        predictions.append({"disease": "Migraine", "probability": 0.80, "advice": "Rest in a dark room, pain relievers, hydration."})
        
    # Malaria
    if data.fever and data.chills and data.headache:
        predictions.append({"disease": "Malaria", "probability": 0.75, "advice": "Immediate blood test and medical attention required."})
        
    # Dengue
    if data.fever and data.joint_pain and data.rash and data.headache:
        predictions.append({"disease": "Dengue", "probability": 0.85, "advice": "Hydration, pain relief (avoid aspirin), monitor platelets."})

    # COVID-19 (Generic symptoms overlap)
    if data.fever and data.cough and data.fatigue and data.sore_throat:
        predictions.append({"disease": "COVID-19", "probability": 0.70, "advice": "Isolate, get tested, monitor oxygen levels."})

    if not predictions:
        return {
            "prediction": "Uncertain",
            "details": "Symptoms do not match a specific pattern clearly. Please consult a doctor.",
            "matches": []
        }
    
    # Sort by probability
    predictions.sort(key=lambda x: x['probability'], reverse=True)
    
    return {
        "prediction": predictions[0]['disease'],
        "details": predictions[0]['advice'],
        "matches": predictions
    }
