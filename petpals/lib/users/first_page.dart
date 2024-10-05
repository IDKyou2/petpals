import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:petpals/users/dog_details_page.dart';
import 'package:petpals/users/found_page.dart';

class FirstPage extends StatefulWidget {
  const FirstPage({super.key});

  @override
  State<FirstPage> createState() => _FirstPageState();
}

class _FirstPageState extends State<FirstPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: [
            Padding(
              padding:
                  const EdgeInsets.only(left: 80.0, right: 80.0, top: 50.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Image.asset('images/LOGO_clear.png',
                      width: 200, height: 200), // Set the image size
                  const SizedBox(height: 20),
                  Text(
                    'Get Started',
                    style: TextStyle(
                      fontFamily: GoogleFonts.poppins().fontFamily,
                      fontWeight: FontWeight
                          .w700, // or any other weight provided by the font service
                      fontSize: 20,
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                      style: ButtonStyle(
                        backgroundColor: WidgetStateProperty.all(Colors.black),
                        foregroundColor: WidgetStateProperty.all(Colors.white),
                        minimumSize: WidgetStateProperty.all(
                            const Size(300, 70)), // adjust width and height
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const DogDetailsPage()),
                        );
                        if (kDebugMode) {
                          print('I lost a dog button is pressed.');
                        }
                      },
                      child: Text(
                        'I lost a dog',
                        style: TextStyle(
                          fontFamily: GoogleFonts.poppins().fontFamily,
                          fontWeight: FontWeight
                              .w700, // or any other weight provided by the font service
                          fontSize: 20,
                        ),
                      )),
                  const SizedBox(height: 10),
                  ElevatedButton(
                      style: ButtonStyle(
                        backgroundColor: WidgetStateProperty.all(Colors.grey),
                        foregroundColor: WidgetStateProperty.all(Colors.white),
                        minimumSize: WidgetStateProperty.all(
                            const Size(300, 70)), // adjust width and height
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const FoundPage()),
                        );
                        if (kDebugMode) {
                          print('I found a dog button is pressed.');
                        }
                      },
                      child: Text(
                        'I found a dog',
                        style: TextStyle(
                          fontFamily: GoogleFonts.poppins().fontFamily,
                          fontWeight: FontWeight
                              .w700, // or any other weight provided by the font service
                          fontSize: 20,
                        ),
                      ))
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
