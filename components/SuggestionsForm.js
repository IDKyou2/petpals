import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuggestionsForm = ({
  onBackClick,
  onNavigateToProfile,
  onNavigateToLostDogPage,
  onNavigateToMatchedPage,
  onNavigateToFoundDogPage,
  onNavigateToChatForum,
  onNavigateToViewLostAndFoundSuggestions,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [rating, setRating] = useState(0);
  const [submitStatus, setSubmitStatus] = useState(null);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    onBackClick();
  };

  const profileAccount = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile();
    }
    setMenuOpen(false);
  };

  const handleMessageClick = () => {
    if (onNavigateToChatForum) {
      onNavigateToChatForum();
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabClick = (tab) => {
    if (tab === "HomePageLostDog" && onNavigateToLostDogPage) {
      onNavigateToLostDogPage();
    } else if (tab === "HomePageMatched" && onNavigateToMatchedPage) {
      onNavigateToMatchedPage();
    } else if (tab === "HomePageFoundDog" && onNavigateToFoundDogPage) {
      onNavigateToFoundDogPage();
    } else if (
      tab === "ViewLostAndFoundSuggestions" &&
      onNavigateToViewLostAndFoundSuggestions
    ) {
      onNavigateToViewLostAndFoundSuggestions();
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await fetch("http://localhost:5000/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ suggestion, rating }),
      });
      if (response.ok) {
        setSubmitStatus("Suggestion submitted successfully!");
        setSuggestion("");
        setRating(0);
        setTimeout(() => setSubmitStatus(null), 3000);
        if (onNavigateToViewLostAndFoundSuggestions) {
          onNavigateToViewLostAndFoundSuggestions();
        }
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      setSubmitStatus(`Error: ${error.message}`);
      console.error(error);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => setRating(star)}
        style={styles.starButton}
      >
        <Text style={rating >= star ? styles.filledStar : styles.emptyStar}>
          ★
        </Text>
      </TouchableOpacity>
    ));
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
          onPress={() => handleTabClick("ViewLostAndFoundSuggestions")}
        >
          <Text style={styles.navText}>View Suggestions</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.formTitle}>Submit a Suggestion</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder="Enter your suggestion here (max 500 characters)"
          value={suggestion}
          onChangeText={setSuggestion}
          maxLength={500}
        />
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Rating:</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
        </View>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !suggestion || !rating ? styles.disabledButton : null,
          ]}
          onPress={handleSubmit}
          disabled={!suggestion || !rating}
        >
          <Text style={styles.submitButtonText}>Submit Suggestion</Text>
        </TouchableOpacity>
        {submitStatus && (
          <Text style={styles.submitStatus}>{submitStatus}</Text>
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => console.log("Home clicked")}
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
          <Image
            source={require("../assets/images/Global-images/message-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => console.log("Notifications clicked")}
        >
          <Image
            source={require("../assets/images/Global-images/notification-icon.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#664229",
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
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#664229",
    paddingVertical: 5,
    width: "100%",
    position: "absolute",
    top: 50,
    zIndex: 9,
  },
  navButton: {
    paddingHorizontal: 5,
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  textArea: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starButton: {
    padding: 5,
  },
  filledStar: {
    fontSize: 24,
    color: "#FFD700",
  },
  emptyStar: {
    fontSize: 24,
    color: "#ccc",
  },
  submitButton: {
    backgroundColor: "#664229",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#664229",
    // opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    // backgroundColor: "#664229",
  },
  submitStatus: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "#D2B48C",
  },
  footerButton: {
    alignItems: "center",
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
});

export default SuggestionsForm;
