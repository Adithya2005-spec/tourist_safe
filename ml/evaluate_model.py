"""
Model Evaluation and Diagnostics
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from feature_engineering import FEATURE_COLUMNS, TARGET_COLUMN

def evaluate():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "model.pkl")
    data_path = os.path.join(current_dir, "dataset", "synthetic_tourist_risk_data.csv")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}. Run train_model.py first.")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Run generate_dataset.py first.")
        
    payload = joblib.load(model_path)
    model = payload["model"]
    
    df = pd.read_csv(data_path)
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]
    
    preds = np.clip(model.predict(X), 0.0, 100.0)
    
    mae = mean_absolute_error(y, preds)
    rmse = np.sqrt(mean_squared_error(y, preds))
    r2 = r2_score(y, preds)
    
    print("--- Model Evaluation Report ---")
    print(f"Total evaluated samples : {len(df)}")
    print(f"MAE                     : {mae:.4f}")
    print(f"RMSE                    : {rmse:.4f}")
    print(f"R²                      : {r2:.4f}")
    
if __name__ == "__main__":
    evaluate()
