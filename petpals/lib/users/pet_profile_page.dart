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
              height: 40,
              color: Colors.black,
              width: double.infinity,
            ),
            const SizedBox(
              height: 20,
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
                                8.0), // Optional padding for better sizing
                            child: Icon(
                              Icons.arrow_back_ios_new_rounded,
                              color: Colors.white, // Icon color
                              size: 35,
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
              height: 500,
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
                                'images/insert_image.png'), // Replace with your image
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      // Lower portion for the name and label
                      const Padding(
                        padding: EdgeInsets.all(10.0),
                        child: SizedBox(
                          width: 300,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Name',
                                    style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    '(time posted)',
                                    style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.grey),
                                  ),
                                ],
                              ),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Breed:',
                                    style: TextStyle(
                                        fontSize: 14, color: Colors.grey),
                                  ),
                                  Text(
                                    '(Havanese)',
                                    style: TextStyle(
                                      color: Colors.blue, // Set the text color
                                      fontSize: 13, // Set the text font size
                                      fontWeight: FontWeight
                                          .bold, // Set the text font weight
                                    ),
                                  )
                                ],
                              ),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Gender',
                                    style: TextStyle(
                                        fontSize: 14, color: Colors.grey),
                                  ),
                                  Text(
                                    '(Male)',
                                    style: TextStyle(
                                      color: Colors.blue, // Set the text color
                                      fontSize: 13, // Set the text font size
                                      fontWeight: FontWeight
                                          .bold, // Set the text font weight
                                    ),
                                  )
                                ],
                              ),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Age:',
                                    style: TextStyle(
                                        fontSize: 14, color: Colors.grey),
                                  ),
                                  Text(
                                    '(5 years):',
                                    style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.black,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Last Seen:',
                                    style: TextStyle(
                                        fontSize: 14, color: Colors.grey),
                                  ),
                                  Text(
                                    '(Location seen):',
                                    style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.red,
                                        fontWeight: FontWeight.bold),
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
              height: 20,
            ),
            SizedBox(
              width: 300,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.black, // Change text color to white
                ),
                onPressed: () {
                  debugPrint('Report as lost tapped.');
                  _navigateToAnotherPage(context, const HomePage());
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
