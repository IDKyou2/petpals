import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/registration_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({
    super.key,
    required Null Function() onTap,
  });

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

  bool _isAgreed = false; // State variable for the checkbox

  void toggleCheckbox(bool? value) {
    setState(() {
      _isAgreed = value ?? false;
    });
  }

  void _navigateToAnotherPage(BuildContext context, Widget page) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );
  }

  Future<void> loginUser(
      String username, String password, BuildContext context) async {
    try {
      // Fetch user data based on username
      final user = await _firestore
          .collection('users')
          .where('username', isEqualTo: username)
          .where('password', isEqualTo: password)
          .get();

      // Check if user exists
      if (user.docs.isEmpty) {
        if (context.mounted && password.isNotEmpty && username.isNotEmpty) {
          _passwordController.clear();
          _showErrorDialog(context, 'Invalid credentials. Try again.');
        }
        return;
      }

      // Retrieve user data
      final userData = user.docs.first.data();
      final storedPassword = userData['password'];

      // Compare the provided password with the stored password
      if (password.isNotEmpty &&
          username.isNotEmpty &&
          password != storedPassword) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Incorrect username or password.'),
            ),
          );
        }
        _usernameController.clear();
        _passwordController.clear();
        return;
      }

      if (kDebugMode) {
        print('Login successful');
      }

      // Navigate to HomePage if login is successful
      if (context.mounted) {
        _navigateToAnotherPage(context, const HomePage());
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Logged in successfully.'),
            duration: Duration(seconds: 3),
          ),
        );
      }
    } catch (e) {
      // Show error dialog on exception
      if (context.mounted) {
        _showErrorDialog(context, 'Error logging in: $e');
      }
    }
  }

  void _showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        title: const Text(
          "Oops! Something went wrong",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.redAccent,
          ),
        ),
        content: Text(
          message,
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey[800],
          ),
        ),
        actions: [
          TextButton(
            style: TextButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: Colors.black,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            onPressed: () => Navigator.of(context).pop(),
            child: const Text(
              'OK',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // reload page
  void reloadPage(BuildContext context, Widget page) {
    Navigator.pop(context); // Remove the current page
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page), // Push the same page again
    );
  }

  //<------------------------------------------------------------ FOR TERMS AND CONDITIONS ------------------------------------------------------------>
  void showTermsDialog(BuildContext context) {
    bool isAgreed = false; // Local state inside the dialog

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return AlertDialog(
              title: const Text(
                'Petpals Registration Terms and Agreements',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              content: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '''By registering, you agree to the following terms and conditions. Please read them carefully.

  1. Introduction  
  Welcome to Petpals, a mobile app designed to assist in reuniting lost and found pet dogs using advanced image recognition technology. By registering, you agree to the following terms and conditions to ensure a smooth experience with our service.

  2. Acceptance of Terms  
  By creating an account, you confirm that you have read, understood, and accepted these terms. If you do not agree to any part of these terms, please refrain from using Petpals.

  3. Eligibility  
  You must be at least 13 years old to create an account. By registering, you affirm that you meet this minimum age requirement.

  4. Account Responsibilities  
  - You are responsible for keeping your login credentials confidential.  
  - Notify us immediately if you suspect unauthorized access to your account.  
  - Petpals is not liable for any losses resulting from failure to secure your account.

  5. Permitted Use  
  You agree to use Petpals only for lawful activities that align with our mission to help lost pets. Avoid any action that could damage, disable, or interfere with the app or disrupt other users' experience.

  6. Prohibited Activities  
  By using Petpals, you agree not to:  
  - Harass, threaten, or defame other users.  
  - Upload or share content that is illegal, harmful, or offensive.  
  - Impersonate any person or entity.  
  - Use the app for unauthorized commercial purposes or spam activities.

  7. Content Ownership  
  All text, images, software, and content provided on Petpals are owned by us or our licensors. You may not reproduce, distribute, or create derivative works from any content without prior permission.

  8. User-Generated Content  
  By uploading pet photos or other content, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, display, and distribute your content within the app. You confirm that you own or have permission to upload the content.

  9. Privacy Policy  
  We are committed to protecting your personal data. Please review our [Privacy Policy] to learn how we collect, use, and protect your information.

  10. Account Suspension or Termination  
  We reserve the right to suspend or terminate your account, with or without notice, if you violate these terms or engage in harmful activities.

  11. Limitation of Liability  
  To the fullest extent permitted by law, Petpals will not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform.

  12. Updates to Terms  
  We may update these terms occasionally. If we make significant changes, we will notify you. Continued use of the app after updates means you accept the revised terms.

  13. Governing Law  
  These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved under these laws without regard to conflict of law principles.

  14. Contact Information  
  If you have questions or concerns, feel free to contact us:  
  📱 0912-345-6789  
  ✉️ support@petpals.com
    ''',
                        style: TextStyle(fontSize: 16, height: 1.25),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Checkbox(
                            value: isAgreed, // Use local state
                            onChanged: (value) {
                              setState(() {
                                isAgreed = value ??
                                    false; // Update state inside dialog
                              });
                            },
                          ),
                          Expanded(
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  isAgreed =
                                      !isAgreed; // Toggle state on text tap
                                });
                              },
                              child: const Text(
                                'I agree to the Terms and Conditions',
                                style: TextStyle(color: Colors.blue),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(); // Close the dialog
                  },
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed: isAgreed
                      ? () {
                          Navigator.of(context).pop(); // Close dialog if agreed
                          // Proceed to the next step, e.g., navigate to registration
                        }
                      : null, // Disable button if not agreed
                  child: GestureDetector(
                    child: const Text('Confirm'),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => RegistrationPage(
                                onTap: () {},
                              )),
                    ),
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  //<------------------------------------------------------------ FOR TERMS AND CONDITIONS END ------------------------------------------------------------>

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
                          fontSize: 15,
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
                        onPressed: _isAgreed
                            ? () async {
                                if (_formKey.currentState!.validate()) {
                                  _formKey.currentState?.save();
                                  await loginUser(
                                      _username!, _password!, context);
                                }
                              }
                            : null, // Disable button if terms not agreed
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
                                  /*
                                  reloadPage(
                                      context,
                                      LoginPage(
                                        onTap: () {},
                                      ));
                                  */
                                  setState(() {
                                    showTermsDialog(context);
                                  });
                                },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 50.0,
                    ),
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
