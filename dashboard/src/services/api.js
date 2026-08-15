const API_BASE = 'http://127.0.0.1:8000';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (e) {
    return { status: 'offline' };
  }
}

export async function fetchRiskZones() {
  const res = await fetch(`${API_BASE}/risk-zones`);
  return await res.json();
}

export async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/incidents`);
  return await res.json();
}

export async function fetchTourists() {
  const res = await fetch(`${API_BASE}/tourists/all`);
  return await res.json();
}

export async function fetchBlockchainAudits() {
  const res = await fetch(`${API_BASE}/blockchain/audits`);
  return await res.json();
}

export async function updateIncidentStatus(incidentId, payload) {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
