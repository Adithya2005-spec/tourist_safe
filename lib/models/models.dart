/// Data models for the Smart Tourist Safety & Incident Response System.
/// 
/// Future integrations (Blockchain, AI, Digital Identity) are documented 
/// in comments within each class.

/// Represents a monitored tourist using the app.
class Tourist {
  final String id;
  final String name;
  
  /// In a production system, this verification status is backed by a 
  /// Blockchain-based Decentralized Identifier (DID) and Verifiable Credentials.
  /// The local prototype mocks this verification layer.
  final String verificationStatus; 
  
  final double latitude;
  final double longitude;

  Tourist({
    required this.id,
    required this.name,
    required this.verificationStatus,
    required this.latitude,
    required this.longitude,
  });

  Tourist copyWith({
    String? id,
    String? name,
    String? verificationStatus,
    double? latitude,
    double? longitude,
  }) {
    return Tourist(
      id: id ?? this.id,
      name: name ?? this.name,
      verificationStatus: verificationStatus ?? this.verificationStatus,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
    );
  }
}

/// Represents a circular geographical safety zone or risk zone.
class RiskZone {
  final String id;
  final String name;
  final double latitude;
  final double longitude;
  final double radius; // In meters
  
  /// Possible risk levels: 'LOW', 'MEDIUM', 'HIGH'
  final String riskLevel;

  RiskZone({
    required this.id,
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.radius,
    required this.riskLevel,
  });
}

/// Represents an emergency incident report created when a tourist triggers an SOS.
class Incident {
  final String id;
  final String touristId;
  final String touristName;
  final String type; // e.g., 'SOS', 'Alert'
  final double latitude;
  final double longitude;
  final DateTime timestamp;
  
  /// Severity levels: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  /// Handled by the AI Risk Engine in future upgrades.
  final String severity; 
  
  /// Lifecycle status: 'NEW' -> 'ASSIGNED' -> 'RESPONDING' -> 'RESOLVED'
  final String status;

  /// Keeps a structured log of actions for compliance and blockchain hashing.
  final List<String> timeline;

  /// Hash of the incident, to be written to a ledger in future blockchain implementations
  final String? blockchainHash; 

  Incident({
    required this.id,
    required this.touristId,
    required this.touristName,
    required this.type,
    required this.latitude,
    required this.longitude,
    required this.timestamp,
    required this.severity,
    required this.status,
    required this.timeline,
    this.blockchainHash,
  });

  Incident copyWith({
    String? id,
    String? touristId,
    String? touristName,
    String? type,
    double? latitude,
    double? longitude,
    DateTime? timestamp,
    String? severity,
    String? status,
    List<String>? timeline,
    String? blockchainHash,
  }) {
    return Incident(
      id: id ?? this.id,
      touristId: touristId ?? this.touristId,
      touristName: touristName ?? this.touristName,
      type: type ?? this.type,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      timestamp: timestamp ?? this.timestamp,
      severity: severity ?? this.severity,
      status: status ?? this.status,
      timeline: timeline ?? this.timeline,
      blockchainHash: blockchainHash ?? this.blockchainHash,
    );
  }
}
