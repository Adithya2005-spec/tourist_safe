import { WS_BASE_URL } from '../constants/config';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectTimer = null;
    this.reconnectDelay = 2000;
    this.maxReconnectDelay = 30000;
    this.connected = false;
    this.token = null;
    this.touristCode = null;
  }

  connect(token, touristCode) {
    this.token = token;
    this.touristCode = touristCode;
    this._connect();
  }

  _connect() {
    try {
      const url = `${WS_BASE_URL}/ws/tourist/${this.touristCode || 'TOURIST-1024'}?token=${this.token}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectDelay = 2000;
        this._emit('connected', { status: 'connected' });
        console.log('[WS] Connected to server');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this._emit('message', data);
          if (data.type) {
            this._emit(data.type, data);
          }
        } catch (e) {
          console.warn('[WS] Parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.connected = false;
        this._emit('disconnected', { status: 'disconnected' });
        this._scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        this._emit('error', { error });
        // Will trigger onclose automatically
      };
    } catch (e) {
      this._scheduleReconnect();
    }
  }

  _scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.token) {
        console.log(`[WS] Reconnecting in ${this.reconnectDelay}ms...`);
        this._connect();
        this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, this.maxReconnectDelay);
      }
    }, this.reconnectDelay);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.set(
        event,
        this.listeners.get(event).filter(cb => cb !== callback)
      );
    }
  }

  _emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.token = null;
    if (this.ws) {
      this.ws.onclose = null; // Prevent reconnect
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }

  isConnected() {
    return this.connected && this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton
export const websocketService = new WebSocketService();
