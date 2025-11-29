import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import os

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../../alzheimers_disease_data.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.pkl')
STATS_PATH = os.path.join(BASE_DIR, 'stats.json')

def train_model():
    print("Loading data...")
    if not os.path.exists(DATA_PATH):
        print(f"Error: Data file not found at {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)

    # --- Data Preprocessing ---
    # Drop PatientID and DoctorInCharge as they are not predictive
    df = df.drop(['PatientID', 'DoctorInCharge'], axis=1)

    # Handle categorical variables if any (Diagnosis is the target)
    # Looking at the CSV, most features seem numerical or already encoded.
    # We'll check for object types just in case.
    for col in df.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])

    # Separate features and target
    X = df.drop('Diagnosis', axis=1)
    y = df['Diagnosis']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # --- Model Training ---
    print("Training model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    # --- Evaluation ---
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    # --- Save Model and Scaler ---
    print("Saving model and scaler...")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    # --- Generate Statistics for Landing Page ---
    print("Generating statistics...")
    stats = {
        "total_patients": len(df),
        "diagnosed_count": int(df['Diagnosis'].sum()),
        "not_diagnosed_count": int(len(df) - df['Diagnosis'].sum()),
        "average_age": float(df['Age'].mean()),
        "age_distribution": df['Age'].value_counts().sort_index().to_dict(), # For charts
        "diagnosis_rate": float(df['Diagnosis'].mean())
    }

    with open(STATS_PATH, 'w') as f:
        json.dump(stats, f, indent=4)

    print("Done!")

if __name__ == "__main__":
    train_model()
