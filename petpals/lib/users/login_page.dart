import 'dart:async';
import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:petpals/components/square_tile.dart';
import 'package:petpals/users/first_page.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/registration_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  //initiate firestore firebase
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  String? _username;
  String? _password;
  bool _obscurePassword = true;
  bool _showSuffixIcon = false;
  bool _showSuffixIconPassword = false;

  void _navigateToAnotherPage(BuildContext context, Widget page) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );
  }

  Future<void> _loginUser(
      String username, String password, BuildContext context) async {
    try {
      final user = await _firestore
          .collection('users')
          .where('username', isEqualTo: _username)
          .get();
      if (user.docs.isEmpty) {
        _showErrorDialog(context, 'Ooops! invalid credentials. Try again.');
        return;
      }
      final userData = user.docs.first.data();
      if (userData == null) {
        _showErrorDialog(context, 'User data is null');
        return;
      }
      final hashedPassword = userData['password'];
      final parts = hashedPassword.split(':');
      final saltBase64 = parts[1];
      final salt = base64Decode(saltBase64);
      final key = sha256
          .convert(Uint8List.fromList(utf8.encode(_password! + saltBase64)));
      if (base64Encode(key.bytes) != parts[0]) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Incorrect password'),
          ),
        );
        return;
      }
      print('Login successful');
      _navigateToAnotherPage(context, const HomePage());
    } catch (e) {
      _showErrorDialog(context, 'Error logging in: $e');
    }
  }

  void _showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.only(
                left: 50.0,
                right: 50.0,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    Image.asset('images/LOGO_clear.png',
                        width: 200, height: 200), // Set the image size
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _usernameController,
                      onChanged: (userInput) {
                        setState(() {
                          _showSuffixIcon = userInput.isNotEmpty;
                        });
                      },
                      decoration: InputDecoration(
                        labelText: 'Username',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        hintText: 'Enter your username',
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        hintStyle: const TextStyle(
                          color: Colors.grey, // hint text color
                          fontSize: 14,
                        ),
                        prefixIcon: const Icon(Icons.person),
                        suffixIcon: _showSuffixIcon
                            ? IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: () {
                                  _usernameController.clear();
                                  setState(() {
                                    _showSuffixIcon = false;
                                  });
                                  if (kDebugMode) {
                                    print('Clear button pressed');
                                  }
                                },
                              )
                            : null,
                      ),
                      validator: (username) {
                        if (username == null || username.isEmpty) {
                          return 'Username is required.';
                        }
                        return null;
                      },
                      onSaved: (username) => _username = username ?? '',
                    ),

                    //------------------------------------------------------------------- textformfield end -------------------------------------------------------------------
                    const SizedBox(height: 10),
                    //------------------------------------------------------------------- textformfield start -------------------------------------------------------------------
                    TextFormField(
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        labelText: 'Password',
                        hintText: 'Enter password',
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        hintStyle: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                        prefixIcon: const Icon(Icons.lock),
                        suffixIcon: _showSuffixIconPassword
                            ? GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  });
                                },
                                child: Icon(_obscurePassword
                                    ? Icons.visibility
                                    : Icons.visibility_off),
                              )
                            : null,
                      ),
                      controller: _passwordController,
                      onChanged: (passwordInput) {
                        if (passwordInput.isNotEmpty) {
                          setState(() {
                            _showSuffixIconPassword = true;
                          });
                        } else {
                          setState(() {
                            _showSuffixIconPassword = false;
                          });
                        }
                      },
                      validator: (password) {
                        if (password!.isEmpty) {
                          return 'Password is required.';
                        }
                        return null;
                      },
                      onSaved: (password) => _password = password!,
                    ),
                    //------------------------------------------------------------------- textformfield end -------------------------------------------------------------------
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 50,
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black),
                        onPressed: () async {
                          if (_formKey.currentState!.validate()) {
                            _formKey.currentState?.save();

                            if (kDebugMode) {
                              print(
                                  'Username: $_username, Password: $_password');
                            }
                            _usernameController.clear();
                            _passwordController.clear();
                          }
                          try {
                            await _loginUser(_username!, _password!, context);
                          } catch (e) {
                            print('Error logging in: $e');
                          }
                        },
                        child: const Text(
                          'Login',
                          style: TextStyle(
                              fontSize: 17,
                              color: Colors.white,
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 20.0),
                      child: RichText(
                        text: TextSpan(
                          children: [
                            const TextSpan(
                              text: "Don't have an account yet? ",
                              style: TextStyle(
                                  fontSize: 15.0, color: Colors.black),
                            ),
                            TextSpan(
                              text: "Signup",
                              style: const TextStyle(
                                fontSize: 16.0,
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) =>
                                            const RegistrationPage()),
                                  );
                                },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 50.0,
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: Divider(
                            thickness: 0.5,
                            color: Colors.grey[400],
                          ),
                        ),
                        Text(
                          ' Or continue with ',
                          style: TextStyle(
                            color: Colors.grey[700],
                            fontSize: 14.0,
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            thickness: 1,
                            color: Colors.grey[400],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GestureDetector(
                          child:
                              const SquareTile(imagePath: 'images/google.png'),
                          onTap: () {
                            print(
                              "Google logo tapped.",
                            );
                          },
                        ),
                        const SizedBox(
                          width: 5.0,
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
