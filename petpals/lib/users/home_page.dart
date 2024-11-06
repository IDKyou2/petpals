import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:petpals/users/dog_details_page.dart';
import 'package:petpals/users/login_page.dart';
import 'package:petpals/users/message_page.dart';
import 'package:petpals/users/notifications_page.dart';
import 'package:petpals/users/pet_profile_page.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HomePage extends StatefulWidget {
  const HomePage({
    super.key,
  });

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  final supabase = Supabase.instance.client;
  final session = Supabase.instance.client.auth.currentSession;

  final _searchController = TextEditingController();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this); // 2 tabs
  }

  @override
  void dispose() {
    _tabController.dispose(); // Dispose of the controller
    super.dispose();
  }

  void navigateToTab(int index) {
    _tabController.index = index; // Change the tab index
  }

  Future<void> logOut() async {
    try {
      // Sign out the user with Supabase
      await supabase.auth.signOut();

      // Ensure the widget is still mounted before navigating or showing a message
      if (!mounted) return;

      // Navigate to the Login page
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const LoginPage(),
        ),
      );

      // Show logout confirmation message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Logged out successfully.'),
        ),
      );
    } catch (error) {
      // Handle any errors during logout
      if (kDebugMode) {
        print('Logout error: $error');
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error logging out: $error'),
          ),
        );
      }
    }
  }

  // <------------------------------------------- FUNCTION FOR NAVIGATING PAGES -------------------------------------->
  void _navigateToAnotherPage(BuildContext context, Widget page,
      {VoidCallback? onReturn}) async {
    // Navigate to the new page
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );

    // Call the onReturn callback if it's not null, after returning from the page
    if (onReturn != null) {
      onReturn();
    }
  }

  @override
  Widget build(BuildContext context) {
    // Provider.of<AuthProvider>(context); // For session
    //final user = authProvider.user; // Get user details

    return Scaffold(
        key: _scaffoldKey, // Assign the key to the Scaffold
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          automaticallyImplyLeading: false, // Add this line
          leading: null, // Ensure the leading icon is set to null
          title: ClipOval(
            child: Image.asset(
              //Logo
              'images/LOGO.png',

              //fit: BoxFit.fill, // Ensures the logo fits within the title area
              fit: BoxFit.cover, // Scale the image to cover the circle
              height: 50, // Adjust the height to fit your logo
              width: 50,
              errorBuilder: (context, error, stackTrace) {
                return ClipOval(
                  child: Container(
                    color: Colors.grey, // Placeholder color
                    height: 50,
                    width: 50,
                    child: const Center(child: Icon(Icons.error)), // Error icon
                  ),
                );
              },
            ),
          ),

          actions: <Widget>[
            //Hamburger icon
            IconButton(
              color: Colors.black,
              icon: const Icon(Icons.menu),
              onPressed: () {
                _scaffoldKey.currentState?.openDrawer();
              },
            ),
          ],
          bottom: TabBar(
            labelStyle: const TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                color: Colors.black),
            //For Underline tab
            indicator: const UnderlineTabIndicator(
              borderSide: BorderSide(color: Colors.black, width: 2.0),
            ),
            controller: _tabController,
            tabs: <Widget>[
              Container(
                color: Colors.transparent,
                width: double.infinity,
                child: const Tab(
                  text: "Missing",
                ),
              ),
              Container(
                color: Colors.transparent,
                width: double.infinity,
                child: const Tab(
                  text: "Found",
                ),
              ),
            ],
          ),
        ),
        drawer: Drawer(
          child: ListView(
            children: <Widget>[
              ListTile(
                title: const Text('Home'),
                onTap: () {
                  _navigateToAnotherPage(context, const HomePage());
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
                          onPressed: () async {
                            logOut();
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
        //-------------------------------------------------------------------------- BODY --------------------------------------------------------------------------
        body: TabBarView(
          controller: _tabController,
          children: <Widget>[
            SingleChildScrollView(
              child: Column(
                children: [
                  /*
                  Text(
                    // Get user details
                    session != null
                        ? 'User logged in as: ${session?.user.email}'
                        : 'No active session found or account not logged in yet.',
                  ),
                  */

                  Padding(
                    padding: const EdgeInsets.only(top: 10.0, bottom: 15.0),
                    child: SizedBox(
                      width: 400,
                      height: 45,
                      //----------------------------------------------------------- SEARCH BAR -----------------------------------------------------------
                      child: TextFormField(
                        controller: _searchController,
                        onChanged: (search) {},
                        decoration: InputDecoration(
                          labelText: '  Search',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(
                                50), // Add this line to set the border radius
                          ),
                          hintText:
                              "Search for your pet's name, breed, and more ",
                          floatingLabelBehavior: FloatingLabelBehavior.never,
                          hintStyle: const TextStyle(
                            color: Colors.grey, // change the color to grey
                            fontSize: 14,
                          ),
                          suffixIcon: GestureDetector(
                            child: const Icon(Icons.search),
                            onTap: () {
                              _searchController.clear();
                              FocusScope.of(context)
                                  .unfocus(); // Unfocus the search bar
                            },
                          ),
                        ),
                      ),
                      //----------------------------------------------------------- SEARCH BAR END -----------------------------------------------------------
                    ),
                  ),
                  //----------------------------------------------------------- CARD 1 -----------------------------------------------------------
                  Card(
                    clipBehavior: Clip.hardEdge,
                    child: InkWell(
                      splashColor: Colors.blue.withAlpha(30),
                      onTap: () {
                        debugPrint('Card tapped.');
                        
                      },
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Container(
                              height: 120, // Adjust the height as needed
                              width: 300,
                              decoration: const BoxDecoration(
                                image: DecorationImage(
                                  image: AssetImage(
                                      'images/german_shepherd.webp'), // Replace with your image
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
                                        'Bravo',
                                        style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold),
                                      ),
                                      Text(
                                        '1h ago',
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
                                        'German Shepherd',
                                        style: TextStyle(
                                          color: Colors
                                              .black, // Set the text color
                                          fontSize:
                                              15, // Set the text font size
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
                                        'Male',
                                        style: TextStyle(
                                          color: Colors
                                              .black, // Set the text color
                                          fontSize:
                                              15, // Set the text font size
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
                                        'Cabantian',
                                        style: TextStyle(
                                            fontSize: 15,
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
                  //----------------------------------------------------------- CARD 1 END -----------------------------------------------------------
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
                                          color:
                                              Colors.blue, // Set the text color
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              14, // Set the text font size
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
                                          color:
                                              Colors.blue, // Set the text color
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              14, // Set the text font size
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
                ],
              ),
            ),
//----------------------------------------------------------------------------------------------- FOUND TAB -----------------------------------------------------------------------
            SingleChildScrollView(
              child: Column(
                children: [
                  Text(
                    // Get user details
                    session != null
                        ? 'User logged in as: ${session?.user.email}'
                        : 'No active session found or account not logged in yet.',
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
                          hintText:
                              "Search for your pet's name, breed, and more ",
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
                                        'Pet id:',
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
                                          color:
                                              Colors.blue, // Set the text color
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              14, // Set the text font size
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
                                        'Pet id:',
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
                                          color:
                                              Colors.blue, // Set the text color
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              14, // Set the text font size
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
                  // --------------------------------------------------------------- CARD START -------------------------------------------------------------------------------------
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
                                        'Pet id:',
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
                                          color:
                                              Colors.blue, // Set the text color
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              13, // Set the text font size
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
                                          fontSize:
                                              14, // Set the text font size
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
                  const SizedBox(
                    height: 20.0,
                  ),
                ],
              ),
            ),
          ],
        ),
        // ----------------------------------------------------------------------------- ADD ICON BUTTON -----------------------------------------------------------------------------
        floatingActionButton: SizedBox(
          height: 65,
          width: 65,
          child: FloatingActionButton(
            onPressed: () {
              if (kDebugMode) {
                print("Add icon is pressed.");
              }
              _navigateToAnotherPage(context, const DogDetailsPage());
            },
            foregroundColor: Colors.white,
            backgroundColor: Colors.black,
            shape: const CircleBorder(),
            child: const Icon(Icons.add),
          ),
        ),
        //---------------------------------------------------------------------- BOTTOM APPBAR -------------------------------------------------------------
        bottomNavigationBar: BottomAppBar(
          color: Colors.transparent,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              // Home Button
              Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.transparent, // Background color for the circle
                ),
                padding: const EdgeInsets.all(
                    8.0), // Padding to increase circle size
                child: IconButton(
                  icon: const FaIcon(FontAwesomeIcons.house),
                  onPressed: () {
                    _navigateToAnotherPage(
                      context,
                      const HomePage(),
                    );
                  },
                ),
              ),
              // Message Button
              Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.transparent,
                ),
                padding: const EdgeInsets.all(8.0),
                child: IconButton(
                  icon: const FaIcon(FontAwesomeIcons.message),
                  onPressed: () {
                    _navigateToAnotherPage(
                      context,
                      const MessagePage(),
                    );
                  },
                ),
              ),
              // Notifications Button
              Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.transparent
                ),
                padding: const EdgeInsets.all(8.0),
                child: IconButton(
                  icon: const FaIcon(FontAwesomeIcons.bell),
                  onPressed: () {
                    _navigateToAnotherPage(
                      context,
                      const NotificationsPage(),
                    );
                  },
                ),
              ),
            ],
          ),
        ));
  }
}
