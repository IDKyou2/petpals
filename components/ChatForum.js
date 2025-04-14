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
import NotificationModal from "./NotificationModal";

const SERVER_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

const ChatForum = ({
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToLostDogPage,
  onNavigateToFoundDogPage,
  onNavigateToMatchedPage,
  onLogout,
  onNavigateToPrivateChat,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const scrollViewRef = useRef(null);
  const socketRef = useRef(null);
  const newChatsCount = useChatCount();

  useEffect(() => {
    const fetchUserDataAndMessages = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found in AsyncStorage");
          onLogout?.();
          return;
        }

        const userResponse = await axios.get(
          `${SERVER_URL}/api/auth/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserFullName(userResponse.data.fullName || "Unknown User");
        setUserProfilePic(userResponse.data.profilePic || "");

        const messagesResponse = await axios.get(
          `${SERVER_URL}/api/chat/messages`
        );
        setMessages(
          messagesResponse.data.map((msg) => ({
            id: msg._id,
            text: msg.text,
            isSent: msg.from === userResponse.data.fullName,
            timestamp: new Date(msg.timestamp),
            from: msg.from,
            profilePic: msg.profilePic,
          }))
        );

        const postsResponse = await axios.get(
          `${SERVER_URL}/api/posts/new-posts-count`
        );
        if (postsResponse.status === 200) {
          setNewPostsCount(postsResponse.data.newPostsCount);
        }

        const usersResponse = await axios.get(`${SERVER_URL}/api/chat/users`);
        setUsers(
          usersResponse.data.filter(
            (user) => user.fullName !== userResponse.data.fullName
          )
        );

        socketRef.current = io(SERVER_URL, {
          transports: ["websocket"],
          query: { token },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current.on("connect", () => {
          console.log("Connected to Socket.IO server:", socketRef.current.id);
        });

        socketRef.current.on("connect_error", (err) => {
          console.error("Socket.IO connection error:", err.message);
        });

        socketRef.current.on("receive_forum_message", ({ messages, count }) => {
          setMessages(
            messages.map((msg) => ({
              id: msg._id,
              text: msg.text,
              isSent: msg.from === userFullName,
              timestamp: new Date(msg.timestamp),
              from: msg.from,
              profilePic: msg.profilePic,
            }))
          );
        });

        socketRef.current.on("message_error", (error) => {
          console.error("Message error from server:", error);
        });
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserDataAndMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket.IO disconnected");
      }
    };
  }, [onLogout, userFullName]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
    if (tab === "HomePageLostDog") onNavigateToLostDogPage?.();
    else if (tab === "HomePageFoundDog") onNavigateToFoundDogPage?.();
    else if (tab === "HomePageMatched") onNavigateToMatchedPage?.();
  };

  const handleMessageClick = () => {};
  const handleNotificationClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current && userFullName) {
      const messageData = {
        from: userFullName,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          text: newMessage,
          isSent: true,
          timestamp: new Date(),
          from: userFullName,
          profilePic: userProfilePic,
        },
      ]);
      socketRef.current.emit("send_forum_message", messageData);
      setNewMessage("");
    }
  };

  const handleUserClick = (user) => {
    onNavigateToPrivateChat?.(user);
  };

  const displayedUsers = showAllUsers ? users : users.slice(0, 4);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
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
        transparent
        animationType="slide"
        onRequestClose={toggleMenu}
      >
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

      {/* Navigation Tabs */}
      <View style={styles.navBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageLostDog")}
          >
            <Text style={styles.navText}>Lost Dog</Text>
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
            <Text style={styles.navText}>Matched</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageChatForum")}
          >
            <Text style={styles.navTexts}>Chat Forum</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Content with User List */}
      <View style={styles.mainContent}>
        <ScrollView
          contentContainerStyle={styles.chatContent}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isSent
                  ? styles.sentMessageContainer
                  : styles.receivedMessageContainer,
              ]}
            >
              {!message.isSent && (
                <Image
                  source={
                    message.profilePic
                      ? { uri: `${SERVER_URL}${message.profilePic}` }
                      : require("../assets/images/Global-images/default-user.png")
                  }
                  style={styles.userAvatar}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.isSent ? styles.sentMessage : styles.receivedMessage,
                ]}
              >
                <Text style={styles.messageSender}>{message.from}</Text>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTimestamp}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              {message.isSent && (
                <Image
                  source={
                    message.profilePic
                      ? { uri: `${SERVER_URL}${message.profilePic}` }
                      : require("../assets/images/Global-images/default-user.png")
                  }
                  style={styles.userAvatar}
                />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Modified User List with Shadow */}
        <View style={styles.userList}>
          <ScrollView showsVerticalScrollIndicator={true}>
            {displayedUsers.map((user) => (
              <TouchableOpacity
                key={user.fullName}
                style={styles.userItem}
                onPress={() => handleUserClick(user)}
              >
                <Image
                  source={
                    user.profilePic
                      ? { uri: `${SERVER_URL}${user.profilePic}` }
                      : require("../assets/images/Global-images/default-user.png")
                  }
                  style={styles.userListAvatar}
                />
                <Text style={styles.userName}>{user.fullName}</Text>
              </TouchableOpacity>
            ))}
            {users.length > 4 && !showAllUsers && (
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => setShowAllUsers(true)}
              >
                <Text style={styles.moreText}>More</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Message Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          multiline
          maxLength={500}
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
    </KeyboardAvoidingView>
  );
};

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
  headerText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
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
  navBar: {
    // backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#333",
  },
  navButton: { paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  navText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  navTexts: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  chatContent: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: 100,
  },
  userList: {
    width: 120,
    backgroundColor: "#D2B48C",
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    maxHeight: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userListAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontSize: 13,
    color: "#333",
    textTransform: "capitalize",
    flexShrink: 1,
  },
  moreButton: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    margin: 5,
  },
  moreText: {
    color: "#664229",
    fontSize: 14,
    fontWeight: "600",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 5,
  },
  sentMessageContainer: {
    justifyContent: "flex-end",
  },
  receivedMessageContainer: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 15,
    elevation: 1,
  },
  sentMessage: {
    backgroundColor: "#987554",
  },
  receivedMessage: {
    backgroundColor: "#fff",
  },
  messageSender: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 20,
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "right",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D2B48C",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 2,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#664229",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
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
});

export default ChatForum;
