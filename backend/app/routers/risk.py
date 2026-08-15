from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.connection import get_db
from backend.app.models.risk_zones import RiskZone
from backend.app.schemas.risk import RiskZoneOut, RiskPredictRequest, RiskPredictResponse
from backend.app.services.risk_service import compute_dynamic_risk

router = APIRouter(tags=["Risk & Geo-Fencing"])

@router.get("/risk-zones", response_model=List[RiskZoneOut])
def get_risk_zones(db: Session = Depends(get_db)):
    zones = db.query(RiskZone).filter(RiskZone.active == True).all()
    return zones

@router.get("/risk-zones/{zone_id}", response_model=RiskZoneOut)
def get_risk_zone_by_id(zone_id: int, db: Session = Depends(get_db)):
    zone = db.query(RiskZone).filter(RiskZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Risk zone not found")
    return zone

@router.post("/risk/predict", response_model=RiskPredictResponse)
def predict_risk(payload: RiskPredictRequest):
    features = payload.model_dump()
    score, level, factors = compute_dynamic_risk(features)
    return {
        "risk_score": score,
        "risk_level": level,
        "is_simulated": False,
        "contributing_factors": factors
    }
