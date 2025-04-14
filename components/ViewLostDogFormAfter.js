//  ------------------------------------------------------------ After LostDogForm.js -------------------------------------------------------

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";


const ViewLostDogFormAfter = ({
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToLostDogForm,
  formData,
  onLogout,
  onNavigateToLostDogPage,
  onNavigateToMatchedPage,
  onNavigateToChatForum,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionIdRef = useRef(null);

  const [editName, setEditName] = useState(formData?.name || "Max");
  const [editBreed, setEditBreed] = useState(formData?.breed || "Havanese");
  const [editSize, setEditSize] = useState(formData?.size || "Small");
  const [editDetails, setEditDetails] = useState(
    formData?.details || "No additional details provided."
  );
  const [editGender, setEditGender] = useState(formData?.gender || "Male");
  const [editLocation, setEditLocation] = useState(
    formData?.location || "Unknown"
  );
  const [image, setImage] = useState(formData?.image || null);
  const newChatsCount = useChatCount();

  useEffect(() => {
    const fetchNewPostsCount = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found in AsyncStorage");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/posts/new-posts-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleMessageClick = () => {
    console.log("Message clicked");
    if (onNavigateToChatForum) {
      onNavigateToChatForum();
    }
  };

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleHomeClick = () => {
    onNavigateToHome?.();
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    onNavigateToProfile?.();
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout?.();
    setMenuOpen(false);
  };

  const handleTabClick = (tab) => {
    console.log(`Tab clicked: ${tab}`);
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveChanges = () => {
    setIsEditing(false);
    console.log("Updated data:", {
      name: editName,
      breed: editBreed,
      size: editSize,
      details: editDetails,
      gender: editGender,
      location: editLocation,
    });
  };

  const handleReportAsLostClick = () => {
    if (!isSubmitting) {
      setModalVisible(true);
    }
  };

  const handleConfirmReport = async () => {
    if (isSubmitting) return;

    const submissionId = Date.now().toString();
    if (submissionIdRef.current === submissionId) return;
    submissionIdRef.current = submissionId;

    setIsSubmitting(true);
    setModalVisible(false);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in to report a lost dog.");
        throw new Error("No token");
      }

      const updatedFormData = {
        name: editName,
        breed: editBreed,
        size: editSize,
        details: editDetails || "",
        gender: editGender,
        location: editLocation,
        image,
      };

      const formDataToSend = new FormData();
      Object.entries(updatedFormData).forEach(([key, value]) => {
        if (key === "image" && value?.uri) return;
        if (value) formDataToSend.append(key, value);
      });

      if (updatedFormData.image?.uri) {
        const imageBlob = await (await fetch(updatedFormData.image.uri)).blob();
        formDataToSend.append("dogImage", imageBlob, "dogImage.jpg");
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/lostdog",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
        }
      );

      console.log("Server Response:", data);
      
      if (onNavigateToLostDogPage && onNavigateToMatchedPage) {
        onNavigateToLostDogPage();
        onNavigateToMatchedPage();
      }

      Alert.alert("Success", "Lost dog reported successfully!");
    } catch (error) {
      console.error("Error reporting lost dog:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to report lost dog."
      );
    } finally {
      setIsSubmitting(false);
      submissionIdRef.current = null;
    }
  };

  // Updated handleCancelReport to only close the modal
  const handleCancelReport = () => {
    setModalVisible(false);
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PETPALS</Text>
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
        transparent
        animationType="slide"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
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
        >
          {/* <Text style={styles.navText}>Lost Dog</Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleTabClick("HomePageFoundDog")}
        >
          {/* <Text style={styles.navText}>Found Dog</Text> */}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Back Arrow Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigateToLostDogForm?.()}
        >
          <Image
            source={require("../assets/images/back-arrow.png")}
            style={styles.backArrow}
          />
          <Text style={styles.backText}>Back to Form</Text>
        </TouchableOpacity>

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Details</Text>
          </View>

          {isEditing && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}

          <Image
            source={
              image
                ? { uri: image.uri }
                : require("../assets/images/dog-icon.png")
            }
            style={styles.dogImage}
            resizeMode="contain"
          />

          <View style={styles.dogDetails}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Dog Name"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.dogName}>{editName}</Text>
            )}
            {isEditing ? (
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    editGender === "Male" && styles.genderButtonSelected,
                  ]}
                  onPress={() => setEditGender("Male")}
                >
                  <Image
                    source={require("../assets/images/male-icon.png")}
                    style={styles.genderIcon}
                  />
                  <Text
                    style={[
                      styles.genderText,
                      editGender === "Male" && styles.genderTextSelected,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    editGender === "Female" && styles.genderButtonSelected,
                  ]}
                  onPress={() => setEditGender("Female")}
                >
                  <Image
                    source={require("../assets/images/female-icon.png")}
                    style={styles.genderIcon}
                  />
                  <Text
                    style={[
                      styles.genderText,
                      editGender === "Female" && styles.genderTextSelected,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.dogInfo}>Gender: {editGender}</Text>
            )}
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editBreed}
                onChangeText={setEditBreed}
                placeholder="Breed"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.dogInfo}>Breed: {editBreed}</Text>
            )}
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editSize}
                onChangeText={setEditSize}
                placeholder="Size"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.dogInfo}>Size: {editSize}</Text>
            )}
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.detailsInput]}
                value={editDetails}
                onChangeText={setEditDetails}
                placeholder="Additional details."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.dogDescription}>
                {editDetails || "No additional details provided."}
              </Text>
            )}
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editLocation}
                onChangeText={setEditLocation}
                placeholder="Location"
                placeholderTextColor="#999"
              />
            ) : (
              <View style={styles.locationContainer}>
                <Image
                  source={require("../assets/images/location-icon.png")}
                  style={styles.locationIcon}
                />
                <Text style={styles.dogDetail}>Location: {editLocation}</Text>
              </View>
            )}
          </View>
          {/* ------------------------------------  Edit button ---------------------------------*/}
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditClick}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.reportButton, isSubmitting && styles.disabledButton]}
            onPress={handleReportAsLostClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.reportButtonText}>REPORT AS LOST</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !isSubmitting && setModalVisible(false)}
      >
        {/* --------------------------------------------- Modal ---------------------------------------- */}
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.modalText}>Do you want to report this?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.yesButton,
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleConfirmReport}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>YES</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.noButton}
                onPress={handleCancelReport}
                disabled={isSubmitting}
              >
                <Text style={styles.noButtonText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: "#D2B48C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
  },
  confirmationModal: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  yesButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  //-------------- No button --------------//
  // brown border, white background //
  noButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#664229",
    backgroundColor: "#fff",
  },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  noButtonText: { color: "#0", fontSize: 16, fontWeight: "bold" },

  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
  },

  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: { fontSize: 16, color: "#000" },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "#664229",
    paddingVertical: 5,
    marginBottom: 10,
    width: "100%",
  },
  navButton: { paddingHorizontal: 5 },
  navText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  content: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  backArrow: {
    width: 24,
    height: 24,
    backgroundColor: "#664229",
    borderRadius: 12,
    padding: 5,
    tintColor: "#fff",
  },
  backText: {
    fontSize: 16,
    color: "#664229",
    marginLeft: 10,
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxWidth: 300,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profileTitle: { fontSize: 16, fontWeight: "bold", color: "#000", flex: 1 },
  dogImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: "center",
  },
  dogDetails: {
    marginBottom: 15, flexDirection: "column",
    //-------------- Capitalize first letter -----------//
    textTransform: "capitalize",
  },
  dogName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  dogInfo: { fontSize: 14, color: "#666", marginBottom: 5, textAlign: "left" },
  dogDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  dogDetail: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: "#666",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
    width: "100%",
  },
  detailsInput: { height: 80, textAlignVertical: "top" },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    justifyContent: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#D3D3D3",
  },
  genderIcon: {
    width: 20,
    height: 20,
    tintColor: "#333",
    marginRight: 5,
  },
  genderText: {
    fontSize: 14,
    color: "#333",
  },
  genderTextSelected: {
    color: "#000",
    fontWeight: "bold",
  },
  //-------------- Edit button --------------//
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: "flex-end",
    borderColor: "#664229",
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  editButtonText: { fontSize: 14, color: "#0", fontWeight: "bold" },

  //  ------------ Save changes button --------------//
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: "flex-end",
    borderColor: "#664229",
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  saveButtonText: { fontSize: 14, color: "#0", fontWeight: "bold" },
  reportButton: {
    backgroundColor: "#664229",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  reportButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
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
});

export default ViewLostDogFormAfter;
