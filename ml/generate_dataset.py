"""
Synthetic Dataset Generator for Tourist Safety Dynamic Risk Prediction
Dataset Label: DEMO DATA (Smart India Hackathon SIH260483)

Generates realistic historical and real-time situational data to train
a Linear Regression model for dynamic risk score computation.
"""

import os
import numpy as np
import pandas as pd

def generate_synthetic_dataset(num_samples: int = 5000, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    
    # 1. incident_count: Total incidents recorded in the sector over past 30 days (0 to 50)
    incident_count = np.random.poisson(lam=8, size=num_samples).clip(0, 50)
    
    # 2. recent_incidents: Incidents in last 24-48 hours (0 to 15)
    recent_incidents = np.random.binomial(n=incident_count, p=0.3).clip(0, 15)
    
    # 3. high_severity_incidents: Serious crimes/accidents in last 7 days (0 to 10)
    high_severity_incidents = np.random.binomial(n=incident_count, p=0.15).clip(0, 10)
    
    # 4. moderate_severity_incidents: Minor theft/disputes (0 to 20)
    moderate_severity_incidents = np.random.binomial(n=incident_count, p=0.35).clip(0, 20)
    
    # 5. tourist_density: Current estimated tourist density index (0 to 100)
    tourist_density = np.random.uniform(10, 95, size=num_samples)
    
    # 6. time_of_day: Hour of the day (0 to 23)
    time_of_day = np.random.randint(0, 24, size=num_samples)
    
    # 7. historical_risk: Baseline historical neighborhood risk index (0 to 100)
    historical_risk = np.random.uniform(15, 80, size=num_samples)
    
    # 8. distance_to_incident: Proximity in km to nearest active alert/incident (0.05 to 10.0 km)
    distance_to_incident = np.random.exponential(scale=2.0, size=num_samples).clip(0.05, 10.0)
    
    # 9. response_time: Average emergency responder dispatch time in minutes (3 to 45 mins)
    response_time = np.random.normal(loc=15, scale=6, size=num_samples).clip(3, 45)
    
    # Night risk modifier: late hours (22:00 - 05:00) increase situational vulnerability
    night_factor = np.where((time_of_day >= 22) | (time_of_day <= 5), 1.35, 1.0)
    
    # Proximity risk factor: closer distance dramatically raises immediate threat
    proximity_factor = np.where(distance_to_incident < 1.0, (1.0 - distance_to_incident) * 20, 0.0)
    
    # Target formula: Realistic weighted sum with noise
    raw_risk = (
        0.28 * historical_risk +
        1.80 * high_severity_incidents +
        0.85 * moderate_severity_incidents +
        1.20 * recent_incidents +
        0.15 * incident_count +
        0.12 * tourist_density +
        0.35 * response_time +
        proximity_factor +
        (night_factor - 1.0) * 15.0 +
        np.random.normal(0, 3.5, size=num_samples) # Realistic observation noise
    )
    
    # Normalize risk_score to 0 - 100 range
    risk_score = np.clip(raw_risk, 0.0, 100.0).round(2)
    
    df = pd.DataFrame({
        "incident_count": incident_count,
        "recent_incidents": recent_incidents,
        "high_severity_incidents": high_severity_incidents,
        "moderate_severity_incidents": moderate_severity_incidents,
        "tourist_density": tourist_density.round(2),
        "time_of_day": time_of_day,
        "historical_risk": historical_risk.round(2),
        "distance_to_incident": distance_to_incident.round(2),
        "response_time": response_time.round(2),
        "risk_score": risk_score,
        "dataset_type": "DEMO DATA"
    })
    
    return df

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(__file__), "dataset")
    os.makedirs(output_dir, exist_ok=True)
    
    dataset_path = os.path.join(output_dir, "synthetic_tourist_risk_data.csv")
    df = generate_synthetic_dataset(num_samples=5000)
    df.to_csv(dataset_path, index=False)
    print(f"[DEMO DATA] Successfully generated {len(df)} samples at: {dataset_path}")
    print(df.head(5))
