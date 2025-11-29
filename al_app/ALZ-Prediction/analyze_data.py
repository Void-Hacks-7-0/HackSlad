import pandas as pd
import joblib
import pickle
import os

# Paths
csv_path = r"c:\alz-app\ALZ-Prediction\alzheimers_disease_data.csv"
pkl_path = r"c:\alz-app\alz_risk_model.pkl"
joblib_path = r"c:\alz-app\alzheimers_prediction_model (1).joblib"

print("--- CSV Analysis ---")
try:
    df = pd.read_csv(csv_path)
    print("Columns:", df.columns.tolist())
    print("Shape:", df.shape)
    if 'Diagnosis' in df.columns:
        print("Diagnosis unique values:", df['Diagnosis'].unique())
        print("Diagnosis value counts:\n", df['Diagnosis'].value_counts())
    else:
        print("No 'Diagnosis' column found.")
    
    # Check for other potential target columns
    print("First 5 rows:\n", df.head())
except Exception as e:
    print(f"Error reading CSV: {e}")

print("\n--- Model Analysis ---")
try:
    print(f"Loading {pkl_path}...")
    with open(pkl_path, 'rb') as f:
        model_pkl = pickle.load(f)
    print("PKL Model type:", type(model_pkl))
    if hasattr(model_pkl, 'classes_'):
        print("PKL Classes:", model_pkl.classes_)
except Exception as e:
    print(f"Error loading PKL: {e}")

try:
    print(f"Loading {joblib_path}...")
    model_joblib = joblib.load(joblib_path)
    print("Joblib Model type:", type(model_joblib))
    if hasattr(model_joblib, 'classes_'):
        print("Joblib Classes:", model_joblib.classes_)
except Exception as e:
    print(f"Error loading Joblib: {e}")
