//import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:petpals/auth/login_or_register.dart';
//import 'package:petpals/auth/login_or_register.dart';
//import 'package:petpals/auth/login_or_register.dart';

//import 'package:petpals/firebase_options.dart';
//import 'package:petpals/users/login_page.dart';
//import 'package:petpals/users/registration_page.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
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
  runApp(const MyApp());
}



class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      title: '',
      home: Scaffold(
        body: LoginOrRegisterPage(), // Add the LoginForm here
      ),
    );
  }
}

