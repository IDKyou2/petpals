import 'package:flutter/material.dart';
import 'package:petpals/users/first_page.dart';

class Features extends StatelessWidget {
  const Features({super.key});

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
            // <------------------------------------------- BACK ARROW BUTTON ------------------------------------------->
            ElevatedButton(
                onPressed: () {
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
          ],
        ),
      ),
    );
  }
}
