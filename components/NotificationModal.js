import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const NotificationModal = ({ isModalOpen, closeModal }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/posts/new-posts"
          );
          const sortedNotifications = response.data.notifications.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          console.log("Fetched notifications:", sortedNotifications);
          setNotifications(sortedNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [isModalOpen]);

  const renderNotificationItem = ({ item }) => {
    const createdAt = new Date(item.createdAt);
    const formattedDate = createdAt.toLocaleDateString();
    const formattedTime = createdAt.toLocaleTimeString();
    const imageUri = `http://localhost:5000${item.imagePath}`;

    return (
      <View style={styles.notificationItem}>
        <View style={styles.notificationDetails}>
          <Image
            source={{ uri: imageUri }}
            style={styles.notificationImage}
            defaultSource={require("../assets/images/dog-icon.png")}
            onError={(e) =>
              console.log(`Image load error: ${imageUri}`, e.nativeEvent.error)
            }
          />
          <View>
            <Text style={styles.notificationType}>
              {item.category === "Lost" ? "Lost Dog" : "Found Dog"}
            </Text>
            <Text style={styles.notificationName}>
              {item.name || "Unnamed Dog"}
            </Text>
          </View>
        </View>
        <Text style={styles.notificationDate}>
          {formattedDate} at {formattedTime}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={isModalOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Notifications</Text>
          {notifications.length === 0 ? (
            <Text style={styles.noNotifications}>No new notifications</Text>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item._id}
              style={styles.notificationList}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    //width: width * 0.8,
    width: "90%",
    maxHeight: height * 0.8,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "black",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  notificationList: {
    flexGrow: 0,
    height: 200,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  notificationDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 4,
  },
  notificationType: {
    fontWeight: "bold",
    fontSize: 16,
  },
  notificationName: {
    fontSize: 14,
  },
  notificationDate: {
    fontSize: 12,
    color: "black",
    marginLeft: 15,
  },
  noNotifications: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});

export default NotificationModal;
