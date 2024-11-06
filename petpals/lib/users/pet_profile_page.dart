import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/login_page.dart';

class PetProfilePage extends StatefulWidget {
  const PetProfilePage({super.key});

  @override
  State<PetProfilePage> createState() => _PetProfilePageState();
}

class _PetProfilePageState extends State<PetProfilePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  // --------------------------------------------------------------------- FUNCTION FOR NAVIGATING PAGES ------------------------------------------------
  void _navigateToAnotherPage(BuildContext context, Widget page,
      {VoidCallback? onReturn}) async {
    if (onReturn != null) {
      onReturn(); // Call the onReturn callback if it's not null
    }
  }
  // ------------------------------------------------------------------------ END

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey, // Assign the key to the Scaffold
      appBar: AppBar(
        automaticallyImplyLeading: false, // Add this line
        leading: null, // Ensure the leading icon is set to null
        title: Image.asset(
          'images/LOGO.png',
          fit: BoxFit.fill, // Ensures the logo fits within the title area
          height: 80, // Adjust the height to fit your logo
        ),
        backgroundColor: Colors.white,
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () {
              _scaffoldKey.currentState?.openDrawer();
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          children: <Widget>[
            ListTile(
              title: const Text('Home'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const HomePage()),
                );
              },
            ),
            ListTile(
              title: const Text('Profile'),
              onTap: () {
                _navigateToAnotherPage(context, const PetProfilePage());
              },
            ),
            ListTile(
              title: const Text(
                'Logout',
                style: TextStyle(color: Colors.red),
              ),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Confirm Logout'),
                    content: const Text(
                      'Are you sure you want to log out?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const LoginPage()),
                          );
                        },
                        child: const Text(
                          'Logout',
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // <-------------------------------------------------- BLACK LINE --------------------------------------->
            Container(
              height: 20,
              color: Colors.black,
              width: double.infinity,
            ),

            // <-------------------------------------------------- BLACK LINE END --------------------------------------->
            const SizedBox(
              height: 10,
            ),
            // <-------------------------------------------------------------------- PROFILE ROW ------------------------------------------------------->
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // <-------------------------------------------------- BACK BUTTON ICON  --------------------------------------->
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(50),
                        color:
                            Colors.black87, // Background color for the button
                      ),
                      child: Material(
                        color: Colors
                            .transparent, // Optional: Keeps the background transparent
                        child: InkWell(
                          onTap: () {
                            Navigator.pop(
                                context); // This returns to the previous screen
                          },
                          borderRadius: BorderRadius.circular(
                              50), // Ripple effect adapts to borderRadius
                          child: const Padding(
                            padding: EdgeInsets.all(
                                8.0),   // Optional padding for better sizing
                            child: Icon(
                              Icons.arrow_back_ios_new_rounded,
                              color: Colors.white, // Icon color
                              size: 30,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                // <-------------------------------------------------- BACK BUTTON ICON END --------------------------------------->
                const SizedBox(
                  width: 10,
                ),
                // <--------------------------------------------------------- PROFILE PICTURE  ----------------------------------------------------------------->
                SizedBox(
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border.all(
                          color: Colors.green, width: 3), // Add a green border
                      shape: BoxShape.circle, // Make the container a circle
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(
                          50), // Set the border radius to 50
                      child: Container(
                        decoration: const BoxDecoration(
                          color:
                              Colors.green, // Set the background color to green
                          shape: BoxShape.circle, // Make the container a circle
                        ),
                        child: Image.asset(
                          'images/LOGO.png',
                          width: 60,
                          height: 60,
                        ),
                      ),
                    ),
                  ),
                ),
                // <--------------------------------------------------------- PROFILE PICTURE END ----------------------------------------------------------------->
                const SizedBox(
                  width: 5,
                ),
                const Text(
                  'Profile',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(
                  width: 50,
                ),
                IconButton(
                  icon: const FaIcon(
                    FontAwesomeIcons
                        .circlePlus, // Use the plus icon from Font Awesome
                    size: 40, // Change the size to 30
                    color: Colors.black,
                  ),
                  onPressed: () {
                    // ...
                  },
                ),
              ],
            ),
            // -------------------------------------------------------------------------- CARD --------------------------------------------------------------------------
            SizedBox(
              width: 350,
              //height: 400,
              child: Card(
                clipBehavior: Clip.hardEdge,
                child: InkWell(
                  splashColor: Colors.blue.withAlpha(30),
                  onTap: () {
                    debugPrint('Card tapped.');
                  },
                  child: Column(
                    children: [
                      const Padding(
                        padding: EdgeInsets.all(.0),
                        child: SizedBox(),
                      ),
                      // Upper portion for the picture
                      Container(
                        height: 250, // Adjust the height as needed
                        decoration: const BoxDecoration(
                          image: DecorationImage(
                            image: AssetImage(
                                'images/german_shepherd.webp'), // Replace with your image
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      // Lower portion for the name and label
                      Padding(
                        padding: const EdgeInsets.all(10.0),
                        child: SizedBox(
                          width: 300,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.lightBlue.shade700,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Name',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.grey,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Time posted',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(
                                height: 2.0,
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.lightBlue.shade700,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Breed',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.brown.shade700,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Color',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.lightBlue.shade700,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Gender',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.lightBlue.shade700,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Age',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(
                                height: 2.0,
                              ),
                              const Divider(
                                color: Colors.grey, // Color of the line
                                thickness: 2.0, // Thickness of the line
                                //indent: 10.0, // Start padding
                                //endIndent: 10.0, // End padding
                              ),
                              const Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Padding(
                                    padding: EdgeInsets.all(8.0),
                                    child: Text(
                                      'Unique markings/features:',
                                      style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(
                                height: 2.0,
                              ),
                              // divider

                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.black87,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Last seen',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(6.0),
                                    decoration: BoxDecoration(
                                      color: Colors.red.shade600,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                    child: const Text(
                                      'Deca Homes Cabantian',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 10,
            ),
            SizedBox(
              width: 300,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor:
                      Colors.blue.shade700, // Change text color to white
                ),
                onPressed: () {
                  debugPrint('Report as lost tapped.');
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const HomePage(),
                    ),
                  );
                },
                child: const Text(
                  'Report as lost',
                  style: TextStyle(
                    fontSize: 20,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
