import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import io from "socket.io-client";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";

const LostDogPage = ({
  onNavigateToHome,
  onNavigateToProfile,
  onLogout,
  onNavigateToMatchedPage,
  onNavigateToLostDogForm,
  onNavigateToFoundDogPage,
  onNavigateToChatForum,
  onNavigateToLostDogViewUserInfo,
  onNavigateToViewLostAndFoundSuggestions,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lostDogs, setLostDogs] = useState([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const newChatsCount = useChatCount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const lostDogsResponse = await axios.get(
          "http://localhost:5000/api/lostdog",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (lostDogsResponse.status === 200) {
          setLostDogs(
            lostDogsResponse.data.lostDogs.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
        }

        const postsResponse = await axios.get(
          "http://localhost:5000/api/posts/new-posts-count"
        );
        if (postsResponse.status === 200) {
          setNewPostsCount(postsResponse.data.newPostsCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("newLostDog", (newDog) =>
      setLostDogs((prev) => [newDog, ...prev])
    );
    socket.on("dogReunited", ({ petId }) =>
      setLostDogs((prev) =>
        prev.map((dog) =>
          dog.petId === petId ? { ...dog, reunited: true } : dog
        )
      )
    );
    socket.on("disconnect", () => console.log("Disconnected"));
    return () => socket.disconnect();
  }, []);

  const filteredDogs = lostDogs.filter((dog) => {
    const query = searchQuery.toLowerCase();
    const location = String(dog.location || "").toLowerCase();
    const breed = String(dog.breed || "").toLowerCase();
    const gender = String(dog.gender || "").toLowerCase();
    const name = String(dog.name || "").toLowerCase();
    return (
      location.includes(query) ||
      breed.includes(query) ||
      gender.includes(query) ||
      name.includes(query)
    );
  });

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
    if (tab === "HomePageFoundDog") onNavigateToFoundDogPage?.();
    else if (tab === "HomePageMatched") onNavigateToMatchedPage?.();
    else if (tab === "ViewLostAndFoundSuggestions")
      onNavigateToViewLostAndFoundSuggestions?.();
  };

  const handleMessageClick = () => onNavigateToChatForum?.();
  const handleNotificationClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleMoreInfoClick = (dog) => onNavigateToLostDogViewUserInfo?.(dog);
  const handleAddClick = () => onNavigateToLostDogForm?.();

  // ----------------------------- To capitalized first letter of the word ----------------------------------//
  const toCapitalize = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.replace(/\b\w/, (char) => char.toUpperCase());
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

      {/* Menu Modal */}
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

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("HomePageLostDog")}
          >
            <Text style={styles.navTexts}>Lost Dog Page</Text>
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name, Location, Breed, or Gender..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredDogs.length > 0 ? (
          filteredDogs.map((dog, index) => (
            <View
              style={[
                styles.card,
                dog.category === "Found" && styles.foundCard,
                dog.reunited && styles.reunitedCard,
              ]}
              key={dog.petId || index}
            >
              <Image
                source={
                  dog.imagePath
                    ? { uri: `http://localhost:5000${dog.imagePath}` }
                    : require("../assets/images/dog-icon.png")
                }
                style={styles.cardImage}
                resizeMode="contain"
              />
              <View style={styles.cardContent}>
                <Text style={styles.petIdText}>Pet ID: {dog.petId}</Text>
                {dog.name && <Text style={styles.cardTitle}>{toCapitalize(dog.name)}</Text>}
                <Text style={styles.cardSubtitle}>
                  {toCapitalize(dog.breed)}, {toCapitalize(dog.gender)}
                </Text>
                <View style={styles.cardLocation}>
                  <Image
                    source={require("../assets/images/location-icon.png")}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.cardLocationText}>
                    {dog.category === "Found" ? "Found at:" : "Last seen:"}{" "}
                    {toCapitalize(dog.location)} 
                  </Text>
                </View>
                <Text style={styles.cardTimestamp}>
                  {dog.category === "Found" ? "Found on:" : "Lost on:"}{" "}
                  {new Date(dog.createdAt).toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.cardCategory,
                    toCapitalize(dog.category) === "Found" && styles.foundCategoryText,
                  ]}  
                >
                  Category: {toCapitalize(dog.category) || "Lost"}
                </Text>
                {dog.reunited && (
                  <Text style={styles.reunitedText}>Status: Reunited</Text>
                )}
                <TouchableOpacity
                  style={styles.moreInfoButton}
                  onPress={() => handleMoreInfoClick(dog)}
                >
                  <Text style={styles.moreInfoText}>More Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            {searchQuery
              ? "No matching dogs found."
              : "No lost dogs reported yet."}
          </Text>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerIcons}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleHomeClick}
          >
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddClick}>
          <Image
            source={require("../assets/images/add-icon.png")}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>

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
  navTexts: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  content: {
    flexGrow: 1,
    padding: 15,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
    width: "100%",
    maxWidth: 350,
    flexDirection: "column",
    padding: 15,
  },
  foundCard: {
    backgroundColor: "#e6ffe6",
  },
  reunitedCard: {
    backgroundColor: "#f0f0f0",
    opacity: 0.8,
  },
  cardImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    flex: 1,
  },
  petIdText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
    textTransform: "capitalize"
  },
  cardLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
    tintColor: "#666",
  },
  cardLocationText: {
    fontSize: 14,
    color: "#666",
    flexShrink: 1,
  },
  cardTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  cardCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontWeight: "bold",
  },
  foundCategoryText: {
    color: "#006600",
  },
  reunitedText: {
    fontSize: 14,
    color: "#006600",
    fontWeight: "bold",
    marginBottom: 10,
  },
  /* ------------------------------------- MORE INFO BUTTON -------------------------------------------*/
  moreInfoButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  moreInfoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#D2B48C",
    elevation: 5,
  },
  footerIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  footerButton: {
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
  addButton: {
    position: "absolute",
    right: 15,
    bottom: 70,
    backgroundColor: "#664229",
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});

export default LostDogPage;
