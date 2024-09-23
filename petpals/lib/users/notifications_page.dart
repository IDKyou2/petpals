import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:petpals/users/first_page.dart';
import 'package:petpals/users/home_page.dart';
import 'package:petpals/users/login_page.dart';
import 'package:petpals/users/message_page.dart';
import 'package:petpals/users/notifications_page.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final bool _pageLoaded = false;

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
                  _navigateToAnotherPage(context, const LoginPage());
                },
              ),
            ],
          ),
        ),
        //-------------------------------------------------------------------------- BODY --------------------------------------------------------------------------
        body: DecoratedBox(
          decoration: const BoxDecoration(color: Colors.grey),
          child: SingleChildScrollView(
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
                        'Notifications',
                        style: TextStyle(fontSize: 18, color: Colors.white),
                      ),
                    ],
                  ),
                ),
              ],
            ),
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
