import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:petpals/firebase_options.dart';
import 'package:petpals/users/found_page.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/login_page.dart';
import 'package:petpals/users/notifications_page.dart';
import 'package:petpals/users/registration_page.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
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
        body: HomePage(), // Add the LoginForm here
      ),
    );
  }
}
