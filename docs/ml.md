# Dynamic Risk Prediction Model Documentation
**Machine Learning Architecture & Linear Regression Diagnostics**  
*SIH260483 - Smart Tourist Safety System*

---

## 1. Feature Representation

The dynamic risk scoring engine uses **Linear Regression** (`scikit-learn`) trained on multivariate situational parameters:

| Feature Name | Description | Range | Feature Weight / Significance |
| :--- | :--- | :--- | :--- |
| `incident_count` | 30-day cumulative incident logs in sector | 0 - 50 | Baseline sector crime rate |
| `recent_incidents` | Incidents in past 24 to 48 hours | 0 - 15 | Immediate emerging hazard spike |
| `high_severity_incidents` | Severe crimes or violent events in 7 days | 0 - 10 | Primary severity multiplier |
| `moderate_severity_incidents` | Minor disputes or petty theft reports | 0 - 20 | Secondary severity weight |
| `tourist_density` | Real-time foot-traffic density index | 0 - 100 | Crowd congestion indicator |
| `time_of_day` | Current hour (0 - 23) | 0 - 23 | Non-linear night-time exposure index |
| `historical_risk` | Baseline long-term risk rating | 0 - 100 | Static neighborhood risk baseline |
| `distance_to_incident` | Proximity (km) to closest active alert | 0.05 - 10.0 | Exponential immediate proximity hazard |
| `response_time` | Average dispatch arrival latency in mins | 3 - 45 | Operational safety cushion |

---

## 2. Risk Categorization Thresholds

The continuous predicted output $y \in [0.0, 100.0]$ maps directly to action tiers:
- **0.0 to 25.0:** `LOW` (Standard safe environment)
- **25.1 to 50.0:** `MODERATE` (Advisory caution)
- **50.1 to 75.0:** `HIGH` (Active geofence warning, caution banner, proactive notifications)
- **75.1 to 100.0:** `CRITICAL` (Urgent warning, safer route recommendation, emergency standby)

---

## 3. Training & Evaluation Pipeline

- **Dataset Type:** Labeled synthetic data generated via `ml/generate_dataset.py` with realistic Poisson and exponential distributions (labeled as `DEMO DATA`).
- **Train/Test Split:** 80% Training (4,000 samples), 20% Testing (1,000 samples).
- **Execution Script:** `python ml/train_model.py`
- **Output Artifact:** `ml/model.pkl`
