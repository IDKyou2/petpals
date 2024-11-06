//import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/pet_profile_page.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
  // Ensures that all Flutter binding is properly initialized
  WidgetsFlutterBinding.ensureInitialized();
  /*
  await Firebase.initializeApp( 
    options: DefaultFirebaseOptions.currentPlatform,
  );
  */

  await Supabase.initialize(
    url: 'https://mqaxssyajlpwcxoiness.supabase.co',
    anonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYXhzc3lhamxwd2N4b2luZXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMTM5MDAsImV4cCI6MjA0NDg4OTkwMH0.7TJQog51wcwjrpAbOatLqg386btUIqFXOuPYDciIcy4',
  );
  runApp(
    const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Petpals',
      theme: lightTheme, // Set the light theme here
      darkTheme: darkTheme, // Set the dark theme here
      themeMode:
          ThemeMode.system, // Switch based on system settings (light/dark mode)
      home: const Scaffold(
        body: HomePage(), // Add the LoginForm here
      ),
    );
  }
}



















// Define light and dark themes here
final ThemeData lightTheme = ThemeData(
  brightness: Brightness.light,
  primaryColor: Colors.blue,
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white, // AppBar text color
  ),
  textTheme: const TextTheme(
    bodyLarge: TextStyle(
      color: Colors.black,
    ),
  ),
  scaffoldBackgroundColor: Colors.white,
);

final ThemeData darkTheme = ThemeData(
  brightness: Brightness.dark,
  primaryColor: Colors.blueGrey,
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.black,
    foregroundColor: Colors.white, // AppBar text color
  ),
  textTheme: const TextTheme(
    bodyLarge: TextStyle(color: Colors.white),
  ),
  scaffoldBackgroundColor: Colors.black,
);
