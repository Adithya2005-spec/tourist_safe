import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong2.dart';
import 'package:provider/provider.dart';
import '../services/mock_backend_service.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  bool _useVectorRadar = false; // Toggle between OpenStreetMap and Vector Radar HUD

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<MockBackendService>(context);
    final theme = Theme.of(context);

    // Get current tourist coordinate
    final LatLng touristLatLng = LatLng(
      service.currentTourist.latitude,
      service.currentTourist.longitude,
    );

    // Sync map controller center when coordinate changes in simulator
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_useVectorRadar && _mapController.mounted) {
        _mapController.move(touristLatLng, 14.5);
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text("Safety Map Hub", style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          // Toggle map rendering mode
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                _useVectorRadar ? "Radar HUD" : "OSM Map",
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
              Switch(
                value: _useVectorRadar,
                onChanged: (val) {
                  setState(() {
                    _useVectorRadar = val;
                  });
                },
              ),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Stack(
        children: [
          // Map Background (OSM Tile Map or HUD Radar Vector)
          Positioned.fill(
            child: _useVectorRadar
                ? _buildVectorRadarHUD(service, theme)
                : _buildOpenStreetMap(service, touristLatLng),
          ),

          // Top Information Banner
          Positioned(
            top: 16.0,
            left: 16.0,
            right: 16.0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface.withOpacity(0.92),
                borderRadius: BorderRadius.circular(12.0),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, blurRadius: 6, offset: Offset(0, 2)),
                ],
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.explore,
                    color: theme.colorScheme.primary,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          "Monitored Area Sector",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                        ),
                        Text(
                          service.currentAreaName,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: service.currentRiskLevel == 'LOW'
                          ? Colors.green.withOpacity(0.15)
                          : service.currentRiskLevel == 'MEDIUM'
                              ? Colors.orange.withOpacity(0.15)
                              : Colors.red.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      service.currentRiskLevel,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: service.currentRiskLevel == 'LOW'
                            ? Colors.green
                            : service.currentRiskLevel == 'MEDIUM'
                                ? Colors.orange
                                : Colors.red,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom Left Map Legend
          Positioned(
            left: 16.0,
            bottom: 85.0, // Floating above navigation bar
            child: Container(
              padding: const EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface.withOpacity(0.92),
                borderRadius: BorderRadius.circular(12.0),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, blurRadius: 6, offset: Offset(0, 2)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    "MAP LEGEND",
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 6),
                  _buildLegendItem(Colors.green, "Safe Zone (LOW)"),
                  _buildLegendItem(Colors.orange, "Caution (MEDIUM)"),
                  _buildLegendItem(Colors.red, "High Risk (HIGH)"),
                  _buildLegendItem(Colors.blue, "Your Location"),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(shape: BoxShape.circle, color: color),
          ),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildOpenStreetMap(MockBackendService service, LatLng center) {
    // Generate circles for geo-fencing visuals
    final List<CircleMarker> circles = service.riskZones.map((zone) {
      Color color;
      switch (zone.riskLevel) {
        case 'HIGH':
          color = Colors.red;
          break;
        case 'MEDIUM':
          color = Colors.orange;
          break;
        case 'LOW':
        default:
          color = Colors.green;
          break;
      }
      return CircleMarker(
        point: LatLng(zone.latitude, zone.longitude),
        color: color.withOpacity(0.16),
        borderColor: color,
        borderStrokeWidth: 2,
        useRadiusInMeter: true,
        radius: zone.radius,
      );
    }).toList();

    // Markers representing zone centers and current tourist location
    final List<Marker> markers = [];

    // Add tourist marker
    markers.add(
      Marker(
        point: center,
        width: 48,
        height: 48,
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Pulse Ring
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.blue.withOpacity(0.25),
              ),
            ),
            // Core blue location dot
            Container(
              width: 14,
              height: 14,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.blue.shade600,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
          ],
        ),
      ),
    );

    // Add pins for zone centers
    for (var zone in service.riskZones) {
      Color color = zone.riskLevel == 'HIGH'
          ? Colors.red
          : zone.riskLevel == 'MEDIUM'
              ? Colors.orange
              : Colors.green;

      markers.add(
        Marker(
          point: LatLng(zone.latitude, zone.longitude),
          width: 32,
          height: 32,
          child: Icon(
            Icons.location_on,
            color: color,
            size: 24,
          ),
        ),
      );
    }

    return FlutterMap(
      mapController: _mapController,
      options: MapOptions(
        initialCenter: center,
        initialZoom: 14.5,
        minZoom: 12.0,
        maxZoom: 18.0,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.sih260483.tourist_safe',
        ),
        CircleLayer(circles: circles),
        MarkerLayer(markers: markers),
      ],
    );
  }

  Widget _buildVectorRadarHUD(MockBackendService service, ThemeData theme) {
    return Container(
      color: const Color(0xFF0F172A), // Dark space background
      child: LayoutBuilder(
        builder: (context, constraints) {
          return CustomPaint(
            size: Size(constraints.maxWidth, constraints.maxHeight),
            painter: RadarMapPainter(
              service: service,
              primaryColor: theme.colorScheme.primary,
            ),
          );
        },
      ),
    );
  }
}

