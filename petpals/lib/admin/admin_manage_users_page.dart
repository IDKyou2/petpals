import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:petpals/users/login_page.dart';

class AdminManageUsersPage extends StatefulWidget {
  const AdminManageUsersPage({super.key});

  @override
  State<AdminManageUsersPage> createState() => _AdminManageUsersPageState();
}

final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

class _AdminManageUsersPageState extends State<AdminManageUsersPage> {
  void logout(BuildContext context) async {
    // Perform your async operation (e.g., logout process)
    await Future.delayed(
        const Duration(seconds: 2)); // Simulating an async task

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You have logged out successfully.'),
          duration: Duration(seconds: 3),
        ),
      );
    }
  }

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
                if (kDebugMode) {
                  print("Homepage tapped.");
                }
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
                        onPressed: () async {
                          // Navigate to the LoginPage asynchronously
                          await Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LoginPage(),
                            ),
                          );

                          // After navigation, check if the widget is still mounted before calling logout
                          if (context.mounted) {
                            logout(context);
                          }
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
      body: Padding(
        padding: const EdgeInsets.only(left: 20.0, right: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // <---------------------------------------------------- CIRCLE BACK BUTTON --------------------------------------------------->
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.black87, // Background color for the button
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
                        ),
                      ),
                    ),
                  ),
                ),
                // <---------------------------------------------------- CIRCLE BACK BUTTON END --------------------------------------------------->
                /*
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: TextButton(
                    onPressed: () {
                      // handle button press
                    },
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor:
                          Colors.black, // make the button transparent
                    ),
                    child: const Icon(Icons.arrow_back_ios_new_rounded),
                  ),
                ),
                */
                const SizedBox(
                  width: 10,
                ),
                const Text(
                  'Manage users',
                  style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(
              height: 10,
            ),
            // ------------------------------------------------------------------------ 1st Row ---------------------------------------------------------------
            Row(
              children: [
                SizedBox(
                  width: 270,
                  child: Card(
                    clipBehavior: Clip.hardEdge,
                    child: InkWell(
                      splashColor: Colors.black.withAlpha(30),
                      onTap: () {
                        debugPrint('Card tapped.');
                      },
                      child: const Column(
                        children: [
                          Padding(
                            padding: EdgeInsets.only(
                                left: 10.0, right: 10.0, top: 5, bottom: 5),
                            child: SizedBox(
                              width: 400,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: EdgeInsets.only(
                                        left: 10.0, right: 10.0),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        SizedBox(
                                          width: 50,
                                          child: CircleAvatar(
                                            backgroundColor: Colors
                                                .transparent, // Set the background color
                                            child: Icon(
                                              Icons
                                                  .person, // Use the person icon
                                              size: 40, // Set the icon size
                                              color: Colors
                                                  .black87, // Set the icon color
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.only(left: 10.0),
                                        child: Text(
                                          'User 1',
                                          style: TextStyle(
                                              fontSize: 20,
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
                  width: 10,
                ),
                Column(
                  children: [
                    Container(
                      width: 80,
                      height: 38,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // handle button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor:
                              Colors.black, // make the button transparent
                        ),
                        child: const Text('View'),
                      ),
                    ),
                    const SizedBox(
                      height: 3,
                    ),
                    Container(
                      width: 80,
                      height: 38,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // handle button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.black,
                          side: const BorderSide(
                              color: Colors.black,
                              width: 1), // add a red outline
                        ),
                        child: const Text('Block'),
                      ),
                    ),
                  ],
                )
              ],
            ),
            const SizedBox(
              height: 10,
            ),
            // ------------------------------------------------------------------------ 2nd Row ---------------------------------------------------------------
            Row(
              children: [
                SizedBox(
                  width: 270,
                  child: Card(
                    clipBehavior: Clip.hardEdge,
                    child: InkWell(
                      splashColor: Colors.black.withAlpha(30),
                      onTap: () {
                        debugPrint('Card tapped.');
                      },
                      child: const Column(
                        children: [
                          Padding(
                            padding: EdgeInsets.only(
                                left: 10.0, right: 10.0, top: 5, bottom: 5),
                            child: SizedBox(
                              width: 400,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: EdgeInsets.only(
                                        left: 10.0, right: 10.0),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        SizedBox(
                                          width: 50,
                                          child: CircleAvatar(
                                            backgroundColor: Colors
                                                .transparent, // Set the background color
                                            child: Icon(
                                              Icons
                                                  .person, // Use the person icon
                                              size: 40, // Set the icon size
                                              color: Colors
                                                  .black87, // Set the icon color
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.only(left: 10.0),
                                        child: Text(
                                          'User 2',
                                          style: TextStyle(
                                              fontSize: 20,
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
                  width: 10,
                ),
                Column(
                  children: [
                    Container(
                      width: 80,
                      height: 38,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // handle button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor:
                              Colors.black, // make the button transparent
                        ),
                        child: const Text('View'),
                      ),
                    ),
                    const SizedBox(
                      height: 3,
                    ),
                    Container(
                      width: 80,
                      height: 38,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // handle button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.black,
                          side: const BorderSide(
                              color: Colors.black,
                              width: 1), // add a red outline
                        ),
                        child: const Text('Block'),
                      ),
                    ),
                  ],
                )
              ],
            ),
            const SizedBox(
              height: 10,
            ),
            //---------------------------------------------------------------------------- 3rd Row ----------------------------------------------------------------------------
            Row(
              children: [
                SizedBox(
                  width: 270,
                  child: Card(
                    clipBehavior: Clip.hardEdge,
                    child: InkWell(
                      splashColor: Colors.black.withAlpha(30),
                      onTap: () {
                        debugPrint('Card tapped.');
                      },
                      child: const Column(
                        children: [
                          Padding(
                            padding: EdgeInsets.only(
                                left: 10.0, right: 10.0, top: 5, bottom: 5),
                            child: SizedBox(
                              width: 400,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: EdgeInsets.only(
                                        left: 10.0, right: 10.0),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        SizedBox(
                                          width: 50,
                                          child: CircleAvatar(
                                            backgroundColor: Colors
                                                .transparent, // Set the background color
                                            child: Icon(
                                              Icons
                                                  .person, // Use the person icon
                                              size: 40, // Set the icon size
                                              color: Colors
                                                  .black87, // Set the icon color
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.only(left: 10.0),
                                        child: Text(
                                          'User 3',
                                          style: TextStyle(
                                              fontSize: 20,
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
                  width: 10,
                ),
                Column(
                  children: [
                    Container(
                      width: 80,
                      height: 38,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // handle button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor:
                              Colors.black, // make the button transparent
                        ),
                        child: const Text('View'),
                      ),
                    ),
                    const SizedBox(
                      height: 3,
                    ),
                    Container(
                      width: 80,
                      height: 38,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // handle button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.black,
                          side: const BorderSide(
                              color: Colors.black,
                              width: 1), // add a red outline
                        ),
                        child: const Text('Block'),
                      ),
                    ),
                  ],
                )
              ],
            ),
            const SizedBox(
              height: 10,
            ),
            // ----------------------------------------------------------
            /*
            Row(
              children: [
                SizedBox(
                  width: 270,
                  child: Card(
                    clipBehavior: Clip.hardEdge,
                    child: InkWell(
                      splashColor: Colors.black.withAlpha(30),
                      onTap: () {
                        debugPrint('Card tapped.');
                      },
                      child: const Column(
                        children: [
                          Padding(
                            padding: EdgeInsets.only(
                                left: 10.0, right: 10.0, top: 5, bottom: 5),
                            child: SizedBox(
                              width: 400,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: EdgeInsets.only(
                                        left: 10.0, right: 10.0),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        SizedBox(
                                          width: 50,
                                          child: CircleAvatar(
                                            backgroundColor: Colors
                                                .transparent, // Set the background color
                                            child: Icon(
                                              Icons
                                                  .person, // Use the person icon
                                              size: 40, // Set the icon size
                                              color: Colors
                                                  .black87, // Set the icon color
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.only(left: 10.0),
                                        child: Text(
                                          'User 3',
                                          style: TextStyle(
                                              fontSize: 20,
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
                  width: 10,
                ),
                Column(
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        // handle button press
                      },
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: Colors.black, // text color
                        elevation: 2, // elevation effect
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(10), // rounded corners
                        ),
                      ),
                      child: const Text('View'),
                    ),
                    Container(
                      width: 80,
                      height: 38,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.black, width: 1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // handle button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.black,
                          backgroundColor:
                              Colors.transparent, // make the button transparent
                        ),
                        child: const Text('Block'),
                      ),
                    )
                  ],
                )
              ],
            ),
           
            */
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------------
          ],
        ),
      ),
    );
  }
}
