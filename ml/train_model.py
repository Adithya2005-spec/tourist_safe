"""
Model Training Script for Linear Regression Dynamic Risk Engine
Smart India Hackathon (SIH260483)

Trains Linear Regression on synthetic demo data and outputs actual metrics:
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- R² (Coefficient of Determination)
Saves model artifact to model.pkl.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from feature_engineering import FEATURE_COLUMNS, TARGET_COLUMN
from generate_dataset import generate_synthetic_dataset

def train_and_export_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_file = os.path.join(current_dir, "dataset", "synthetic_tourist_risk_data.csv")
    
    if not os.path.exists(dataset_file):
        print("[INFO] Generating synthetic dataset first...")
        os.makedirs(os.path.join(current_dir, "dataset"), exist_ok=True)
        df = generate_synthetic_dataset(num_samples=5000)
        df.to_csv(dataset_file, index=False)
    else:
        df = pd.read_csv(dataset_file)
        
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]
    
    # 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train Linear Regression model
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Predict and evaluate
    y_pred = model.predict(X_test)
    y_pred_clipped = np.clip(y_pred, 0.0, 100.0)
    
    mae = mean_absolute_error(y_test, y_pred_clipped)
    mse = mean_squared_error(y_test, y_pred_clipped)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred_clipped)
    
    print("=" * 60)
    print("LINEAR REGRESSION MODEL TRAINING RESULTS (DEMO DATA)")
    print("=" * 60)
    print(f"Dataset samples : {len(df)} (Train: {len(X_train)}, Test: {len(X_test)})")
    print(f"Mean Absolute Error (MAE) : {mae:.4f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"R-squared Score (R²)          : {r2:.4f}")
    print("=" * 60)
    print("Feature Weights (Coefficients):")
    for feature, coef in zip(FEATURE_COLUMNS, model.coef_):
        print(f"  - {feature:28s}: {coef:+.4f}")
    print(f"  - {'intercept':28s}: {model.intercept_:+.4f}")
    print("=" * 60)
    
    # Save model artifact
    model_output_path = os.path.join(current_dir, "model.pkl")
    model_payload = {
        "model": model,
        "features": FEATURE_COLUMNS,
        "metrics": {
            "mae": float(round(mae, 4)),
            "rmse": float(round(rmse, 4)),
            "r2": float(round(r2, 4))
        },
        "intercept": float(model.intercept_),
        "coefficients": {k: float(v) for k, v in zip(FEATURE_COLUMNS, model.coef_)}
    }
    joblib.dump(model_payload, model_output_path)
    print(f"[SUCCESS] Model artifact saved to: {model_output_path}")

if __name__ == "__main__":
    train_and_export_model()
