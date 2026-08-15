import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.database.connection import engine, Base
from backend.app.database.seed import seed_database
from backend.app.routers import auth, tourists, locations, risk, incidents, sos, notifications, blockchain, emergency_contacts, location_sharing
from backend.app.websocket.manager import ws_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Check if we should seed default data
    from backend.app.database.connection import SessionLocal
    from backend.app.models.users import User
    db = SessionLocal()
    if db.query(User).count() == 0:
        print("[INFO] Database empty. Running initial demo seeder...")
        seed_database()
    db.close()
    yield

app = FastAPI(
    title="RakshaSetu API - SIH260483",
    description="RakshaSetu: Smart Tourist Safety Monitoring & Incident Response System using AI, Geo-Fencing, and Blockchain-based Digital Identity",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow mobile Expo and Vite Dashboard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(tourists.router)
app.include_router(emergency_contacts.router)
app.include_router(location_sharing.router)
app.include_router(locations.router)
app.include_router(risk.router)
app.include_router(incidents.router)
app.include_router(sos.router)
app.include_router(notifications.router)
app.include_router(blockchain.router)

@app.get("/", tags=["Health & Meta"])
def root():
    return {
        "system": "RakshaSetu: Smart Tourist Safety Monitoring & Incident Response System",
        "hackathon": "Smart India Hackathon (SIH260483)",
        "version": "1.0.0",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "openapi_url": "/openapi.json"
    }

@app.get("/health", tags=["Health & Meta"])
def health_check():
    return {"status": "healthy", "database": "connected", "risk_engine": "online"}

# Real-time WebSocket Endpoint (generic)
@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    client_type: str = Query("tourist"),
    tourist_id: int = Query(None)
):
    await ws_manager.connect(websocket, client_type=client_type, tourist_id=tourist_id)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, client_type=client_type, tourist_id=tourist_id)

# Tourist-specific WebSocket endpoint (used by mobile app)
@app.websocket("/ws/tourist/{tourist_code}")
async def websocket_tourist_endpoint(
    websocket: WebSocket,
    tourist_code: str,
    token: str = Query(None)
):
    await ws_manager.connect(websocket, client_type="tourist", tourist_id=None)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
            else:
                await websocket.send_text(data)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, client_type="tourist")
