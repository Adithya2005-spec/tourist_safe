import json
from typing import List, Dict, Any
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # All connected clients
        self.active_connections: List[WebSocket] = []
        # Specific tourist listeners: tourist_id -> List[WebSocket]
        self.tourist_connections: Dict[int, List[WebSocket]] = {}
        # Authority dashboard connections
        self.authority_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, client_type: str = "tourist", tourist_id: int = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        if client_type == "authority":
            self.authority_connections.append(websocket)
        elif client_type == "tourist" and tourist_id is not None:
            if tourist_id not in self.tourist_connections:
                self.tourist_connections[tourist_id] = []
            self.tourist_connections[tourist_id].append(websocket)

    def disconnect(self, websocket: WebSocket, client_type: str = "tourist", tourist_id: int = None):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if client_type == "authority" and websocket in self.authority_connections:
            self.authority_connections.remove(websocket)
        if client_type == "tourist" and tourist_id and tourist_id in self.tourist_connections:
            if websocket in self.tourist_connections[tourist_id]:
                self.tourist_connections[tourist_id].remove(websocket)

    async def broadcast_to_authorities(self, event_type: str, data: Any):
        payload = json.dumps({"event": event_type, "data": data})
        for connection in list(self.authority_connections):
            try:
                await connection.send_text(payload)
            except Exception:
                pass

    async def send_to_tourist(self, tourist_id: int, event_type: str, data: Any):
        if tourist_id in self.tourist_connections:
            payload = json.dumps({"event": event_type, "data": data})
            for connection in list(self.tourist_connections[tourist_id]):
                try:
                    await connection.send_text(payload)
                except Exception:
                    pass

    async def broadcast_all(self, event_type: str, data: Any):
        payload = json.dumps({"event": event_type, "data": data})
        for connection in list(self.active_connections):
            try:
                await connection.send_text(payload)
            except Exception:
                pass

ws_manager = ConnectionManager()
