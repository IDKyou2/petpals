import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FoundDogViewUserInfo = ({
  dog,
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToFoundDogPage,
  onLogout,
  onNavigateToChatForum,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found in AsyncStorage");
          return;
        }

        const userId =
          dog.userId && dog.userId._id ? dog.userId._id : dog.userId;
        if (!userId) {
          console.error("Invalid userId:", dog.userId);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/auth/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [dog.userId]);

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout?.();
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
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
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onNavigateToHome?.();
                setMenuOpen(false);
              }}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onNavigateToProfile?.();
                setMenuOpen(false);
              }}
            >
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.mainContent}>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => onNavigateToFoundDogPage?.()}
        >
          <Image
            source={require("../assets/images/back-arrow.png")}
            style={styles.arrowIcon}
          />
          <Text style={styles.mainTitle}>View User Info</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Image
            source={{ uri: `http://localhost:5000${dog.imagePath}` }}
            style={styles.missingDogImage}
          />
          <View style={styles.info}>
            <Text style={styles.petId}>Pet ID #: {dog.petId}</Text>
            <Text style={styles.name}>Category: {dog.category}</Text>
            <Text style={styles.breed}>
              <Text style={styles.label}>Breed: </Text>
              {dog.breed}
            </Text>
            <Text style={styles.details}>
              <Text style={styles.label}>Gender: </Text>
              {dog.gender}
            </Text>
            <View style={styles.divider} />
            <View style={styles.lastSeen}>
              <Image
                source={require("../assets/images/location-icon.png")}
                style={styles.locationIcon}
              />
              <Text style={styles.location}>
                <Text style={styles.label}>Location: </Text>
                {dog.location}
              </Text>
            </View>
            <View style={styles.sizeContainer}>
              <Image
                source={require("../assets/images/size.png")}
                style={styles.icon}
              />
              <Text style={styles.size}>
                <Text style={styles.label}>Size: </Text>
                {dog.size}
              </Text>
            </View>
            {userData && userData.contact && (
              <View style={styles.contactContainer}>
                <Image
                  source={require("../assets/images/phone-number.png")}
                  style={styles.icon}
                />
                <Text style={styles.contact}>
                  <Text style={styles.label}>Contact #: </Text>
                  {userData.contact}
                </Text>
              </View>
            )}
            <View style={styles.uniqueMarkingsContainer}>
              <Image
                source={require("../assets/images/details.png")}
                style={styles.icon}
              />
              <Text style={styles.uniqueMarkings}>
                <Text style={styles.label}>Unique markings/features: </Text>
                {dog.details}
              </Text>
            </View>
            <View style={styles.postedBy}>
              <Image
                source={require("../assets/images/default-user.png")}
                style={styles.icon}
              />
              <Text style={styles.postedByText}>
                {dog.userId && dog.userId.fullName ? (
                  <>
                    <Text style={styles.label}>Posted by: </Text>
                    {dog.userId.fullName}
                  </>
                ) : (
                  <Text style={styles.errorText}>
                    Error: User info unavailable.
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "#D2B48C",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D2B48C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 10,
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
  mainContent: {
    padding: 20,
  },
  arrowBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    backgroundColor: "#664229",
    borderRadius: 12,
    padding: 5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
  },
  missingDogImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    resizeMode: "contain",
  },
  info: {
    marginTop: 10,
    width: "100%",
  },
  petId: {
    fontSize: 14,
    color: "gray",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    textTransform: "capitalize",
  },
  breed: {
    fontSize: 18,
    marginVertical: 5,
    color: "000",
  },
  details: {
    fontSize: 16,
    marginVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  lastSeen: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  location: {
    fontSize: 16,
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  size: {
    fontSize: 16,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  contact: {
    fontSize: 16,
  },
  uniqueMarkingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  uniqueMarkings: {
    fontSize: 16,
  },
  postedBy: {
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  label: {
    fontWeight: "700",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default FoundDogViewUserInfo;
