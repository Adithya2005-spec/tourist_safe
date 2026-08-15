import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/mock_backend_service.dart';
import 'main_navigation.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  /// Static helper to trigger the SOS dialog from other screens (like the global demo overlay)
  static void triggerSOSDialog(BuildContext context) {
    final service = Provider.of<MockBackendService>(context, listen: false);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          icon: const Icon(Icons.warning, color: Colors.red, size: 48),
          title: const Text("Emergency Assistance"),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Are you sure you want to send an SOS?",
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              SizedBox(height: 12),
              Text(
                "Your current location will be shared immediately with the monitoring authority.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
            ],
          ),
          actionsAlignment: MainAxisAlignment.spaceEvenly,
          actions: [
            OutlinedButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                service.createSOSIncident();
                Navigator.of(dialogContext).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("🚨 SOS Sent to Authorities successfully!"),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              child: const Text("SEND SOS"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<MockBackendService>(context);
    final theme = Theme.of(context);

    // Get color variables based on safety levels
    Color riskColor;
    String riskText;
    IconData riskIcon;
    Color cardBg;

    switch (service.currentRiskLevel) {
      case 'CRITICAL':
        riskColor = Colors.red;
        riskText = "CRITICAL EMERGENCY";
        riskIcon = Icons.emergency;
        cardBg = Colors.red.shade900.withOpacity(0.15);
        break;
      case 'HIGH':
        riskColor = Colors.red;
        riskText = "HIGH RISK";
        riskIcon = Icons.gpp_bad;
        cardBg = Colors.red.shade900.withOpacity(0.1);
        break;
      case 'MEDIUM':
        riskColor = Colors.orange;
        riskText = "MODERATE RISK";
        riskIcon = Icons.report_problem;
        cardBg = Colors.orange.shade900.withOpacity(0.1);
        break;
      case 'LOW':
      default:
        riskColor = Colors.green;
        riskText = "SAFE AREA";
        riskIcon = Icons.check_circle;
        cardBg = Colors.green.shade900.withOpacity(0.1);
        break;
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.shield, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            const Text(
              "RakshaSetu",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          // Simulated Digital Identity Verification Badge
          Container(
            margin: const EdgeInsets.only(right: 16.0),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.blue.shade900.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.blue.shade400, width: 1),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.verified_user, color: Colors.blue.shade400, size: 14),
                const SizedBox(width: 4),
                const Text(
                  "Verified DID",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Risk Status Indicator Banner Card
              Card(
                elevation: 0,
                color: cardBg,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: Border.all(color: riskColor.withOpacity(0.4), width: 1.5),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: riskColor.withOpacity(0.2),
                        ),
                        child: Icon(riskIcon, color: riskColor, size: 30),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Safety Status",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              riskText,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: riskColor,
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              service.currentRiskLevel == 'LOW'
                                  ? "🟢 You are currently in a SAFE area"
                                  : service.currentRiskLevel == 'MEDIUM'
                                      ? "🟡 Caution: Moderate risk detected"
                                      : "🔴 Warning: high-risk zone entered",
                              style: TextStyle(
                                fontSize: 13,
                                color: theme.colorScheme.onSurface,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Location Information Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "Current Location",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                            ),
                          ),
                          Icon(Icons.location_on, color: theme.colorScheme.secondary),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        service.currentAreaName,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        "Lat: ${service.currentTourist.latitude.toStringAsFixed(5)}, Lng: ${service.currentTourist.longitude.toStringAsFixed(5)}",
                        style: const TextStyle(
                          fontSize: 12,
                          fontFamily: 'monospace',
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Open Safety Map Navigation Button
                      OutlinedButton.icon(
                        onPressed: () {
                          // Search for the MainNavigation state and switch tab
                          final navState = context.findAncestorStateOfType<State<MainNavigation>>();
                          if (navState != null) {
                            // Call the setState of MainNavigation to switch tab to index 1 (Map)
                            // We can use a callback or cast to dynamic if it's open, but we modified
                            // main_navigation.dart to make this seamless or handle it through provider.
                            // To be absolutely clean, we let MainNavigation read context or call setTab if we make it public.
                            // We can cast the state to access its custom method if we export it.
                            // Or let's trigger a tab switch via dynamic cast.
                            (navState as dynamic).setState(() {
                              (navState as dynamic)._currentIndex = 1; // Tab 1 is Safety Map
                            });
                          }
                        },
                        icon: const Icon(Icons.map),
                        label: const Text("Open Safety Map"),
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // SOS Title
              const Center(
                child: Text(
                  "EMERGENCY ASSISTANCE",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                    letterSpacing: 1.0,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Prominent Circular Pulsing SOS Button
              Center(
                child: Container(
                  width: 180,
                  height: 180,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.red.withOpacity(0.08),
                    border: Border.all(
                      color: Colors.red.withOpacity(0.15),
                      width: 8,
                    ),
                  ),
                  child: Center(
                    child: Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.red.withOpacity(0.12),
                        border: Border.all(
                          color: Colors.red.withOpacity(0.3),
                          width: 6,
                        ),
                      ),
                      child: Center(
                        child: ClipOval(
                          child: Material(
                            color: const Color(0xFFEF4444),
                            child: InkWell(
                              onTap: () => triggerSOSDialog(context),
                              child: const SizedBox(
                                width: 110,
                                height: 110,
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.warning_amber_rounded,
                                      color: Colors.white,
                                      size: 38,
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      "🚨 SOS",
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Center(
                child: Text(
                  "Hold or Tap to Activate Emergency Services\n(Requires Confirmation)",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey,
                  ),
                ),
              ),

              // Recent Safety Alert Section
              const SizedBox(height: 30),
              if (service.activeTouristIncident != null) ...[
                Card(
                  color: Colors.red.shade900.withOpacity(0.1),
                  child: ListTile(
                    leading: const Icon(Icons.notification_important, color: Colors.red),
                    title: Text(
                      "Active SOS Incident: ${service.activeTouristIncident!.id}",
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
                    ),
                    subtitle: Text("Status: ${service.activeTouristIncident!.status}"),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                    onTap: () {
                      final navState = context.findAncestorStateOfType<State<MainNavigation>>();
                      if (navState != null) {
                        (navState as dynamic).setState(() {
                          (navState as dynamic)._currentIndex = 2; // Index 2 is Incident Tab
                        });
                      }
                    },
                  ),
                ),
              ] else ...[
                Card(
                  elevation: 0,
                  color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: Border.all(color: theme.colorScheme.outline.withOpacity(0.1)),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.all(12.0),
                    child: Row(
                      children: [
                        Icon(Icons.gpp_good, color: Colors.green, size: 20),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            "No active alerts. Safe journey!",
                            style: TextStyle(fontSize: 12, color: Colors.grey),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
