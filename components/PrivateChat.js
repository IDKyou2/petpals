import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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

const SERVER_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

const PrivateChat = ({
  user,
  onNavigateToChatForum,
  onNavigateToHome,
  onNavigateToProfile,
  onLogout,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const scrollViewRef = useRef(null);
  const socketRef = useRef(null);

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
          `${SERVER_URL}/api/chat/private-messages/${userResponse.data.fullName}`
        );
        const filteredMessages = messagesResponse.data.filter(
          (msg) =>
            (msg.from === userResponse.data.fullName &&
              msg.to === user.fullName) ||
            (msg.from === user.fullName &&
              msg.to === userResponse.data.fullName)
        );
        setMessages(
          filteredMessages.map((msg) => ({
            id: msg._id,
            text: msg.text,
            isSent: msg.from === userResponse.data.fullName,
            timestamp: new Date(msg.timestamp),
            from: msg.from,
            profilePic: msg.profilePic,
          }))
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

        socketRef.current.on(
          `private_message_${userResponse.data.fullName}_${user.fullName}`,
          (msg) => {
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              const tempIndex = updatedMessages.findIndex(
                (m) =>
                  m.id.startsWith("temp-") &&
                  m.text === msg.text &&
                  m.from === msg.from
              );
              if (tempIndex !== -1) {
                updatedMessages[tempIndex] = {
                  id: msg._id,
                  text: msg.text,
                  isSent: msg.from === userFullName,
                  timestamp: new Date(msg.timestamp),
                  from: msg.from,
                  profilePic: msg.profilePic,
                };
              } else if (!updatedMessages.some((m) => m.id === msg._id)) {
                updatedMessages.push({
                  id: msg._id,
                  text: msg.text,
                  isSent: msg.from === userFullName,
                  timestamp: new Date(msg.timestamp),
                  from: msg.from,
                  profilePic: msg.profilePic,
                });
              }
              return updatedMessages;
            });
          }
        );

        socketRef.current.on(
          `private_message_${user.fullName}_${userResponse.data.fullName}`,
          (msg) => {
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              const tempIndex = updatedMessages.findIndex(
                (m) =>
                  m.id.startsWith("temp-") &&
                  m.text === msg.text &&
                  m.from === msg.from
              );
              if (tempIndex !== -1) {
                updatedMessages[tempIndex] = {
                  id: msg._id,
                  text: msg.text,
                  isSent: msg.from === userFullName,
                  timestamp: new Date(msg.timestamp),
                  from: msg.from,
                  profilePic: msg.profilePic,
                };
              } else if (!updatedMessages.some((m) => m.id === msg._id)) {
                updatedMessages.push({
                  id: msg._id,
                  text: msg.text,
                  isSent: msg.from === userFullName,
                  timestamp: new Date(msg.timestamp),
                  from: msg.from,
                  profilePic: msg.profilePic,
                });
              }
              return updatedMessages;
            });
          }
        );
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
  }, [onLogout, user]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current && userFullName) {
      const tempId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      const messageData = {
        from: userFullName,
        to: user.fullName,
        text: newMessage,
        timestamp: new Date().toISOString(),
        profilePic: userProfilePic,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: tempId,
          text: newMessage,
          isSent: true,
          timestamp: new Date(),
          from: userFullName,
          profilePic: userProfilePic,
        },
      ]);

      socketRef.current.emit("send_private_message", messageData);
      setNewMessage("");
    }
  };

  const handleBackToForum = () => {
    onNavigateToChatForum?.();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToForum}>
          <Text style={styles.backText}>Back to Forum</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{user.fullName}</Text>
      </View>

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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
  backText: { fontSize: 16, color: "#fff" },
  chatContent: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: 100,
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
});

export default PrivateChat;
