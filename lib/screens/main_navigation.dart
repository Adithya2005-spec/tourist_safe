import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/mock_backend_service.dart';
import 'home_screen.dart';
import 'map_screen.dart';
import 'incident_status_screen.dart';
import 'dashboard_screen.dart';
import '../widgets/demo_controller_panel.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const MapScreen(),
    const IncidentStatusScreen(),
    const DashboardScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<MockBackendService>(context);
    final theme = Theme.of(context);

    // If an SOS incident is newly created, automatically focus the Incident tab (index 2)
    // so the tourist immediately sees their ticket timeline.
    if (service.activeTouristIncident != null && _currentIndex == 0) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        setState(() {
          _currentIndex = 2; // Redirect to Incident Status
        });
      });
    }

    return Scaffold(
      body: Stack(
        children: [
          // Keep screen states alive using IndexedStack
          IndexedStack(
            index: _currentIndex,
            children: _screens,
          ),

          // Global Geo-fencing High-Risk alert overlay
          if (service.showHighRiskNotification)
            _buildGeoFenceOverlay(service, theme),

          // Global floating simulator dashboard
          DemoControllerPanel(
            onSOSPressed: () {
              // Trigger SOS modal manually
              if (_currentIndex == 0) {
                // If on Home, it will trigger the Home screen's SOS dialog
                HomeScreen.triggerSOSDialog(context);
              } else {
                // Otherwise, switch to home and trigger it
                setState(() => _currentIndex = 0);
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  HomeScreen.triggerSOSDialog(context);
                });
              }
            },
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.map_outlined),
            selectedIcon: Icon(Icons.map),
            label: 'Safety Map',
          ),
          NavigationDestination(
            icon: Icon(Icons.emergency_outlined),
            selectedIcon: Icon(Icons.emergency),
            label: 'Incident',
          ),
          NavigationDestination(
            icon: Icon(Icons.admin_panel_settings_outlined),
            selectedIcon: Icon(Icons.admin_panel_settings),
            label: 'Dashboard',
          ),
        ],
      ),
    );
  }

  Widget _buildGeoFenceOverlay(MockBackendService service, ThemeData theme) {
    return Positioned(
      top: 60.0,
      left: 16.0,
      right: 16.0,
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Colors.red.shade900.withOpacity(0.95),
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(color: Colors.red.shade400, width: 2),
          boxShadow: const [
            BoxShadow(
              color: Colors.black38,
              blurRadius: 8,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.only(top: 2.0),
              child: Icon(
                Icons.warning_amber_rounded,
                color: Colors.white,
                size: 28,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    "⚠️ HIGH-RISK AREA",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "You have entered: ${service.currentAreaName}.",
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "Please consider moving toward a safer location.",
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close, color: Colors.white70),
              onPressed: () {
                service.dismissNotification();
              },
            ),
          ],
        ),
      ),
    );
  }
}
