from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RiskZoneOut(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    radius: float
    risk_score: float
    risk_level: str
    description: Optional[str] = None
    active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RiskPredictRequest(BaseModel):
    incident_count: float = 0.0
    recent_incidents: float = 0.0
    high_severity_incidents: float = 0.0
    moderate_severity_incidents: float = 0.0
    tourist_density: float = 50.0
    time_of_day: float = 12.0
    historical_risk: float = 30.0
    distance_to_incident: float = 2.0
    response_time: float = 15.0

class RiskPredictResponse(BaseModel):
    risk_score: float
    risk_level: str
    is_simulated: bool = False
    contributing_factors: Optional[dict] = None
