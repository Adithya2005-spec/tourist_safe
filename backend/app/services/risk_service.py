import os
import sys
from typing import Dict, Any, Tuple

# Add ML directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
ml_dir = os.path.abspath(os.path.join(current_dir, "..", "..", "..", "ml"))
if ml_dir not in sys.path:
    sys.path.insert(0, ml_dir)

try:
    from predict import RiskPredictor, get_risk_level
    predictor = RiskPredictor()
except Exception as e:
    print(f"[WARN] Failed to load ML model from {ml_dir}: {e}. Fallback to rule-based.")
    predictor = None

def compute_dynamic_risk(features: Dict[str, Any]) -> Tuple[float, str, dict]:
    """
    Computes dynamic risk score (0-100) using trained Linear Regression model.
    Returns: (risk_score, risk_level, contributing_factors)
    """
    if predictor is not None:
        score, level = predictor.predict(features)
        factors = {
            "incident_count_weight": round(features.get("incident_count", 0) * 0.15, 2),
            "recent_incidents_weight": round(features.get("recent_incidents", 0) * 1.20, 2),
            "high_severity_weight": round(features.get("high_severity_incidents", 0) * 1.80, 2),
            "tourist_density_weight": round(features.get("tourist_density", 50) * 0.12, 2),
            "historical_baseline_weight": round(features.get("historical_risk", 30) * 0.28, 2),
            "emergency_response_weight": round(features.get("response_time", 15) * 0.35, 2),
        }
        return score, level, factors
    
    # Fallback calculation if model.pkl is missing
    raw_score = min(100.0, max(0.0, (
        features.get("historical_risk", 30) * 0.3 +
        features.get("high_severity_incidents", 0) * 8.0 +
        features.get("recent_incidents", 0) * 4.0 +
        (10.0 if features.get("distance_to_incident", 5.0) < 1.0 else 0.0)
    )))
    score = round(raw_score, 1)
    if score <= 25:
        level = "LOW"
    elif score <= 50:
        level = "MODERATE"
    elif score <= 75:
        level = "HIGH"
    else:
        level = "CRITICAL"
    return score, level, {"note": "Rule-based fallback calculation"}
