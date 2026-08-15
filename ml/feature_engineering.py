"""
Feature engineering pipeline for tourist risk evaluation.
"""

from typing import List
import pandas as pd
import numpy as np

FEATURE_COLUMNS: List[str] = [
    "incident_count",
    "recent_incidents",
    "high_severity_incidents",
    "moderate_severity_incidents",
    "tourist_density",
    "time_of_day",
    "historical_risk",
    "distance_to_incident",
    "response_time"
]

TARGET_COLUMN: str = "risk_score"

def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocess and validate feature dataframe."""
    processed = df.copy()
    for col in FEATURE_COLUMNS:
        if col not in processed.columns:
            processed[col] = 0.0
        processed[col] = pd.to_numeric(processed[col], errors="coerce").fillna(0.0)
    return processed[FEATURE_COLUMNS]
