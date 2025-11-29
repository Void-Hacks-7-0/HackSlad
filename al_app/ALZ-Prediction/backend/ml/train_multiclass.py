import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), 'alzheimers_disease_data.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model_multiclass.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler_multiclass.pkl')

print(f"Loading data from {CSV_PATH}...")
df = pd.read_csv(CSV_PATH)

# Feature Selection (excluding ID, Doctor, Diagnosis)
# We also exclude MMSE from features because we use it to define the target, 
# and in a real scenario, we might want to predict stage *based on other symptoms* 
# if MMSE isn't the only factor, OR we include it if it's an input.
# However, the user wants to "train accordingly" so the model learns the pattern.
# If we include MMSE as a feature and derive the label from it, the model will just learn MMSE -> Label perfectly.
# But usually, MMSE is a symptom/test result provided by the user.
# Let's include all symptom columns as features, including MMSE, as the user inputs it.

features = [
    'Age', 'Gender', 'Ethnicity', 'EducationLevel', 'BMI', 'Smoking', 
    'AlcoholConsumption', 'PhysicalActivity', 'DietQuality', 'SleepQuality', 
    'FamilyHistoryAlzheimers', 'CardiovascularDisease', 'Diabetes', 
    'Depression', 'HeadInjury', 'Hypertension', 'SystolicBP', 'DiastolicBP', 
    'CholesterolTotal', 'CholesterolLDL', 'CholesterolHDL', 
    'CholesterolTriglycerides', 'MMSE', 'FunctionalAssessment', 
    'MemoryComplaints', 'BehavioralProblems', 'ADL', 'Confusion', 
    'Disorientation', 'PersonalityChanges', 'DifficultyCompletingTasks', 
    'Forgetfulness'
]

X = df[features]

# Create Target Variable 'Stage'
# 0: No Alzheimer's
# 1: Low Level (Diagnosis=1, MMSE >= 21)
# 2: Mild (Diagnosis=1, 10 <= MMSE < 21)
# 3: High Stage (Diagnosis=1, MMSE < 10)

def categorize_stage(row):
    if row['Diagnosis'] == 0:
        return 0
    else:
        mmse = row['MMSE']
        if mmse >= 21:
            return 1 # Low Level
        elif mmse >= 10:
            return 2 # Mild
        else:
            return 3 # High Stage

y = df.apply(categorize_stage, axis=1)

print("Target distribution:")
print(y.value_counts().sort_index())

# Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale Data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Handle Imbalance
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train_scaled, y_train)

print("Resampled target distribution:")
print(pd.Series(y_train_resampled).value_counts().sort_index())

# Train Model
print("Training Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_resampled, y_train_resampled)

# Evaluate
y_pred = model.predict(X_test_scaled)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save Artifacts
print(f"Saving model to {MODEL_PATH}...")
joblib.dump(model, MODEL_PATH)
print(f"Saving scaler to {SCALER_PATH}...")
joblib.dump(scaler, SCALER_PATH)

print("Done.")
