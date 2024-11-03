import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/registration_page.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({
    super.key,
    //required Null Function() onTap,
  });

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final supabase = Supabase.instance.client;
  //initiate firestore firebase
  //final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  final _formKey = GlobalKey<FormState>();
  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  final FocusNode emailFocusNode = FocusNode();
  final FocusNode passwordFocusNode = FocusNode();

  bool _obscurePassword = true;
  bool _showSuffixIcon = false;
  bool _showSuffixIconPassword = false;

  @override
  void dispose() {
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        title: const Text(
          "Oops! there's an error",
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

  void toggleCheckbox(bool? value) {
    setState(() {});
  }

  bool isValidEmail(String email) {
    // Regular expression for validating an email address
    String emailPattern = r'^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]+';
    RegExp regExp = RegExp(emailPattern);

    return regExp.hasMatch(email);
  }

  Future<void> loginUser() async {
    try {
      await supabase.auth.signInWithPassword(
        password: passwordController.text.trim(),
        email: emailController.text.trim(),
      );
      if (!mounted) return;
      Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => const HomePage(),
          ));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Logged in successfully.'),
        ),
      );
    } on AuthException catch (e) {
      // Handle the invalid credentials case
      if (e.message.toLowerCase().contains('invalid login credentials')) {
        showErrorDialog(context, "Invalid email or password.");
        /*
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('You have entered invalid email or password.')),
        );
        */
      } else {
        // Handle other possible exceptions
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message)),
        );
      }
      if (kDebugMode) {
        print(e);
      }
    }
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
                    setState(() {
                      emailController.clear();
                      passwordController.clear();
                    });
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
                      onTap: () {
                        if (isAgreed != false) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const RegistrationPage()),
                          );
                        }
                      }),
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
                    const Column(
                      children: [
                        Text(
                          "Login here",
                          style: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                        SizedBox(
                          height: 10,
                        )
                      ],
                    ),
                    // Email textformfield
                    TextFormField(
                      autofocus: true,
                      focusNode: emailFocusNode,
                      controller: emailController,
                      onChanged: (emailInput) {
                        setState(() {
                          _showSuffixIcon = emailInput.isNotEmpty;
                        });
                      },
                      decoration: InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        hintText: 'Enter your email',
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        hintStyle: const TextStyle(
                          color: Colors.grey, // hint text color
                          fontSize: 15,
                        ),
                        prefixIcon: const Icon(Icons.email),
                        suffixIcon: _showSuffixIcon
                            ? IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: () {
                                  emailController.clear();
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
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Email is required';
                        } else if (!isValidEmail(value)) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                      onSaved: (email) => email = email ?? '',
                    ),

                    const SizedBox(height: 10),
                    //------------------------------------------------------------------- password textformfield -------------------------------------------------------------------
                    TextFormField(
                      focusNode: passwordFocusNode,
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
                      onSaved: (password) => password = password!,
                    ),

                    const SizedBox(height: 10),
                    SizedBox(
                      height: 50,
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black),
                        // ------- login button ------
                        onPressed: () {
                          // Validate the form
                          if (_formKey.currentState!.validate()) {
                            // If the form is valid, save the inputs and proceed with login
                            _formKey.currentState?.save();

                            if (kDebugMode) {
                              print("Email: ${emailController.text}");
                              print("Password: ${passwordController.text}");
                            }
                            loginUser();
                          } else {
                            // If the form is invalid, unfocus the current field and focus the first invalid field
                            FocusScope.of(context).unfocus();

                            if (emailController.text.isEmpty ||
                                !isValidEmail(emailController.text)) {
                              emailFocusNode
                                  .requestFocus(); // Focus on the email field
                            } else if (passwordController.text.isEmpty) {
                              passwordFocusNode
                                  .requestFocus(); // Focus on the password field
                            }
                          }
                        },

                        child: const Text(
                          'Login',
                          style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: Colors.white),
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