/// A premium, offline-ready sci-fi custom painter drawing location sectors relative to coordinates
class RadarMapPainter extends CustomPainter {
  final MockBackendService service;
  final Color primaryColor;

  RadarMapPainter({required this.service, required this.primaryColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paintGrid = Paint()
      ..color = Colors.teal.shade800.withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    final paintZoneFill = Paint()..style = PaintingStyle.fill;
    final paintZoneBorder = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // Draw Radar rings (concentric circles)
    for (double radius = 60.0; radius <= size.width / 1.2; radius += 60.0) {
      canvas.drawCircle(center, radius, paintGrid);
    }

    // Draw Crosshairs
    canvas.drawLine(Offset(0, center.dy), Offset(size.width, center.dy), paintGrid);
    canvas.drawLine(Offset(center.dx, 0), Offset(center.dx, size.height), paintGrid);

    // Coordinate conversion mapping
    // We place the Tourist directly at the center of our Radar HUD,
    // and draw the relative offsets of risk zones around them.
    final touristLat = service.currentTourist.latitude;
    final touristLng = service.currentTourist.longitude;

    // Scale factors: roughly 1 meter = 0.5 pixels
    const double meterToPixelScale = 0.65;

    for (var zone in service.riskZones) {
      // Calculate relative delta in meters
      // Approx: 1 degree latitude = 111,000 meters
      // Approx: 1 degree longitude = 111,000 * cos(lat) meters
      double deltaLatMeters = (zone.latitude - touristLat) * 111000.0;
      double deltaLngMeters = (zone.longitude - touristLng) * 111000.0 * 0.976; // cos(12.9) approx 0.976

      // Flip Y because canvas coordinates increase downwards, while latitude increases upwards
      double zoneX = center.dx + (deltaLngMeters * meterToPixelScale);
      double zoneY = center.dy - (deltaLatMeters * meterToPixelScale);

      Color color;
      switch (zone.riskLevel) {
        case 'HIGH':
          color = Colors.red;
          break;
        case 'MEDIUM':
          color = Colors.orange;
          break;
        case 'LOW':
        default:
          color = Colors.green;
          break;
      }

      final zoneCenter = Offset(zoneX, zoneY);
      final zoneRadius = zone.radius * meterToPixelScale;

      // Draw Zone Circle filled
      paintZoneFill.color = color.withOpacity(0.12);
      canvas.drawCircle(zoneCenter, zoneRadius, paintZoneFill);

      // Draw Zone Circle Border
      paintZoneBorder.color = color.withOpacity(0.7);
      canvas.drawCircle(zoneCenter, zoneRadius, paintZoneBorder);

      // Draw Zone Text Label
      final textPainter = TextPainter(
        text: TextSpan(
          text: zone.name,
          style: TextStyle(color: color.withOpacity(0.8), fontSize: 9.0, fontWeight: FontWeight.bold),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(zoneX - textPainter.width / 2, zoneY - zoneRadius - 14));
    }

    // Draw Tourist at absolute HUD Center
    final touristPaintFill = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;
    final touristPaintRing = Paint()
      ..color = Colors.blue.withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0;

    canvas.drawCircle(center, 7.0, touristPaintFill);
    canvas.drawCircle(center, 16.0, touristPaintRing);

    final selfLabel = TextPainter(
      text: const TextSpan(
        text: "YOU (Rohan)",
        style: TextStyle(color: Colors.blue, fontSize: 10.0, fontWeight: FontWeight.bold, letterSpacing: 0.5),
      ),
      textDirection: TextDirection.ltr,
    );
    selfLabel.layout();
    selfLabel.paint(canvas, Offset(center.dx - selfLabel.width / 2, center.dy + 20));
  }

  @override
  bool shouldRepaint(covariant RadarMapPainter oldDelegate) {
    return oldDelegate.service.currentTourist.latitude != service.currentTourist.latitude ||
        oldDelegate.service.currentTourist.longitude != service.currentTourist.longitude ||
        oldDelegate.service.currentRiskLevel != service.currentRiskLevel;
  }
}
