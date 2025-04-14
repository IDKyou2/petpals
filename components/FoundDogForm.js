import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";

const FoundDogForm = ({
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToViewFoundDogFormAfter,
  onLogout,
  onNavigateToChatForum,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dogBreed, setDogBreed] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState("");
  const [genderError, setGenderError] = useState("");
  const newChatsCount = useChatCount();

  const locationiqKey = "pk.0ee70983b8d94b132991d9b76b73102e";
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const fetchNewPostsCount = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/api/posts/new-posts-count",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setNewPostsCount(response.data.newPostsCount);
        }
      } catch (error) {
        console.error("Error fetching new posts count:", error);
      }
    };

    fetchNewPostsCount();
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.locationiq.com/v1/autocomplete",
        {
          params: {
            key: locationiqKey,
            q: query,
            format: "json",
            limit: 5,
          },
        }
      );

      const formattedSuggestions = response.data.map((item) => ({
        value: item.display_name,
        data: item,
      }));
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const debounceFetchSuggestions = (text) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 1000);
  };

  const handleLocationChange = (text) => {
    setLocation(text);
    debounceFetchSuggestions(text);
  };

  const handleSuggestionSelect = (suggestion) => {
    setLocation(suggestion.value);
    setSuggestions([]);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  };

  const handleSubmit = () => {
    setImageError("");
    setGenderError("");

    if (!dogBreed) {
      Alert.alert("Error", "Please enter the dog's breed!");
      return;
    }
    if (!dogSize) {
      Alert.alert("Error", "Please enter the dog's size!");
      return;
    }
    if (!gender) {
      setGenderError("Please select a gender!");
      return;
    }
    if (!location) {
      Alert.alert(
        "Error",
        "Please enter the location where the dog was found!"
      );
      return;
    }
    if (!selectedImage) {
      setImageError("Please upload a picture!");
      return;
    }

    const formData = {
      breed: dogBreed,
      size: dogSize,
      details: otherDetails || "",
      gender,
      location,
      image: selectedImage,
    };

    console.log("Form Data:", formData);

    if (onNavigateToViewFoundDogFormAfter) {
      onNavigateToViewFoundDogFormAfter(formData);
    }
  };

  const handleMessageClick = () => {
    if (onNavigateToChatForum) onNavigateToChatForum();
  };

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleHomeClick = () => {
    if (onNavigateToHome) onNavigateToHome();
    setMenuOpen(false);
  };
  const handleProfileClick = () => {
    if (onNavigateToProfile) onNavigateToProfile();
    setMenuOpen(false);
  };
  const handleLogoutClick = () => logout();
  const handleTabClick = (tab) => console.log(`Tab clicked: ${tab}`);

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow access to your photos to upload a dog picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setImageError("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTexts}>PETPALS</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handleHomeClick}>
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleProfileClick}
            >
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogoutClick}
            >
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleTabClick("HomePageLostDog")}
        ></TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleTabClick("HomePageFoundDog")}
        ></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity onPress={handleImageUpload}>
            <Text style={styles.menuTexts}>Upload Picture</Text>
            <Image
              source={
                selectedImage
                  ? { uri: selectedImage.uri }
                  : require("../assets/images/default-image-upload.png")
              }
              style={
                selectedImage
                  ? styles.selectedImageIcon
                  : styles.imageUploadIcon
              }
              resizeMode="cover"
            />
          </TouchableOpacity>
          {/* Display image upload error */}
          {imageError ? (
            <Text style={styles.errorText}>{imageError}</Text>
          ) : null}
        </View>
        <Text style={styles.label}>Breed of dog:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter dog's breed"
          value={dogBreed}
          onChangeText={setDogBreed}
        />

        <Text style={styles.label}>Size of dog:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter dog's size (Ex. small, medium, huge)"
          value={dogSize}
          onChangeText={setDogSize}
        />

        <Text style={styles.label}>Optional / other details:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter other details (optional)"
          value={otherDetails}
          onChangeText={setOtherDetails}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Gender:</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Male" && styles.genderButtonSelected,
            ]}
            onPress={() => {
              setGender("Male");
              setGenderError("");
            }}
          >
            <Image
              source={require("../assets/images/male-icon.png")}
              style={styles.genderIcon}
            />
            <Text
              style={[
                styles.genderText,
                gender === "Male" && styles.genderTextSelected,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Female" && styles.genderButtonSelected,
            ]}
            onPress={() => {
              setGender("Female");
              setGenderError("");
            }}
          >
            <Image
              source={require("../assets/images/female-icon.png")}
              style={styles.genderIcon}
            />
            <Text
              style={[
                styles.genderText,
                gender === "Female" && styles.genderTextSelected,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
        {/* Display gender selection error */}
        {genderError ? (
          <Text style={styles.errorText}>{genderError}</Text>
        ) : null}

        <Text style={styles.label}>Location:</Text>
        <View style={styles.locationInputContainer}>
          <Image
            source={require("../assets/images/location-icon.png")}
            style={styles.locationIcon}
          />
          <TextInput
            style={styles.locationInput}
            placeholder="Enter location where dog was found"
            value={location}
            onChangeText={handleLocationChange}
          />
        </View>

        {/* Autocomplete Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.data.osm_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}
                >
                  <Text style={styles.suggestionText}>{item.value}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleHomeClick}>
          <Image
            source={require("../assets/images/Global-images/home-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleMessageClick}
        >
          {newChatsCount > 0 && (
            <Text style={styles.notificationCount}>{newChatsCount}</Text>
          )}
          <Image
            source={require("../assets/images/Global-images/message-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleNotificationClick}
        >
          {newPostsCount > 0 && (
            <Text style={styles.notificationCount}>{newPostsCount}</Text>
          )}
          <Image
            source={require("../assets/images/Global-images/notification-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>

      <NotificationModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  headerTexts: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  hamburgerButton: { padding: 5 },
  hamburger: { width: 24, height: 24, justifyContent: "space-between" },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: { fontSize: 16, color: "#000" },
  menuTexts: { fontSize: 16, color: "#000", marginLeft: -20 },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "#664229",
    // paddingVertical: 5,
    marginBottom: 10,
    width: "100%",
  },
  navButton: { paddingHorizontal: 5 },
  navText: { color: "#000", fontSize: 12, fontWeight: "bold" },
  formContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  imageUploadContainer: { alignItems: "center", marginBottom: 20 },
  imageUploadIcon: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedImageIcon: {
    width: 200,
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, marginBottom: 8, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#FFF",
    width: "100%",
  },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "center",
  },
  genderButtonSelected: { backgroundColor: "#D3D3D3" },
  genderIcon: { width: 24, height: 24, tintColor: "#333", marginRight: 5 },
  genderText: { fontSize: 16, color: "#333" },
  genderTextSelected: { color: "#000", fontWeight: "bold" },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#FFF",
    width: "100%",
  },
  locationIcon: { width: 24, height: 24, marginLeft: 10, tintColor: "#333" },
  locationInput: { flex: 1, padding: 10, fontSize: 16 },
  suggestionsContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    maxHeight: 150,
    marginBottom: 20,
    width: "100%",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: { fontSize: 14, color: "#333" },
  submitButton: {
    backgroundColor: "#664229",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
    width: "100%",
  },
  submitButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "#D2B48C",
  },
  footerButton: { alignItems: "center", position: "relative" },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  notificationCount: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FF0000",
    color: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
});

export default FoundDogForm;
