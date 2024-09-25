import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:petpals/users/first_page.dart';
import 'package:petpals/users/found_page.dart';
import 'package:petpals/users/login_page.dart';
import 'package:petpals/users/message_page.dart';
import 'package:petpals/users/notifications_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _searchController = TextEditingController();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _navigateToAnotherPage(BuildContext context, Widget page,
      {VoidCallback? onReturn}) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );
    if (onReturn != null) {
      onReturn(); // Call the onReturn callback if it's not null
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
            'images/LOGO_clear.png',
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
                    MaterialPageRoute(builder: (context) => const FirstPage()),
                  );
                },
              ),
              ListTile(
                title: const Text('Profile'),
                onTap: () {
                  // Handle tap on item 2
                },
              ),
              ListTile(
                title: const Text(
                  'Logout',
                  style: TextStyle(color: Colors.red),
                ),
                onTap: () {
                  _navigateToAnotherPage(context, const LoginPage());
                },
              ),
            ],
          ),
        ),
        //-------------------------------------------------------------------------- BODY --------------------------------------------------------------------------
        body: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                height: 40,
                color: Colors.black,
                width: double.infinity,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Stack(
                      children: [
                        const Text(
                          ' Missing',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: Colors.white,
                          ),
                        ),
                        Positioned(
                          bottom:
                              1, // Adjust this value to add space between the text and the underline
                          left: 0,
                          right: 0,
                          child: Container(
                            height:
                                3, // Adjust this value to set the thickness of the underline
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: () {
                        _navigateToAnotherPage(context, const FoundPage());
                      },
                      child: const Text(
                        'Found',
                        style: TextStyle(fontSize: 18, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),

              Padding(
                padding: const EdgeInsets.only(top: 10.0, bottom: 15.0),
                child: SizedBox(
                  width: 400,
                  height: 45, 
                  child: TextFormField(
                    controller: _searchController,
                    onChanged: (search) {},
                    decoration: InputDecoration(
                      labelText: '  Search',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                            50), // Add this line to set the border radius
                      ),
                      hintText: "Search for your pet's name, breed, and more ",
                      floatingLabelBehavior: FloatingLabelBehavior.never,
                      hintStyle: const TextStyle(
                        color: Colors.grey, // change the color to grey
                        fontSize: 14,
                      ),
                      suffixIcon: const Icon(Icons.search),
                    ),
                  ),
                ),
              ),
              Card(
                clipBehavior: Clip.hardEdge,
                child: InkWell(
                  splashColor: Colors.blue.withAlpha(30),
                  onTap: () {
                    debugPrint('Card tapped.');
                  },
                  child: Column(
                    children: [
                      const Padding(
                          padding: EdgeInsets.all(8.0), child: SizedBox()),
                      // Upper portion for the picture
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Container(
                          height: 120, // Adjust the height as needed
                          width: 300,
                          decoration: const BoxDecoration(
                            image: DecorationImage(
                              image: AssetImage(
                                  'images/insert_image.png'), // Replace with your image
                              fit: BoxFit.cover,
                            ),
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
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  Text(
                                    'More',
                                    style: TextStyle(
                                      fontSize: 14, // Set the text font size
                                      fontWeight: FontWeight
                                          .bold, // Set the text font weight
                                    ),
                                  ),
                                ],
                              )
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Card(
                clipBehavior: Clip.hardEdge,
                child: InkWell(
                  splashColor: Colors.blue.withAlpha(30),
                  onTap: () {
                    debugPrint('Card tapped.');
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(top: 10.0),
                    child: Column(
                      children: [
                        // Upper portion for the picture
                        Container(
                          height: 120, // Adjust the height as needed
                          width: 300,
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
                                          fontSize: 18,
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
                                        color:
                                            Colors.blue, // Set the text color
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
                                        color:
                                            Colors.blue, // Set the text color
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
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Text(
                                      'More',
                                      style: TextStyle(
                                        fontSize: 14, // Set the text font size
                                        fontWeight: FontWeight
                                            .bold, // Set the text font weight
                                      ),
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              // --------------------------------------------------------------- CARD START -------------------------------------------------------------------------------------
              Card(
                clipBehavior: Clip.hardEdge,
                child: InkWell(
                  splashColor: Colors.blue.withAlpha(30),
                  onTap: () {
                    debugPrint('Card tapped.');
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(top: 10.0),
                    child: Column(
                      children: [
                        // Upper portion for the picture
                        Container(
                          height: 120, // Adjust the height as needed
                          width: 300,
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
                                          fontSize: 18,
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
                                        color:
                                            Colors.blue, // Set the text color
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
                                        color:
                                            Colors.blue, // Set the text color
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
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Text(
                                      'More',
                                      style: TextStyle(
                                        fontSize: 14, // Set the text font size
                                        fontWeight: FontWeight
                                            .bold, // Set the text font weight
                                      ),
                                    ),
                                  ],
                                )
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
                height: 20.0,
              ),
            ],
          ),
        ),
        floatingActionButton: SizedBox(
          height: 65,
          width: 65,
          child: FloatingActionButton(
            onPressed: () {
              print("Add icon is pressed.");
            },
            foregroundColor: Colors.white,
            backgroundColor: Colors.black,
            shape: const CircleBorder(),
            child: const Icon(Icons.add),
          ),
        ),
        //---------------------------------------------------------------------- BOTTOM APPBAR -------------------------------------------------------------
        bottomNavigationBar: BottomAppBar(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: const FaIcon(FontAwesomeIcons.house),
                onPressed: () {
                  _navigateToAnotherPage(
                    context,
                    const HomePage(),
                    /*
                    onReturn: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('You returned from HomePage')),
                      );
                    },
                    */
                  );
                },
              ),
              IconButton(
                icon: const FaIcon(FontAwesomeIcons.message),
                onPressed: () {
                  _navigateToAnotherPage(
                    context,
                    const MessagePage(),
                    /*
                    onReturn: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('You returned from MessagePage')),
                      );
                    },
                    */
                  );
                },
              ),
              IconButton(
                  icon: const FaIcon(FontAwesomeIcons.bell),
                  onPressed: () {
                    _navigateToAnotherPage(context, const NotificationsPage());
                  }),
            ],
          ),
        ));
  }
}
