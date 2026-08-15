import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../models/models.dart';

/// Centralized state manager mimicking a backend service.
/// Uses ChangeNotifier for reactive UI updates across screens.
class MockBackendService extends ChangeNotifier {
  late Tourist _currentTourist;
  final List<RiskZone> _riskZones = [];
  final List<Incident> _incidents = [];

  String _currentRiskLevel = 'LOW';
  String _currentAreaName = 'Cubbon Park (Safe Zone)';
  bool _showHighRiskNotification = false;
  Incident? _activeTouristIncident;

  // Getters
  Tourist get currentTourist => _currentTourist;
  List<RiskZone> get riskZones => _riskZones;
  List<Incident> get incidents => _incidents;
  String get currentRiskLevel => _currentRiskLevel;
  String get currentAreaName => _currentAreaName;
  bool get showHighRiskNotification => _showHighRiskNotification;
  Incident? get activeTouristIncident => _activeTouristIncident;

  MockBackendService() {
    _initializeData();
  }

  void dismissNotification() {
    _showHighRiskNotification = false;
    notifyListeners();
  }

  void _initializeData() {
    // 1. Initialize Mock Tourist (Verified Digital Identity via DID mock)
    _currentTourist = Tourist(
      id: "TR-8842",
      name: "Rohan Sharma",
      verificationStatus: "Verified via Aadhaar DID",
      latitude: 12.9716, // Cubbon Park (Safe)
      longitude: 77.5946,
    );

    // 2. Initialize Predefined Risk Zones in Bengaluru
    _riskZones.addAll([
      RiskZone(
        id: "ZONE-01",
        name: "Cubbon Park Sanctuary",
        latitude: 12.9716,
        longitude: 77.5946,
        radius: 300.0, // 300 meters
        riskLevel: "LOW",
      ),
      RiskZone(
        id: "ZONE-02",
        name: "Vidhana Soudha North Gate",
        latitude: 12.9750,
        longitude: 77.5980,
        radius: 200.0, // 200 meters
        riskLevel: "MEDIUM",
      ),
      RiskZone(
        id: "ZONE-03",
        name: "Commercial Street Crowded Market",
        latitude: 12.9800,
        longitude: 77.6050,
        radius: 250.0, // 250 meters
        riskLevel: "HIGH",
      ),
    ]);

    // 3. Initialize Some Mock Historical Incidents on the Admin Dashboard
    _incidents.addAll([
      Incident(
        id: "INC-1022",
        touristId: "TR-5412",
        touristName: "Emily Watson",
        type: "Medical Alert",
        latitude: 12.9750,
        longitude: 77.5980,
        timestamp: DateTime.now().subtract(const Duration(hours: 3)),
        severity: "MEDIUM",
        status: "RESOLVED",
        timeline: [
          "Alert Triggered - 11:15 AM",
          "Responder Assigned - 11:22 AM",
          "Assistance Provided - 11:40 AM",
          "Incident Closed - 12:05 PM"
        ],
        blockchainHash: "0x8fa1cd349fe88b201a09887712bd",
      ),
      Incident(
        id: "INC-1023",
        touristId: "TR-1049",
        touristName: "John Doe",
        type: "Theft Report",
        latitude: 12.9800,
        longitude: 77.6050,
        timestamp: DateTime.now().subtract(const Duration(minutes: 45)),
        severity: "HIGH",
        status: "ASSIGNED",
        timeline: [
          "Report Filed - 01:30 PM",
          "Assigned to Inspector Patil - 01:40 PM"
        ],
        blockchainHash: "0x67db23e012bc09df881ab76a54cd",
      ),
    ]);

    // Perform initial risk analysis for current location
    _evaluateRiskAndGeoFence();
  }

