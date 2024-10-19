import 'dart:async';
//import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:petpals/users/login_page.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({
    super.key,
  });

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final supabase = Supabase.instance.client;

  //initiate firestore firebase
  //final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  final _formKey = GlobalKey<FormState>();

  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  /*
  void _registerAndNavigate(BuildContext context) async {
    // Ensure that the fields are filled
    if (usernameController.text.isEmpty ||
        emailController.text.isEmpty ||
        passwordController.text.isEmpty ||
        confirmPasswordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill in all fields.'),
        ),
      );
      return;
    }

    try {
      // Pass the values from the controllers
      await registerUser(
        context,
        usernameController.text.trim(), // Use controller's text
        emailController.text.trim(),
        passwordController.text.trim(),
        confirmPasswordController.text.trim(),
      );

      // Check if the context is still valid
      if (!context.mounted) return;

      // Navigate to LoginPage if the widget is still mounted
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const LoginPage(),
        ),
      );
    } catch (e) {
      if (kDebugMode) {
        print('Error registering user: $e');
      }
      // Display error message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error registering user. Please try again.'),
        ),
      );
    }
  }
  */

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _showSuffixIconUsername = false;
  bool _showSuffixIconEmail = false;
  bool _showSuffixIconPassword = false;
  bool _showSuffixIconConfirmPassword = false;

  String? _username, _email, _password, _confirmPassword;

  // For validations
  final emailRegExp = RegExp(
    r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+",
  );

  Future<void> signUp() async {
    try {
      await supabase.auth.signUp(
          password: passwordController.text.trim(),
          email: emailController.text.trim(),
          data: {"username": usernameController.text.trim()});
      if (!mounted) return;
      Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => const LoginPage(),
          ));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Account created successfully.'),
        ),
      );
    } on AuthException catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  // Signout
  Future<void> logOut() async {
    await supabase.auth.signOut();
    if (!mounted) return;
    Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const LoginPage(),
        ));
  }

  Future<void> addUser(BuildContext context, String username, String email,
      String password, String confirmPassword) async {
    // Show loading indicator before starting the operation
    showDialog(
      context: context,
      barrierDismissible: false, // Prevent dismissing the dialog manually
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
    try {
      /*
      await _firestore.collection('users').add({
        'username': username, // Use the parameter instead of the controller
        'email': email,
        'password': password, // Store the hashed password
      });
      */
      await supabase.from('users').insert({
        'username': username,
        'email': email,
        'password': password,
      });

      // show loading circle

      // Check if the context is still valid
      if (!context.mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Account created successfully.'),
        ),
      );

      // Navigate to the login page only if the widget is still mounted
      if (!context.mounted) return;

      _navigateToLoginPage();
      if (kDebugMode) {
        print('Account created successfully.');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error creating user: $e');
      }

      // Check if the context is still valid
      if (!context.mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error creating user. Please try again.'),
        ),
      );
    }
  }

  void _navigateToLoginPage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const LoginPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          //mainAxisAlignment: MainAxisAlignment.center,
          //crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.only(
                left: 50.0,
                right: 50.0,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Image.asset('images/LOGO_clear.png',
                        width: 200, height: 200), // Set the image size
                    const Column(
                      children: [
                        Text(
                          "Register Now",
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                        SizedBox(
                          height: 10,
                        )
                      ],
                    ),
                    //------------------------------------------------------------------- textformfield start ------------------------------------------------------------------
                    TextFormField(
                      controller: usernameController,
                      onChanged: (userInput) {
                        if (userInput.isNotEmpty) {
                          setState(() {
                            _showSuffixIconUsername = true;
                          });
                        } else {
                          setState(() {
                            _showSuffixIconUsername = false;
                          });
                        }
                      },
                      decoration: InputDecoration(
                        labelText: 'Username',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        hintText: 'Enter your username',
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        hintStyle: const TextStyle(
                          color: Colors.grey, // change the color to grey
                          fontSize: 15,
                        ),
                        prefixIcon: const Icon(Icons.person),
                        suffixIcon: _showSuffixIconUsername
                            ? IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: () {
                                  usernameController
                                      .clear(); // Clear the controller
                                  setState(() {
                                    _showSuffixIconUsername = false;
                                  }); // Update the UI
                                  if (kDebugMode) {
                                    print('Username clear button pressed');
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
                    //------------------------------------------------------------------- textformfield start ------------------------------------------------------------------
                    TextFormField(
                      controller: emailController,
                      onChanged: (email) {
                        if (email.isNotEmpty) {
                          setState(() {
                            _showSuffixIconEmail = true;
                          });
                        } else {
                          setState(() {
                            _showSuffixIconEmail = false;
                          });
                        }
                      },
                      decoration: InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        hintText: 'Enter your email',
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        hintStyle: const TextStyle(
                          color: Colors.grey, // change the color to grey
                          fontSize: 15,
                        ),
                        prefixIcon: const Icon(Icons.email),
                        suffixIcon: _showSuffixIconEmail
                            ? IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: () {
                                  emailController
                                      .clear(); // Clear the controller
                                  setState(() {
                                    _showSuffixIconEmail = false;
                                  }); // Update the UI
                                  if (kDebugMode) {
                                    print('Email clear button pressed');
                                  }
                                },
                              )
                            : null,
                      ),
                      validator: (email) {
                        if (email == null || email.isEmpty) {
                          return 'Email is required.';
                        }

                        if (!emailRegExp.hasMatch(email)) {
                          return 'Please enter a valid email address';
                        }
                        return null;
                      },
                      onSaved: (email) => _email = email ?? '',
                      //maxLength: 50,
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
                          fontSize: 15,
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
                      controller: passwordController,
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
                    //------------------------------------------------------------------- textformfield start -------------------------------------------------------------------
                    TextFormField(
                      obscureText: _obscureConfirmPassword,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        labelText: 'Confirm password',
                        hintText: 'Confirm your password',
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        hintStyle: const TextStyle(
                          color: Colors.grey,
                          fontSize: 15,
                        ),
                        prefixIcon: const Icon(Icons.lock),
                        suffixIcon: _showSuffixIconConfirmPassword
                            ? GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _obscureConfirmPassword =
                                        !_obscureConfirmPassword;
                                  });
                                },
                                child: Icon(_obscureConfirmPassword
                                    ? Icons.visibility
                                    : Icons.visibility_off),
                              )
                            : null,
                      ),
                      controller: confirmPasswordController,
                      onChanged: (confirmPasswordInput) {
                        if (confirmPasswordInput.isNotEmpty) {
                          setState(() {
                            _showSuffixIconConfirmPassword = true;
                          });
                        } else {
                          setState(() {
                            _showSuffixIconConfirmPassword = false;
                          });
                        }
                      },
                      validator: (confirmPassword) {
                        if (confirmPassword!.isEmpty) {
                          return 'Confirm password is required.';
                        }
                        return null;
                      },
                      onSaved: (confirmPassword) =>
                          _confirmPassword = confirmPassword!,
                    ),
                    //------------------------------------------------------------------- textformfield end -------------------------------------------------------------------
                    const SizedBox(height: 20),
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
                                'Username: $_username, Email: $_email, Password: $_password, Confirm password: $_confirmPassword',
                              );
                            }
                            // Call this method in your widget's context
                            //_registerAndNavigate(context);
                            signUp();
                          }
                        },
                        child: const Text(
                          'Register',
                          style: TextStyle(
                              fontSize: 18.0,
                              color: Colors.white,
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 20.0,
                    ),
                    RichText(
                      text: TextSpan(
                        children: [
                          const TextSpan(
                            text: "I already have an account. ",
                            style:
                                TextStyle(fontSize: 15.0, color: Colors.black),
                          ),
                          TextSpan(
                            text: "Login",
                            style: const TextStyle(
                                fontSize: 15.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue),
                            recognizer: TapGestureRecognizer()
                              ..onTap = () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => const LoginPage()),
                                );
                              },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(
                      height: 50,
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
