import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";

const ChooseDestination = ({
  onBackClick,
  onNavigateToProfile,
  onNavigateToLostDogForm,
  onNavigateToFoundDogForm,
  onNavigateToLostDogPage,
  onNavigateToMatchedPage,
  onNavigateToFoundDogPage,
  onNavigateToChatForum,
  onNavigateToViewLostAndFoundSuggestions,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const newChatsCount = useChatCount();

  useEffect(() => {
    const fetchNewPostsCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/posts/new-posts-count"
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

  useEffect(() => {
    const socketConnection = io("http://localhost:5000");
    socketConnection.on("receive_forum_message", ({ count }) => {});
    return () => socketConnection.disconnect();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found in AsyncStorage");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/user/profile",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUserData({
            fullName: data.fullName || "Juan Dela Cruz",
            profilePic: data.profilePic || "/default-avatar.png",
          });
        } else {
          console.error("Error from server:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    onBackClick();
  };

  const profileAccount = () => {
    onNavigateToProfile?.();
    setMenuOpen(false);
  };

  const viewNotifications = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleMessageClick = () => onNavigateToChatForum?.();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleTabClick = (tab) => {
    if (tab === "HomePageLostDog") onNavigateToLostDogPage?.();
    else if (tab === "HomePageMatched") onNavigateToMatchedPage?.();
    else if (tab === "HomePageFoundDog") onNavigateToFoundDogPage?.();
    else if (tab === "ViewLostAndFoundSuggestions")
      onNavigateToViewLostAndFoundSuggestions?.();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuOpen(false)}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={profileAccount}>
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Navigation Tabs */}
      <View style={styles.navBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageLostDog")}
          >
            <Text style={styles.navText}>Lost Dog Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageFoundDog")}
          >
            <Text style={styles.navText}>Found Dog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageMatched")}
          >
            <Text style={styles.navText}>Matched Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("ViewLostAndFoundSuggestions")}
          >
            <Text style={styles.navText}>View Suggestions</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileContainer}>
          <Image
            source={
              userData?.profilePic
                ? { uri: `http://localhost:5000${userData.profilePic}` }
                : require("../assets/images/Global-images/default-user.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>
            {userData?.fullName || "Juan Dela Cruz"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.lostButton}
            onPress={onNavigateToLostDogForm}
          >
            <Text style={styles.buttonTextLost}>I LOST A DOG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.foundButton}
            onPress={onNavigateToFoundDogForm}
          >
            <Text style={styles.buttonTextFound}>I FOUND A DOG</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
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
          onPress={viewNotifications}
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

      {/* Notification Modal */}
      <NotificationModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2B48C",
  },
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  hamburgerButton: {
    padding: 10,
  },
  hamburger: {
    width: 30,
    height: 20,
    justifyContent: "space-between",
  },
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
  menuText: {
    fontSize: 18,
    color: "#000",
  },
  navBar: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  lostButton: {
    backgroundColor: "#D2B48C",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
    width: "85%",
    alignItems: "center",
    elevation: 2,
    borderWidth: 3,
    borderColor: "#664229",
  },
  foundButton: {
    backgroundColor: "#664229",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    elevation: 2,
  },
  buttonTextLost: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextFound: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#D2B48C",
    elevation: 5,
  },
  footerButton: {
    alignItems: "center",
    padding: 10,
    position: "relative",
  },
  footerIcon: {
    width: 28,
    height: 28,
    tintColor: "#000",
  },
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
});

export default ChooseDestination;
