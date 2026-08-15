import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/mock_backend_service.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => MockBackendService(),
      child: const RakshaSetuApp(),
    ),
  );
}

class RakshaSetuApp extends StatelessWidget {
  const RakshaSetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RakshaSetu - Smart Safety Hub',
      debugShowCheckedModeBanner: false,
      
      // Premium M3 Dark Theme configuration matching high-fidelity safety tech
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        primaryColor: const Color(0xFFEF4444), // Safety Red
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
        
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFEF4444),       // Vivid red for alerts/SOS
          primaryContainer: Color(0xFF7F1D1D),
          secondary: Color(0xFF3B82F6),     // Electric blue for identity/info
          secondaryContainer: Color(0xFF1E3A8A),
          tertiary: Color(0xFFF59E0B),      // Amber for moderate warning
          surface: Color(0xFF1E293B),       // Slate 800 for cards and items
          surfaceVariant: Color(0xFF334155), // Slate 700 for controls/indicators
          background: Color(0xFF0F172A),
          outline: Color(0xFF475569),
        ),

        // Custom Typography
        textTheme: const TextTheme(
          headlineMedium: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 0.5),
          titleLarge: TextStyle(fontWeight: FontWeight.w600, color: Colors.white),
          bodyMedium: TextStyle(color: Color(0xFFE2E8F0)), // Slate 200
        ),

        // Custom Card theme
        cardTheme: CardTheme(
          color: const Color(0xFF1E293B),
          elevation: 2,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: Color(0xFF334155), width: 1),
          ),
        ),

        // Custom Navigation Bar theme
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: const Color(0xFF1E293B),
          indicatorColor: const Color(0xFFEF4444).withOpacity(0.2),
          labelTextStyle: MaterialStateProperty.resolveWith((states) {
            if (states.contains(MaterialState.selected)) {
              return const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 12);
            }
            return const TextStyle(color: Colors.grey, fontSize: 12);
          }),
          iconTheme: MaterialStateProperty.resolveWith((states) {
            if (states.contains(MaterialState.selected)) {
              return const IconThemeData(color: Color(0xFFEF4444), size: 24);
            }
            return const IconThemeData(color: Colors.grey, size: 24);
          }),
        ),

        // Dialog theme
        dialogTheme: DialogTheme(
          backgroundColor: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFF334155), width: 1.5),
          ),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
