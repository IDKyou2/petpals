import { MaterialIcons } from '@expo/vector-icons'; // if using Expo
// or
import Icon from 'react-native-vector-icons/MaterialIcons'; // if using react-native-vector-icons directly
import React, { useState, useEffect } from "react";
import {
  // These are React Native UI components like buttons, inputs, modals, etc.
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; //Used to store and retrieve data locally (like the login token).
import axios from "axios"; //To make HTTP requests (like GET, PUT) to your backend server.
import io from "socket.io-client"; //Used for real-time communication (like messaging/chat notifications).
import useChatCount from "./hooks/useChatCount"; //A custom hook you probably made that tells you how many new chats/messages there are.
import NotificationModal from "./NotificationModal";

//This is a smart way to handle Android emulator IP differences. Android emulators use 10.0.2.2 instead of localhost.
const SERVER_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

const UserProfile = ({ onNavigateToHome, onLogout, onNavigateToChatForum }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const newChatsCount = useChatCount();


  useEffect(() => {
    //useEffect - Fetching Data
    const fetchUserDataAndPostsCount = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found in AsyncStorage");
        onLogout?.();
        return;
      }

      try {
        const userResponse = await axios.get(
          `${SERVER_URL}/api/auth/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.status === 200) {
          // ----------------------------------------------------------------- User data ----------------------------------------------------//
          setUserData({
            fullName: userResponse.data.fullName || "User's full name not found.",
            contact: userResponse.data.contact || "Contact not found.",
            email: userResponse.data.email || "Email not found.",
            username: userResponse.data.username || "Username not found.",
            profilePic: userResponse.data.profilePic || "/default-avatar.png",
          });
          // ----------------------------------------------------------- Update data ----------------------------------------//
          setNewContact(userResponse.data.contact || "Error updating contact number.");
          setNewProfile(userResponse.data.profilePic || "Error updating profile picture.");
          const messagesResponse = await axios.get(
            `${SERVER_URL}/api/chat/private-messages/${userResponse.data.fullName}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // ------------------------ Chats --------------------------//
          setMessages(
            messagesResponse.data.map((msg) => ({
              id: msg._id,
              text: msg.text,
              from: msg.from,
              to: msg.to,
              timestamp: new Date(msg.timestamp),
              profilePic: msg.profilePic,
              read: msg.read,
            }))
          );
        }

        const postsResponse = await axios.get(
          `${SERVER_URL}/api/posts/new-posts-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (postsResponse.status === 200) {
          setNewPostsCount(postsResponse.data.newPostsCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error);
      }
    };

    fetchUserDataAndPostsCount();
  }, [onLogout]);

  useEffect(() => {
    let socket;
    const socketSetup = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token || !userData) return;

      socket = io(SERVER_URL, {
        query: { token },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      socket.on(`private_message_${userData.fullName}_*`, (newMessages) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, ...newMessages];
          const uniqueMessages = Array.from(
            new Map(updatedMessages.map((msg) => [msg._id, msg])).values()
          );
          return uniqueMessages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
        });
      });

      return () => {
        if (socket) socket.disconnect();
      };
    };

    socketSetup();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [userData, onLogout]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleHomeClick = () => {
    onNavigateToHome?.();
    setMenuOpen(false);
  };
  const handleProfileClick = () => setMenuOpen(false);
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout?.();
    setMenuOpen(false);
  };
  const handleLogoutClick = () => logout();
  const handleMessageClick = () => onNavigateToChatForum?.();
  const handleNotificationClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ---------------- edit function ------------------//
  const editInfo = () => setIsEditing(true);


  // --------------------------------------------------------  Save changes button ------------------------------------------//
  const handleSaveChanges = () => {
    if (newContact.length < 11) {
      window.alert("Please enter a valid contact number.");
    }else{
      if (!newContact.trim()) return;
      setConfirmationModalVisible(true);
    }
  }; 


  // ---------------- Confirm button ------------------//
  const handleConfirmChanges = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(
        `${SERVER_URL}/api/auth/user/profile`,
        {
          fullName: userData.fullName,
          contact: newContact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // ----------------------------------------- Update the user data in the state --------------------------------------------
        setUserData({ ...userData, contact: newContact });
        setIsEditing(false);
        setConfirmationModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleCancelChanges = () => {
    setConfirmationModalVisible(false);
    setIsEditing(false);
    setNewContact(userData?.contact || "Contact not found.");
  };

  // ---------------- Edit Profile pic button ------------------//
  const editProfilePic = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(
        `${SERVER_URL}/api/auth/user/profile`,
        {
          fullName: userData.fullName,
          contact: newContact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUserData({ ...userData, contact: newContact });
        setIsEditing(false);
        setConfirmationModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.petText}>PETPALS</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <View style={styles.hamburger}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Hamburger Menu Modal */}
      <Modal visible={menuOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
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

      {/* User Profile Section */}
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.profileContainer}>
          {/* ---------------------------------------------- Profile image and name ---------------------------------/ */}
          <Image
            source={
              userData?.profilePic
                ? { uri: `${SERVER_URL}${userData.profilePic}` }
                : require("../assets/images/Global-images/default-user.png")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            //------------------------------ Edit button save -------------------------//
            onPress={editProfilePic}
            style={styles.editIcon}
          >
            <MaterialIcons name="image" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.profileNameText}>
            {userData?.fullName || "User"}
          </Text>
          {/* -------------------------------------------------------------------------------------- Editting clicked ---------------------------------// */}
          {isEditing ? (
            <View style={styles.editContainer}>
              <Text style={styles.nameText}>
                Full name: {userData?.fullName || "User"}
              </Text>

              <Text style={styles.nameText}>Contact number:</Text>
              <TextInput
                style={styles.contactInput}
                value={newContact}
                onChangeText={(text) => {
                  // Remove all non-numeric characters
                  const numericText = text.replace(/[^0-9]/g, "");

                  if (numericText.length <= 11) {
                    setNewContact(numericText);
                  }
                }}
                placeholder="Enter new contact number."
                keyboardType="number-pad"
                maxLength={11}
                autoFocus
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelChanges}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileCard}>
              <Text style={styles.emailText}>
                Username: {userData?.username || "Username not found."}
              </Text>
              <Text style={styles.emailText}>
                Email: {userData?.email || "Email not found."}
              </Text>
              <Text style={styles.contactText}>
                Contact #: {userData?.contact || "Contact not found."}
              </Text>
              <TouchableOpacity
                //------------------------------ Edit button save -------------------------//
                onPress={editInfo}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit Info</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Inbox Section */}
        <View style={styles.inboxContainer}>
          <Text style={styles.inboxTitle}>Inbox</Text>
          <ScrollView style={styles.messagesContainer}>
            {messages.length > 0 ? (
              messages.map((message) => (
                <View key={message.id} style={styles.messageItem}>
                  <Image
                    source={
                      message.profilePic
                        ? { uri: `${SERVER_URL}${message.profilePic}` }
                        : require("../assets/images/Global-images/default-user.png")
                    }
                    style={styles.messageAvatar}
                  />
                  <View style={styles.messageContent}>
                    <Text style={styles.messageSender}>
                      {message.from === userData?.fullName
                        ? "You"
                        : message.from}
                    </Text>
                    <Text style={styles.messageText}>{message.text}</Text>
                    <Text style={styles.messageTimestamp}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    {!message.read && message.to === userData?.fullName && (
                      <Text style={styles.unreadText}>Unread</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noMessages}>No messages yet</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Footer */}
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

      {/* Confirmation Modal */}
      <Modal
        visible={confirmationModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.confirmationModalOverlay}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationModalText}>
              Are you sure you want to change your contact number?
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmChanges}
              >
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
              {/* ------------------------------ No button -------------------------// */}
              <TouchableOpacity
                onPress={handleCancelChanges}
                style={styles.cancelButton}

              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <NotificationModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </View>
  );
};

// -------------------------------------------------------------------------- CSS  -------------------------------------------------------- //
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D2B48C" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D2B48C",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  petText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  hamburgerButton: { padding: 10 },
  hamburger: { width: 30, height: 20, justifyContent: "space-between" },
  hamburgerLine: {
    width: 30,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: "100%",
    maxHeight: "50%",
  },
  menuItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: { fontSize: 18, color: "#000" },
  content: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 80,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 10,
  },
  profileNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "capitalize",
  },
  profileCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 8,
    width: "100%",
  },
  editContainer: {
    backgroundColor: "#ffff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    width: "100%",
  },
  emailText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "left",
    textTransform: "none",
  },
  contactText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    fontWeight: "bold",
  },
  //-------------- Edit button style -------------------//
  editButton: {
    backgroundColor: "#664229",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  //-------------- Edit icon style -------------------//
  editIcon: {
    position: 'absolute', // Position absolutely within the container
    top: 90, // Adjust as needed
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  //-------------- No button -------------------
  // brown border, white background //
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderColor: "#664229",
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
    maxWidth: 280,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 280,
  },
  inboxContainer: {
    width: "100%",
    maxWidth: 350,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    elevation: 3,
    marginBottom: 20,
  },
  inboxTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  messagesContainer: {
    maxHeight: 200,
  },
  messageItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#666",
  },
  unreadText: {
    fontSize: 12,
    color: "#FF0000",
    fontWeight: "bold",
  },
  noMessages: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#D2B48C",
    elevation: 5,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerButton: { padding: 10, position: "relative" },
  footerIcon: { width: 28, height: 28, tintColor: "#000" },
  notificationCount: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF0000",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
  confirmationModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  confirmationModalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 320,
    alignItems: "center",
  },
  confirmationModalText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  confirmButton: {
    backgroundColor: "#664229",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
