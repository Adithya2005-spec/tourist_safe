"""
Standalone risk prediction utility using trained Linear Regression model.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

def get_risk_level(score: float) -> str:
    """Classify continuous risk score into 4 standard categories."""
    if score <= 25.0:
        return "LOW"
    elif score <= 50.0:
        return "MODERATE"
    elif score <= 75.0:
        return "HIGH"
    else:
        return "CRITICAL"

class RiskPredictor:
    def __init__(self, model_path: str = None):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.pkl")
        
        self.model_path = model_path
        self.payload = None
        self.model = None
        self.features = []
        self._load_model()
        
    def _load_model(self):
        if not os.path.exists(self.model_path):
            from ml.train_model import train_and_export_model
            print(f"[INFO] Model not found at {self.model_path}. Training initial model...")
            train_and_export_model()
            
        self.payload = joblib.load(self.model_path)
        self.model = self.payload["model"]
        self.features = self.payload["features"]
        
    def predict(self, feature_dict: Dict[str, Any]) -> Tuple[float, str]:
        row = [float(feature_dict.get(col, 0.0)) for col in self.features]
        df = pd.DataFrame([row], columns=self.features)
        raw_pred = float(self.model.predict(df)[0])
        score = float(np.clip(raw_pred, 0.0, 100.0).round(1))
        level = get_risk_level(score)
        return score, level

if __name__ == "__main__":
    predictor = RiskPredictor()
    sample_input = {
        "incident_count": 10,
        "recent_incidents": 4,
        "high_severity_incidents": 2,
        "moderate_severity_incidents": 3,
        "tourist_density": 60,
        "time_of_day": 21,
        "historical_risk": 55,
        "distance_to_incident": 0.8,
        "response_time": 12
    }
    score, level = predictor.predict(sample_input)
    print(f"Sample Input: {sample_input}")
    print(f"Predicted Risk Score: {score} / 100 | Risk Level: {level}")
