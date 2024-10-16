import 'package:flutter/material.dart';
import 'package:petpals/users/login_page.dart';

class ReunitedDogsPage extends StatefulWidget {
  const ReunitedDogsPage({super.key});

  @override
  State<ReunitedDogsPage> createState() => _ReunitedDogsPageState();
}

final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

class _ReunitedDogsPageState extends State<ReunitedDogsPage> {
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
                  MaterialPageRoute(
                      builder: (context) => const ReunitedDogsPage()),
                );
              },
            ),
            ListTile(
              title: const Text(
                'Logout',
                style: TextStyle(color: Colors.red),
              ),
              onTap: () {
                _navigateToAnotherPage(context, LoginPage(onTap: () {  },));
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
            const Text(
              'Manage users',
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
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
                const SizedBox(width: 10,),
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
            const SizedBox(height: 10,),
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
                const SizedBox(width: 10,),
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
            const SizedBox(height: 10,),
            //------------------------------------------------------------------------------------------------------------------------------------------------------------
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
                const SizedBox(width: 10,),
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
            const SizedBox(height: 10,),
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------------
          ],
        ),
      ),
    );
  }
}
