import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/mock_backend_service.dart';

class IncidentStatusScreen extends StatelessWidget {
  const IncidentStatusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<MockBackendService>(context);
    final theme = Theme.of(context);
    final activeIncident = service.activeTouristIncident;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Safety Incident Center", style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: activeIncident == null
          ? _buildNoActiveIncident(theme)
          : _buildActiveIncidentDetails(activeIncident, theme),
    );
  }

  Widget _buildNoActiveIncident(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.green.withOpacity(0.1),
              ),
              child: const Icon(
                Icons.gpp_good_outlined,
                size: 64,
                color: Colors.green,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              "No Active Incidents",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              "Your digital safety monitor is active and secure. No emergency requests or SOS tickets are currently open for your device.",
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.5),
            ),
            const SizedBox(height: 32),
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.blue),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        "If you are experiencing an emergency, navigate to the Home screen and tap the large SOS button to request assistance.",
                        style: TextStyle(fontSize: 12, height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActiveIncidentDetails(dynamic incident, ThemeData theme) {
    // Determine color based on status
    Color statusColor;
    switch (incident.status) {
      case 'RESOLVED':
        statusColor = Colors.green;
        break;
      case 'RESPONDING':
        statusColor = Colors.blue;
        break;
      case 'ASSIGNED':
        statusColor = Colors.orange;
        break;
      case 'NEW':
      default:
        statusColor = Colors.red;
        break;
    }

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Incident Header Card
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "INCIDENT ${incident.id}",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: statusColor, width: 1.5),
                          ),
                          child: Text(
                            incident.status,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: statusColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    _buildInfoRow("Incident Type", incident.type),
                    _buildInfoRow("Severity Level", incident.severity, valueColor: Colors.red),
                    _buildInfoRow(
                      "Target Coordinates",
                      "Lat: ${incident.latitude.toStringAsFixed(5)}, Lng: ${incident.longitude.toStringAsFixed(5)}",
                      fontFamily: 'monospace',
                    ),
                    _buildInfoRow(
                      "Trigger Timestamp",
                      incident.timestamp.toString().substring(0, 19),
                    ),
                    
                    // Blockchain Audit Row
                    if (incident.blockchainHash != null) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(8.0),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade900.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.link, size: 16, color: Colors.blue),
                            const SizedBox(width: 8),
                            const Text(
                              "Ledger Hash:",
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                incident.blockchainHash!,
                                style: const TextStyle(fontSize: 9, fontFamily: 'monospace', color: Colors.grey),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Live Timeline Title
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 8.0),
              child: Text(
                "RESPONSE TIMELINE",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                  letterSpacing: 0.5,
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Visual Timeline Stepper Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: _buildTimelineSteps(incident.timeline, theme),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {Color? valueColor, String? fontFamily}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w500),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: valueColor,
              fontFamily: fontFamily,
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildTimelineSteps(List<String> timeline, ThemeData theme) {
    List<Widget> steps = [];

    // The statuses in order are: NEW, ASSIGNED, RESPONDING, RESOLVED
    // We map the actual timeline list items to vertical steps.
    for (int i = 0; i < timeline.length; i++) {
      bool isLast = i == timeline.length - 1;
      steps.add(
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Vertical line and node indicator
            Column(
              children: [
                // Indicator Node
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isLast ? theme.colorScheme.primary : Colors.grey.shade400,
                    border: Border.all(
                      color: isLast ? theme.colorScheme.primaryContainer : Colors.white,
                      width: 2,
                    ),
                  ),
                  child: isLast
                      ? const Center(
                          child: Icon(Icons.circle, size: 6, color: Colors.white),
                        )
                      : null,
                ),
                // Line
                if (!isLast)
                  Container(
                    width: 2,
                    height: 40,
                    color: Colors.grey.shade300,
                  ),
              ],
            ),
            const SizedBox(width: 16),
            // Text Details
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(top: 1.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      timeline[i],
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isLast ? FontWeight.bold : FontWeight.w500,
                        color: isLast ? theme.colorScheme.onSurface : Colors.grey.shade600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    if (isLast)
                      Text(
                        "Updating in real-time...",
                        style: TextStyle(fontSize: 10, color: theme.colorScheme.primary, fontStyle: FontStyle.italic),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return steps;
  }
}
