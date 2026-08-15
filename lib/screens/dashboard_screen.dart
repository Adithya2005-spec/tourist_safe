import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/mock_backend_service.dart';
import '../models/models.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Incident? _selectedIncident;

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<MockBackendService>(context);
    final theme = Theme.of(context);

    // Compute KPI metrics dynamically
    final activeCount = service.incidents.where((inc) => inc.status != 'RESOLVED').length;
    final highRiskZonesCount = service.riskZones.where((z) => z.riskLevel == 'HIGH').length;
    final sosTodayCount = service.incidents.where((inc) => inc.type == 'SOS').length;
    const touristsMonitored = 24; // Mock standard

    // Sync selected incident state when data changes
    if (_selectedIncident != null) {
      final updated = service.incidents.firstWhere(
        (inc) => inc.id == _selectedIncident!.id,
        orElse: () => _selectedIncident!,
      );
      _selectedIncident = updated;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("Authority Monitoring Dashboard", style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: theme.colorScheme.surfaceVariant.withOpacity(0.5),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Section 1: KPI Overview Cards Grid
              Row(
                children: [
                  Expanded(
                    child: _buildKPICard(
                      "ACTIVE INCIDENTS", 
                      activeCount.toString(), 
                      activeCount > 0 ? Colors.red : Colors.green,
                      Icons.notification_important,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildKPICard(
                      "HIGH RISK ZONES", 
                      highRiskZonesCount.toString(), 
                      Colors.orange,
                      Icons.gpp_bad,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: _buildKPICard(
                      "MONITORED TOURISTS", 
                      touristsMonitored.toString(), 
                      Colors.blue,
                      Icons.people,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildKPICard(
                      "SOS TICKETS TODAY", 
                      sosTodayCount.toString(), 
                      Colors.red.shade700,
                      Icons.emergency,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Section 2: Master-Detail Layout Header
              const Text(
                "REAL-TIME INCIDENT RESPONSE QUEUE",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 12),

              // Section 3: Master Incident List View
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: service.incidents.length,
                itemBuilder: (context, index) {
                  final incident = service.incidents[index];
                  bool isSelected = _selectedIncident?.id == incident.id;

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

                  return Card(
                    color: isSelected 
                        ? theme.colorScheme.primaryContainer.withOpacity(0.3)
                        : theme.colorScheme.surface,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: Border.all(
                        color: isSelected 
                            ? theme.colorScheme.primary 
                            : theme.colorScheme.outline.withOpacity(0.1),
                        width: isSelected ? 1.5 : 1.0,
                      ),
                    ),
                    margin: const EdgeInsets.symmetric(vertical: 6.0),
                    child: ListTile(
                      title: Row(
                        children: [
                          Text(
                            incident.id,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: statusColor.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              incident.status,
                              style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: statusColor),
                            ),
                          ),
                        ],
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text("Type: ${incident.type} | Tourist: ${incident.touristName}"),
                          Text(
                            "Triggered: ${incident.timestamp.toString().substring(11, 16)} | Location: Lat ${incident.latitude.toStringAsFixed(4)}",
                            style: const TextStyle(fontSize: 11, color: Colors.grey),
                          ),
                        ],
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: incident.severity == 'HIGH' || incident.severity == 'CRITICAL'
                              ? Colors.red.withOpacity(0.15)
                              : Colors.orange.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          incident.severity,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: incident.severity == 'HIGH' || incident.severity == 'CRITICAL'
                                ? Colors.red
                                : Colors.orange,
                          ),
                        ),
                      ),
                      onTap: () {
                        setState(() {
                          _selectedIncident = incident;
                        });
                      },
                    ),
                  );
                },
              ),

              // Section 4: Dynamic Control Panel for Selected Incident
              if (_selectedIncident != null) ...[
                const SizedBox(height: 24),
                _buildDetailsControlPanel(service, theme),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKPICard(String label, String value, Color color, IconData icon) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: Border.all(color: Colors.grey.shade300, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailsControlPanel(MockBackendService service, ThemeData theme) {
    final incident = _selectedIncident!;
    
    // Check which buttons should be enabled
    bool canAssign = incident.status == 'NEW';
    bool canRespond = incident.status == 'ASSIGNED';
    bool canResolve = incident.status == 'RESPONDING';

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: Border.all(color: theme.colorScheme.primary.withOpacity(0.3), width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Control Operations - ${incident.id}",
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => setState(() => _selectedIncident = null),
                ),
              ],
            ),
            const Divider(height: 16),
            
            // Detail metadata
            _buildDetailRow("Tourist ID", incident.touristId),
            _buildDetailRow("Tourist Name", incident.touristName),
            _buildDetailRow("Severity Class", incident.severity),
            _buildDetailRow("Timestamp", incident.timestamp.toString().substring(0, 19)),
            _buildDetailRow("Coordinates", "Lat ${incident.latitude}, Lng ${incident.longitude}"),
            
            if (incident.blockchainHash != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8.0),
                decoration: BoxDecoration(
                  color: Colors.blue.shade900.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.security, size: 14, color: Colors.blue),
                    const SizedBox(width: 8),
                    const Text("Audit Proof:", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
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
            
            const SizedBox(height: 16),
            const Text(
              "WORKFLOW ACTIONS",
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            
            // Row of Action buttons
            Row(
              children: [
                // Button 1: Assign
                Expanded(
                  child: ElevatedButton(
                    onPressed: canAssign 
                        ? () {
                            service.updateIncidentStatus(incident.id, "ASSIGNED");
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text("Incident ${incident.id} assigned to dispatcher.")),
                            );
                          } 
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange.shade800,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Assign", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 8),
                
                // Button 2: Mark Responding
                Expanded(
                  child: ElevatedButton(
                    onPressed: canRespond
                        ? () {
                            service.updateIncidentStatus(incident.id, "RESPONDING");
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text("Responder dispatched to ${incident.id} location.")),
                            );
                          } 
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade800,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Respond", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 8),
                
                // Button 3: Resolve
                Expanded(
                  child: ElevatedButton(
                    onPressed: canResolve
                        ? () {
                            service.updateIncidentStatus(incident.id, "RESOLVED");
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text("Incident ${incident.id} closed and resolved.")),
                            );
                          } 
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade800,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Resolve", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
