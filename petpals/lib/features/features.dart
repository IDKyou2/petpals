// ignore_for_file: unused_element

import 'package:flutter/material.dart';
import 'package:petpals/users/first_page.dart';

class Features extends StatelessWidget {
  const Features({super.key});

  /*
 void _navigateToAnotherPage(BuildContext context, Widget page) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );
  }
  */

  // reload page
  void reloadPage(BuildContext context, Widget page) {
    Navigator.pop(context); // Remove the current page
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page), // Push the same page again
    );
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // <------------------------- PERFECT SQUARE ------------------------>
            Align(
              alignment: Alignment.centerLeft,
              child: Container(
                width: 100,
                height: 100,
                color: Colors.red,
              ),
            ),
            // <------------------------- PERFECT SQUARE END ------------------------>

            // <-----------------------   BACK ARROW BUTTON ------------------------------------------->
            ElevatedButton(
                onPressed: () {
                  // Move another page
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const FirstPage()),
                  );
                },
                child: const Icon(Icons.arrow_back)),
            // <------------------------------------------- BACK ARROW BUTTON END ------------------------------------------->

            // <------------------------------------------- CUSTOMIZED BACK ARROW BUTTON ------------------------------------------->
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black87, // Set the background color
                foregroundColor:
                    Colors.white, // Set the foreground (text/icon) color
              ),
              child: const Icon(
                Icons.arrow_back,
              ),
            ),
            // <------------------------------------------- CUSTOMIZED BACK ARROW BUTTON END ------------------------------------------->
            // Line divider
            const Divider(
              color: Colors.grey, // Color of the line
              thickness: 2.0, // Thickness of the line
              indent: 20.0, // Start padding
              endIndent: 20.0, // End padding
            ),
          ],
        ),
      ),
    );
  }
}