  /// Calculates geographical distance in meters between two coordinates (Haversine formula).
  double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const double earthRadius = 6371000.0; // In meters
    double dLat = _toRadians(lat2 - lat1);
    double dLon = _toRadians(lon2 - lon1);
    double a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_toRadians(lat1)) *
            math.cos(_toRadians(lat2)) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);
    double c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    return earthRadius * c;
  }

  double _toRadians(double degree) {
    return degree * math.pi / 180.0;
  }

  /// Evaluates risk levels and manages the geo-fencing warning triggers.
  /// 
  /// --- FUTURE AI UPGRADE ---
  /// In the future, this rule-based evaluator will be replaced by a local/edge 
  /// AI inference engine that calculates a dynamic Risk Score by analyzing:
  /// - Crowd density indices (real-time camera telemetry)
  /// - Historical incident records in the sector
  /// - Weather & time-of-day contextual factors
  void _evaluateRiskAndGeoFence() {
    // If an SOS is currently active, force risk status to CRITICAL.
    if (_activeTouristIncident != null && _activeTouristIncident!.status != "RESOLVED") {
      _currentRiskLevel = "CRITICAL";
      return;
    }

    String evaluatedRisk = "LOW";
    String areaName = "General Unmapped Area";
    bool enteredHighRisk = false;

    for (var zone in _riskZones) {
      double distance = _calculateDistance(
        _currentTourist.latitude,
        _currentTourist.longitude,
        zone.latitude,
        zone.longitude,
      );

      if (distance <= zone.radius) {
        evaluatedRisk = zone.riskLevel;
        areaName = zone.name;
        if (zone.riskLevel == "HIGH") {
          enteredHighRisk = true;
        }
        break; // Stop at first matching zone
      }
    }

    _currentAreaName = areaName;
    _currentRiskLevel = evaluatedRisk;

    // Trigger geo-fencing notification when entering a high-risk zone
    if (enteredHighRisk) {
      _showHighRiskNotification = true;
    } else {
      _showHighRiskNotification = false;
    }
  }

  /// Simulates tourist movement to different coordinates for presentation.
  void simulateLocation(String areaType) {
    switch (areaType) {
      case 'safe':
        _currentTourist = _currentTourist.copyWith(
          latitude: 12.9716, // Cubbon Park
          longitude: 77.5946,
        );
        break;
      case 'moderate':
        _currentTourist = _currentTourist.copyWith(
          latitude: 12.9750, // Vidhana Soudha North Gate
          longitude: 77.5980,
        );
        break;
      case 'high':
        _currentTourist = _currentTourist.copyWith(
          latitude: 12.9800, // Commercial Street
          longitude: 77.6050,
        );
        break;
    }

    _evaluateRiskAndGeoFence();
    notifyListeners();
  }

  /// Creates a new SOS Incident.
  /// 
  /// --- FUTURE BLOCKCHAIN UPGRADE ---
  /// In production, when an incident is created:
  /// 1. We construct a secure JSON payload (Tourist ID, Location, Timestamp, Severity).
  /// 2. Generate a SHA-256 hash of the payload.
  /// 3. Publish the hash to a decentralized blockchain ledger (Hyperledger/Ethereum) 
  ///    to provide a tamper-evident audit log of emergency responses.
  /// The local prototype mocks this hashing behavior.
  void createSOSIncident() {
    final newId = "INC-${1024 + _incidents.length}";
    
    // Create SHA256-like mock hash for demonstration
    final mockHash = "0x" + newId.hashCode.toRadixString(16) + DateTime.now().millisecondsSinceEpoch.toRadixString(16);

    final newIncident = Incident(
      id: newId,
      touristId: _currentTourist.id,
      touristName: _currentTourist.name,
      type: "SOS",
      latitude: _currentTourist.latitude,
      longitude: _currentTourist.longitude,
      timestamp: DateTime.now(),
      severity: "HIGH",
      status: "NEW",
      timeline: [
        "SOS Triggered (${_formatTime(DateTime.now())})",
        "Incident Recorded in Secure Ledger",
        "Emergency Authority Notified"
      ],
      blockchainHash: mockHash,
    );

    _incidents.insert(0, newIncident);
    _activeTouristIncident = newIncident;
    _currentRiskLevel = "CRITICAL";

    notifyListeners();
  }

  /// Updates incident status from the Authority Dashboard.
  void updateIncidentStatus(String incidentId, String newStatus) {
    final index = _incidents.indexWhere((inc) => inc.id == incidentId);
    if (index != -1) {
      final currentIncident = _incidents[index];
      final List<String> updatedTimeline = List.from(currentIncident.timeline);
      
      String timeStr = _formatTime(DateTime.now());
      if (newStatus == "ASSIGNED") {
        updatedTimeline.add("Assigned to Dispatch Unit ($timeStr)");
      } else if (newStatus == "RESPONDING") {
        updatedTimeline.add("Responder Dispatched & En Route ($timeStr)");
      } else if (newStatus == "RESOLVED") {
        updatedTimeline.add("Incident Resolved & Safe Code Verified ($timeStr)");
      }

      final updatedIncident = currentIncident.copyWith(
        status: newStatus,
        timeline: updatedTimeline,
      );

      _incidents[index] = updatedIncident;

      // Sync active tourist incident if it's the one being modified
      if (_activeTouristIncident != null && _activeTouristIncident!.id == incidentId) {
        _activeTouristIncident = updatedIncident;
        if (newStatus == "RESOLVED") {
          // Reset tourist state
          _activeTouristIncident = null;
          _evaluateRiskAndGeoFence();
        }
      }

      notifyListeners();
    }
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour.toString().padLeft(2, '0');
    final min = dt.minute.toString().padLeft(2, '0');
    return "$hour:$min";
  }
}
