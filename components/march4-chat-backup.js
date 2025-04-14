import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import axios from "axios";
import useChatCount from "./hooks/useChatCount";

// Use this URL for Android Emulator; replace with your machine's IP for physical devices or iOS Simulator
const SERVER_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

const ChatForum = ({
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToLostDogPage,
  onNavigateToFoundDogPage,
  onNavigateToMatchedPage,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const scrollViewRef = useRef(null);
  const socketRef = useRef(null);
  const newChatsCount = useChatCount(); // Use the hook

  useEffect(() => {
    const fetchUserDataAndMessages = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found in AsyncStorage");
          onLogout?.();
          return;
        }

        // Fetch user data
        const userResponse = await axios.get(
          `${SERVER_URL}/api/auth/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User data fetched:", userResponse.data);
        setUserFullName(userResponse.data.fullName || "Unknown User");

        // Fetch initial messages
        const messagesResponse = await axios.get(
          `${SERVER_URL}/api/chat/messages`
        );
        console.log("Initial messages fetched:", messagesResponse.data);
        setMessages(
          messagesResponse.data.map((msg) => ({
            id: msg._id,
            text: msg.text,
            isSent: msg.from === userResponse.data.fullName,
            timestamp: new Date(msg.timestamp),
            from: msg.from,
          }))
        );
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserDataAndMessages();

    // Initialize Socket.IO with token for authentication
    AsyncStorage.getItem("token").then((token) => {
      socketRef.current = io(SERVER_URL, {
        transports: ["websocket"],
        query: { token },
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO server:", socketRef.current.id);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket.IO connection error:", err.message);
      });

      socketRef.current.on("receive_forum_message", ({ messages, count }) => {
        console.log(
          "Received messages from server:",
          messages,
          "Count:",
          count
        );
        setMessages(
          messages.map((msg) => ({
            id: msg._id,
            text: msg.text,
            isSent: msg.from === userFullName,
            timestamp: new Date(msg.timestamp),
            from: msg.from,
          }))
        );
      });

      return () => {
        socketRef.current.disconnect();
        console.log("Socket.IO disconnected");
      };
    });
  }, [onLogout, userFullName]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleHomeClick = () => {
    onNavigateToHome?.();
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    onNavigateToProfile?.();
    setMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await AsyncStorage.removeItem("token");
      onLogout?.();
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setMenuOpen(false);
  };

  const handleTabClick = (tab) => {
    console.log(`Tab clicked: ${tab}`);
    if (tab === "HomePageLostDog" && onNavigateToLostDogPage) {
      onNavigateToLostDogPage();
    } else if (tab === "HomePageFoundDog" && onNavigateToFoundDogPage) {
      onNavigateToFoundDogPage();
    } else if (tab === "HomePageMatched" && onNavigateToMatchedPage) {
      onNavigateToMatchedPage();
    }
  };

  const handleMessageClick = () => {
    console.log("Message clicked");
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current && userFullName) {
      const messageData = {
        from: userFullName,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      console.log("Sending message:", messageData);
      socketRef.current.emit("send_forum_message", messageData);
      setNewMessage("");
    } else {
      console.error("Cannot send message: Missing data or socket not ready");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
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

      {/* Navigation Tabs */}
      <View style={styles.navBar}>
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
          onPress={() => handleTabClick("HomePageChatForum")}
        >
          <Text style={styles.navTexts}>Chat Forum</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Content */}
      <ScrollView
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isSent ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageSender}>{message.from}</Text>
            <Text
              style={[
                styles.messageText,
                message.isSent ? { color: "#FFF" } : { color: "#000" },
              ]}
            >
              {message.text}
            </Text>
            <Text
              style={[
                styles.messageTimestamp,
                message.isSent ? { color: "#FFF" } : { color: "#666" },
              ]}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

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
          <Image
            source={require("../assets/images/Global-images/notification-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  hamburgerButton: {
    padding: 5,
  },
  hamburger: {
    width: 24,
    height: 24,
    justifyContent: "space-between",
  },
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
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    width: "100%",
  },
  navButton: {
    paddingHorizontal: 10,
  },
  navText: {
    color: "#65676B",
    fontSize: 14,
    fontWeight: "500",
  },
  navTexts: {
    color: "#65676B",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  chatContent: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: "#1877F2",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#E4E6EB",
    alignSelf: "flex-start",
  },
  messageSender: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTimestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    width: "100%",
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#65676B",
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    backgroundColor: "#FFF",
    width: "100%",
  },
  footerButton: {
    alignItems: "center",
    position: "relative",
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#65676B",
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

export default ChatForum;
