import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/mock_backend_service.dart';

class DemoControllerPanel extends StatefulWidget {
  final VoidCallback? onSOSPressed;
  
  const DemoControllerPanel({
    super.key,
    this.onSOSPressed,
  });

  @override
  State<DemoControllerPanel> createState() => _DemoControllerPanelState();
}

class _SplashScreenState {}

class _DemoControllerPanelState extends State<DemoControllerPanel> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<MockBackendService>(context);
    final theme = Theme.of(context);

    return Align(
      alignment: Alignment.bottomRight,
      child: Padding(
        padding: const EdgeInsets.only(right: 16.0, bottom: 85.0), // Above bottom nav bar
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          width: _isExpanded ? 260.0 : 56.0,
          height: _isExpanded ? 340.0 : 56.0,
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceVariant.withOpacity(0.95),
            borderRadius: BorderRadius.circular(_isExpanded ? 16.0 : 28.0),
            border: Border.all(
              color: theme.colorScheme.outline.withOpacity(0.2),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.25),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: _isExpanded ? _buildExpandedContent(service, theme) : _buildCollapsedIcon(theme),
        ),
      ),
    );
  }

  Widget _buildCollapsedIcon(ThemeData theme) {
    return InkWell(
      onTap: () => setState(() => _isExpanded = true),
      borderRadius: BorderRadius.circular(28.0),
      child: Center(
        child: Icon(
          Icons.sports_esports_outlined,
          color: theme.colorScheme.onSurfaceVariant,
          size: 28,
        ),
      ),
    );
  }

  Widget _buildExpandedContent(MockBackendService service, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Header
        Container(
          color: theme.colorScheme.primaryContainer,
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.sports_esports,
                    size: 20,
                    color: theme.colorScheme.onPrimaryContainer,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    "Demo Simulator",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: theme.colorScheme.onPrimaryContainer,
                    ),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 18),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () => setState(() => _isExpanded = false),
                color: theme.colorScheme.onPrimaryContainer,
              ),
            ],
          ),
        ),

        // Controls list
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                const Text(
                  "Change simulated coordinate sector to trigger geo-fence rules:",
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                  textAlign: TextAlign.center,
                ),
                
                // Safe Area Button
                OutlinedButton.icon(
                  onPressed: () {
                    service.simulateLocation('safe');
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Simulating location: Cubbon Park (Safe Zone)"),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: const Icon(Icons.check_circle_outline, color: Colors.green, size: 16),
                  label: const Text("Safe Area", style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    alignment: Alignment.centerLeft,
                  ),
                ),

                // Moderate Risk Button
                OutlinedButton.icon(
                  onPressed: () {
                    service.simulateLocation('moderate');
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Simulating location: Vidhana Soudha (Moderate Risk)"),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: const Icon(Icons.warning_amber_rounded, color: Colors.orange, size: 16),
                  label: const Text("Moderate Risk Area", style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    alignment: Alignment.centerLeft,
                  ),
                ),

                // High Risk Button
                OutlinedButton.icon(
                  onPressed: () {
                    service.simulateLocation('high');
                  },
                  icon: const Icon(Icons.dangerous_outlined, color: Colors.red, size: 16),
                  label: const Text("High Risk Area", style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    alignment: Alignment.centerLeft,
                  ),
                ),

                const Divider(height: 12, thickness: 1),

                // Trigger SOS simulation Button
                ElevatedButton.icon(
                  onPressed: () {
                    if (widget.onSOSPressed != null) {
                      widget.onSOSPressed!();
                    } else {
                      // Fallback if not on home screen
                      service.createSOSIncident();
                    }
                  },
                  icon: const Icon(Icons.ring_volume, size: 16),
                  label: const Text("Trigger SOS", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
