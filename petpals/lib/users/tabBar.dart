import 'package:flutter/material.dart';

/// Flutter code sample for [TabBar].

void main() => runApp(const TabBarApp());

class TabBarApp extends StatelessWidget {
  const TabBarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: const TabBarExample(),
    );
  }
}

class TabBarExample extends StatefulWidget {
  const TabBarExample({super.key});

  @override
  State<TabBarExample> createState() => _TabBarExampleState();
}

/// [AnimationController]s can be created with `vsync: this` because of
/// [TickerProviderStateMixin].
class _TabBarExampleState extends State<TabBarExample>
    with TickerProviderStateMixin {
  late final TabController _tabController;
  final _searchController = TextEditingController();
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TabBar Sample'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const <Widget>[
            Tab(
              text: "Missing",
            ),
            Tab(
              text: "Found",
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: <Widget>[
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [ 
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
              ],
            ),
          ),
          const Center(
            child: Text("It's rainy here"),
          ),
        ],
      ),
    );
  }
}
