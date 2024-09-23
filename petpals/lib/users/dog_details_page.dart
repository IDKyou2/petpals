// ignore_for_file: avoid_print
// Import for kIsWeb
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:petpals/users/first_page.dart';
import 'package:petpals/users/home_page.dart';

class DogDetailsPage extends StatefulWidget {
  const DogDetailsPage({super.key});

  @override
  State<DogDetailsPage> createState() => _DogDetailsPageState();
}

enum Gender {
  male,
  female,
}

class _DogDetailsPageState extends State<DogDetailsPage> {
  final _formKey = GlobalKey<FormState>();
  final _dogNameController = TextEditingController();
  final _dogAgeController = TextEditingController();
  final _dogBreedController = TextEditingController();
  final _dogColorController = TextEditingController();
  final _dogSizeController = TextEditingController();
  final _dogUniqueMarkingsController = TextEditingController();

  String? _dogName, _dogAge, _dogBreed, _dogColor, _dogSize, _dogUniqueMarkings;
  Gender? _gender;

  File? _image;
  final picker = ImagePicker();

  Future getImageGallery() async {
    final pickedFile = await picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );
    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
        //widget.imgUrl = null;
      } else {
        print('No image picked.');
      }
    });
  }

  void _navigateToHomePage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const HomePage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(10.0),
        child: ListView(
          scrollDirection: Axis.vertical,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(left: 0.0),
              child: Row(
                children: [
                  const SizedBox(
                    width: 10,
                  ),
                  ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const FirstPage()),
                        );
                      },
                      child: const Icon(Icons.arrow_back)),
                  const SizedBox(
                    width: 10,
                  ),
                  Text(
                    'Dog Details',
                    style: TextStyle(
                      fontFamily: GoogleFonts.poppins().fontFamily,
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(
              height: 20.0,
            ),
            //-------------------------------------------------------------------------- IMAGE CONTAINER ----------------------------------------------------------------------------
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0, top: 10.0),
              child: Container(
                height: 200,
                width: 300,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.black,
                    width: 2,
                  ),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: _image != null
                    ? Image.file(
                        _image!.absolute,
                        fit: BoxFit.cover,
                      )
                    : const SizedBox.shrink(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Align(
                alignment: Alignment.centerRight,
                child: SizedBox(
                  height: 40,
                  child: ElevatedButton(
                    onPressed: getImageGallery,
                    child: const Text('Upload photo'),
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 8.0,
                right: 8.0,
              ),
              child: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Name',
                  border: const OutlineInputBorder(),
                  hintText: "Enter the name of your pet",
                  suffixIcon: _dogNameController.text.isEmpty
                      ? null
                      : IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {
                            print('Clear button pressed');
                            _dogNameController.clear(); // Clear the controller
                            setState(() {}); // Update the UI
                          },
                        ),
                ),
                controller:
                    _dogNameController, // Don't forget to assign the controller
                onChanged: (text) {
                  setState(() {}); // Update the UI when the text changes
                },
                validator: (dogName) {
                  if (dogName == null || dogName.isEmpty) {
                    return "Dog's name field is empty";
                  }
                  return null;
                },
                onSaved: (dogName) => dogName = dogName ?? '',
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0, top: 8.0),
              child: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Age',
                  border: const OutlineInputBorder(),
                  hintText: "Enter your dog's age",
                  suffixIcon: _dogAgeController.text.isEmpty
                      ? null
                      : IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {
                            print('Clear button pressed');
                            _dogAgeController.clear();
                            setState(() {});
                          },
                        ),
                ),
                controller: _dogAgeController,
                onChanged: (text) {
                  setState(() {}); // Update the UI when the text changes
                },
                validator: (dogAge) {
                  if (dogAge == null || dogAge.isEmpty) {
                    return "Dog's age field is empty";
                  }
                  return null;
                },
                onSaved: (dogAge) => dogAge = dogAge ?? '',
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0, top: 8.0),
              child: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Breed',
                  border: const OutlineInputBorder(),
                  hintText: "Enter your dog's breed",
                  suffixIcon: _dogBreedController.text.isEmpty
                      ? null
                      : IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {
                            print('Clear button pressed');
                            _dogBreedController.clear();
                            setState(() {});
                          },
                        ),
                ),
                controller: _dogBreedController,
                onChanged: (text) {
                  setState(() {}); // Update the UI when the text changes
                },
                validator: (dogBreed) {
                  if (dogBreed == null || dogBreed.isEmpty) {
                    return "Dog's breed field is empty";
                  }
                  return null;
                },
                onSaved: (dogBreed) => dogBreed = dogBreed ?? '',
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0, top: 8.0),
              child: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Color',
                  border: const OutlineInputBorder(),
                  hintText: "Enter your dog's color",
                  suffixIcon: _dogColorController.text.isEmpty
                      ? null
                      : IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {
                            print('Clear button pressed');
                            _dogColorController.clear();
                            setState(() {});
                          },
                        ),
                ),
                controller: _dogColorController,
                onChanged: (text) {
                  setState(() {}); // Update the UI when the text changes
                },
                validator: (dogColor) {
                  if (dogColor == null || dogColor.isEmpty) {
                    return "Dog's color field is empty";
                  }
                  return null;
                },
                onSaved: (dogColor) => dogColor = dogColor ?? '',
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0, top: 8.0),
              child: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Size (Small, Medium, Large)',
                  border: const OutlineInputBorder(),
                  hintText: "Enter your dog's size",
                  suffixIcon: _dogSizeController.text.isEmpty
                      ? null
                      : IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {
                            print('Clear button pressed');
                            _dogSizeController.clear();
                            setState(() {});
                          },
                        ),
                ),
                onChanged: (text) {
                  setState(() {}); // Update the UI when the text changes
                },
                controller: _dogSizeController,
                validator: (dogSize) {
                  if (dogSize == null || dogSize.isEmpty) {
                    return "Dog's size field is empty";
                  }
                  return null;
                },
                onSaved: (dogSize) => dogSize = dogSize ?? '',
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0, top: 8.0),
              child: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Unique Markings/Features',
                  border: const OutlineInputBorder(),
                  hintText: "Enter your dog's unique markings/features",
                  suffixIcon: _dogUniqueMarkingsController.text.isEmpty
                      ? null
                      : IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () {
                            print('Clear button pressed');
                            _dogUniqueMarkingsController.clear();
                            setState(() {});
                          },
                        ),
                ),
                onChanged: (text) {
                  setState(() {}); // Update the UI when the text changes
                },
                controller: _dogUniqueMarkingsController,
                validator: (dogUniqueMarkings) {
                  if (dogUniqueMarkings == null || dogUniqueMarkings.isEmpty) {
                    return "Dog's unique markings field is empty";
                  }
                  return null;
                },
                onSaved: (dogUniqueMarkings) =>
                    dogUniqueMarkings = dogUniqueMarkings ?? '',
              ),
            ),
            const SizedBox(
              height: 5.0,
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 8.0,
                right: 8.0,
              ),
              child: Row(
                children: [
                  Expanded(
                    flex: 1,
                    child: Card(
                      child: RadioListTile(
                        title: const Row(
                          children: [
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              child:
                                  Text('Male', style: TextStyle(fontSize: 14)),
                            ),
                            Icon(
                              Icons.male,
                              color: Colors.blue,
                            ),
                          ],
                        ),
                        controlAffinity: ListTileControlAffinity.leading,
                        value: Gender.male,
                        groupValue: _gender,
                        onChanged: (value) {
                          setState(() {
                            _gender = value!;
                          });
                        },
                      ),
                    ),
                  ),
                  const SizedBox(width: 2),
                  Expanded(
                    flex: 1,
                    child: Card(
                      child: SizedBox(
                        child: RadioListTile(
                          title: const Row(
                            children: [
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  children: [
                                    Text('Female',
                                        style: TextStyle(fontSize: 14)),
                                    Icon(
                                      Icons.female,
                                      color: Colors.pink,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          controlAffinity: ListTileControlAffinity.leading,
                          value: Gender.female,
                          groupValue: _gender,
                          onChanged: (value) {
                            setState(() {
                              _gender = value!;
                            });
                          },
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(
              height: 18.0,
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 8.0,
                right: 8.0,
              ),
              child: ElevatedButton(
                  style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(Colors.black),
                    foregroundColor: WidgetStateProperty.all(Colors.white),
                    fixedSize: WidgetStateProperty.resolveWith((states) {
                      return Size(
                          states.contains(WidgetState.hovered) ? 120.0 : 100.0,
                          50.0);
                    }),
                    shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                      RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(
                            20.0), // Change this value to modify the border radius
                      ),
                    ),
                  ),
                  onPressed: () {
                    print('Submit button is pressed.');
                    _navigateToHomePage();
                  },
                  child: Text(
                    'S U B M I T',
                    style: TextStyle(
                      fontFamily: GoogleFonts.poppins().fontFamily,
                      fontWeight: FontWeight
                          .w700, // or any other weight provided by the font service
                      fontSize: 20,
                    ),
                  )),
            ),
            const SizedBox(
              height: 20,
            ),
            Align(
              alignment: Alignment.centerLeft,
              child: Container(
                width: 100,
                height: 100,
                color: Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
