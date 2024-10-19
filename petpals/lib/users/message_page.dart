import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:petpals/users/first_page.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/login_page.dart';
import 'package:petpals/users/notifications_page.dart';

class MessagePage extends StatefulWidget {
  const MessagePage({super.key});

  @override
  State<MessagePage> createState() => _MessagePageState();
}

class _MessagePageState extends State<MessagePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _navigateToAnotherPage(BuildContext context, Widget page) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );
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
                  _navigateToAnotherPage(
                      context,
                      const LoginPage(
                     
                      ));
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
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Messages',
                      style: TextStyle(fontSize: 18, color: Colors.white),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(0.0),
                child: Container(
                    //Background
                    width: double.infinity,
                    height: 100.0,
                    decoration: BoxDecoration(
                      color: Colors.transparent, // set the background color
                      borderRadius: BorderRadius.circular(
                          0), // add a border radius (optional)
                    ),
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  width: 2,
                                  color: Colors.black), // add a white border
                            ),
                            child: Image.asset(
                              'images/LOGO_clear.png',
                              fit: BoxFit
                                  .contain, // Ensures the logo fits within the title area
                              width: 80,
                              height: 80,
                            ),
                          ),
                        ),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 10),
                            Text("(Name of user)"),
                            SizedBox(
                              width: 300.0,
                              child: Text(
                                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                                style: TextStyle(
                                  fontSize: 10.0,
                                ),
                                overflow: TextOverflow.ellipsis, //
                              ),
                            ),
                          ],
                        ),
                      ],
                    )),
              ),
              Padding(
                padding: const EdgeInsets.all(0.0),
                child: Container(
                    //Background
                    width: double.infinity,
                    height: 100.0,
                    decoration: BoxDecoration(
                      color: Colors.transparent, // set the background color
                      borderRadius: BorderRadius.circular(
                          0), // add a border radius (optional)
                    ),
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  width: 2,
                                  color: Colors.black), // add a white border
                            ),
                            child: Image.asset(
                              'images/LOGO_clear.png',
                              fit: BoxFit
                                  .contain, // Ensures the logo fits within the title area
                              width: 80,
                              height: 80,
                            ),
                          ),
                        ),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 10),
                            Text("(Name of user)"),
                            SizedBox(
                              width: 300.0,
                              child: Text(
                                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                                style: TextStyle(
                                  fontSize: 10.0,
                                ),
                                overflow: TextOverflow.ellipsis, //
                              ),
                            ),
                          ],
                        ),
                      ],
                    )),
              ),
              Padding(
                padding: const EdgeInsets.all(0.0),
                child: Container(
                    //Background
                    width: double.infinity,
                    height: 100.0,
                    decoration: BoxDecoration(
                      color: Colors.transparent, // set the background color
                      borderRadius: BorderRadius.circular(
                          0), // add a border radius (optional)
                    ),
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  width: 2,
                                  color: Colors.black), // add a white border
                            ),
                            child: Image.asset(
                              'images/LOGO_clear.png',
                              fit: BoxFit
                                  .contain, // Ensures the logo fits within the title area
                              width: 80,
                              height: 80,
                            ),
                          ),
                        ),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 10),
                            Text("(Name of user)"),
                            SizedBox(
                              width: 300.0,
                              child: Text(
                                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                                style: TextStyle(
                                  fontSize: 10.0,
                                ),
                                overflow: TextOverflow.ellipsis, //
                              ),
                            ),
                          ],
                        ),
                      ],
                    )),
              ),
              Padding(
                padding: const EdgeInsets.all(0.0),
                child: Container(
                    //Background
                    width: double.infinity,
                    height: 100.0,
                    decoration: BoxDecoration(
                      color: Colors.transparent, // set the background color
                      borderRadius: BorderRadius.circular(
                          0), // add a border radius (optional)
                    ),
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  width: 2,
                                  color: Colors.black), // add a white border
                            ),
                            child: Image.asset(
                              'images/LOGO_clear.png',
                              fit: BoxFit
                                  .contain, // Ensures the logo fits within the title area
                              width: 80,
                              height: 80,
                            ),
                          ),
                        ),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 10),
                            Text("(Name of user)"),
                            SizedBox(
                              width: 300.0,
                              child: Text(
                                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                                style: TextStyle(
                                  fontSize: 10.0,
                                ),
                                overflow: TextOverflow.ellipsis, //
                              ),
                            ),
                          ],
                        ),
                      ],
                    )),
              ),
            ],
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
                    _navigateToAnotherPage(context, const HomePage());
                  }),
              IconButton(
                  icon: const FaIcon(FontAwesomeIcons.message),
                  onPressed: () {
                    _navigateToAnotherPage(context, const MessagePage());
                  }),
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
