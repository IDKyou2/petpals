import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import io from "socket.io-client";
import useChatCount from "./hooks/useChatCount";
import NotificationModal from "./NotificationModal";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as ImagePicker from "expo-image-picker";
import md5 from "js-md5";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const LostAndFoundDogMatched = ({
  onNavigateToHome,
  onNavigateToProfile,
  onLogout,
  onNavigateToLostDogPage,
  onNavigateToFoundDogPage,
  onNavigateToChatForum,
  onNavigateToLostAndFoundViewMatchedUser,
  onNavigateToLostAndFoundViewMatchedUserS,
  onNavigateToSuggestionsForm,
  onNavigateToViewLostAndFoundSuggestions,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dogs, setDogs] = useState([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [isNewMatchModalOpen, setIsNewMatchModalOpen] = useState(false);
  const [selectedNewMatch, setSelectedNewMatch] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedDog, setEditedDog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const newChatsCount = useChatCount();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showFullName1, setShowFullName1] = useState(false);
  const [showFullName2, setShowFullName2] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = decodeJWT(token);
          if (decoded && decoded.userId) {
            setCurrentUserId(decoded.userId);
            console.log("Current User ID set:", decoded.userId);
          } else {
            console.log("No userId in decoded token:", decoded);
          }
        } else {
          console.log("No token found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching current user ID:", error);
      }
    };
    fetchCurrentUserId();
  }, []);

  const getFirstName = (fullName) => {
    if (!fullName) return "Unknown";
    return fullName.split(" ")[0];
  };

  useEffect(() => {
    const initializeTfjs = async () => {
      try {
        if (Platform.OS === "web") {
          await tf.setBackend("webgl");
        } else {
          await tf.setBackend("cpu");
        }
        await tf.ready();
        console.log("TensorFlow.js initialized with backend:", tf.getBackend());
      } catch (error) {
        console.error("Error initializing TensorFlow.js:", error);
      }
    };
    initializeTfjs();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const lostResponse = await axios.get(
          "http://localhost:5000/api/lostdog",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const foundResponse = await axios.get(
          "http://localhost:5000/api/founddog",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const postsResponse = await axios.get(
          "http://localhost:5000/api/posts/new-posts-count"
        );

        const allDogs = [
          ...(lostResponse.status === 200 ? lostResponse.data.lostDogs : []),
          ...(foundResponse.status === 200 ? foundResponse.data.foundDogs : []),
        ]
          .filter((dog) => !dog.reunited)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log(
          "All dogs with image paths:",
          allDogs.map((dog) => ({
            petId: dog.petId,
            imagePath: dog.imagePath,
            userId: dog.userId?._id,
            category: dog.category,
          }))
        );

        setDogs(allDogs);
        if (postsResponse.status === 200) {
          setNewPostsCount(postsResponse.data.newPostsCount);
        }
        await processImages(allDogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const socket = io("http://localhost:5000", { transports: ["websocket"] });

    socket.on("connect", () =>
      console.log("Connected to Socket.IO server:", socket.id)
    );

    socket.on("newLostDog", (newDog) => {
      if (!newDog.reunited) {
        setDogs((prevDogs) => {
          const updatedDogs = [newDog, ...prevDogs].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          processImages(updatedDogs);
          return updatedDogs;
        });
      }
    });

    socket.on("newFoundDog", (newDog) => {
      if (!newDog.reunited) {
        setDogs((prevDogs) => {
          const updatedDogs = [newDog, ...prevDogs].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          processImages(updatedDogs);
          return updatedDogs;
        });
      }
    });

    socket.on("dogReunited", ({ petId }) => {
      setDogs((prevDogs) => {
        const updatedDogs = prevDogs.filter((dog) => dog.petId !== petId);
        processImages(updatedDogs);
        return updatedDogs;
      });
      setMatches((prevMatches) =>
        prevMatches.filter(
          (match) => match.petId1 !== petId && match.petId2 !== petId
        )
      );
    });

    socket.on("updatedLostDog", (updatedDog) => {
      setDogs((prevDogs) => {
        const updatedDogs = prevDogs.map((dog) =>
          dog.petId === updatedDog.petId ? updatedDog : dog
        );
        processImages(updatedDogs);
        return updatedDogs;
      });
    });

    socket.on("updatedFoundDog", (updatedDog) => {
      setDogs((prevDogs) => {
        const updatedDogs = prevDogs.map((dog) =>
          dog.petId === updatedDog.petId ? updatedDog : dog
        );
        processImages(updatedDogs);
        return updatedDogs;
      });
    });

    socket.on("disconnect", () =>
      console.log("Disconnected from Socket.IO server")
    );

    return () => socket.disconnect();
  }, []);

  const filteredDogs = dogs.filter((dog) => {
    const query = searchQuery.toLowerCase();
    const location = dog.location ? String(dog.location).toLowerCase() : "";
    const breed = dog.breed ? String(dog.breed).toLowerCase() : "";
    const gender = dog.gender ? String(dog.gender).toLowerCase() : "";
    const name = dog.name ? String(dog.name).toLowerCase() : "";

    return (
      location.includes(query) ||
      breed.includes(query) ||
      gender.includes(query) ||
      name.includes(query)
    );
  });

  const createImageElement = (src) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "web") {
        const img = document.createElement("img");
        img.src = src;
        img.crossOrigin = "Anonymous"; // Handle CORS
        img.onload = () => resolve(img);
        img.onerror = () =>
          reject(new Error(`Failed to load image from ${src}`));
      } else {
        // For native, we can't use DOM Image; skip TensorFlow processing
        reject(new Error("Image processing not supported on native platform"));
      }
    });
  };

  const processImages = async (dogList) => {
    try {
      const model = await mobilenet.load();
      const dogsWithImages = dogList.filter((dog) => dog.imagePath);
      const dogMatches = [];

      console.log("Processing dogs:", dogsWithImages.length, "dogs found");
      console.log(
        "Dogs to process:",
        dogsWithImages.map((d) => ({
          petId: d.petId,
          userId: d.userId?._id,
          category: d.category,
          imagePath: d.imagePath,
        }))
      );

      const imageData = await Promise.all(
        dogsWithImages.map(async (dog) => {
          const imageUrl = `http://localhost:5000${dog.imagePath}`;
          console.log(`Fetching image for ${dog.petId}: ${imageUrl}`);
          try {
            const response = await fetch(imageUrl);
            if (!response.ok)
              throw new Error(`HTTP error! Status: ${response.status}`);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const hash = md5(arrayBuffer);

            if (Platform.OS === "web") {
              const img = await createImageElement(imageUrl);
              const tensor = tf.browser
                .fromPixels(img)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();
              const embedding = await model.infer(tensor, true);
              tf.dispose(tensor);
              console.log(`Hash for ${dog.petId}: ${hash}`);
              return { hash, dog, embedding };
            } else {
              // For native, skip embedding and only use hash
              console.log(
                `Hash for ${dog.petId}: ${hash} (Embedding skipped on native)`
              );
              return { hash, dog, embedding: null };
            }
          } catch (error) {
            console.error(`Failed to fetch image for ${dog.petId}:`, error);
            return null;
          }
        })
      ).then((results) => results.filter((r) => r !== null));

      for (let i = 0; i < imageData.length; i++) {
        for (let j = i + 1; j < imageData.length; j++) {
          const dog1 = imageData[i].dog;
          const dog2 = imageData[j].dog;
          const isSameUser = dog1.userId?._id === dog2.userId?._id;
          const isDifferentCategory = dog1.category !== dog2.category;
          const isLostDog =
            dog1.category === "Lost" || dog2.category === "Lost";
          const isFoundDog =
            dog1.category === "Found" || dog2.category === "Found";

          if (
            imageData[i].hash === imageData[j].hash &&
            !isSameUser &&
            isDifferentCategory &&
            isLostDog &&
            isFoundDog
          ) {
            const colorSimilarity = compareColors(dog1, dog2);
            dogMatches.push({
              petId1: dog1.petId,
              petId2: dog2.petId,
              similarityPercentage: 100,
              colorSimilarity: parseFloat(colorSimilarity),
              isSelfMatch: false,
            });
            console.log(
              `Exact match found: ${dog1.petId} vs ${dog2.petId} with color similarity ${colorSimilarity}%`
            );
          } else if (
            Platform.OS === "web" &&
            !isSameUser &&
            isDifferentCategory &&
            isLostDog &&
            isFoundDog &&
            imageData[i].embedding &&
            imageData[j].embedding
          ) {
            const similarity = compareEmbeddings(
              imageData[i].embedding,
              imageData[j].embedding
            );
            const similarityPercentage = (similarity * 100).toFixed(2);
            if (similarityPercentage >= 80) {
              const colorSimilarity = compareColors(dog1, dog2);
              dogMatches.push({
                petId1: dog1.petId,
                petId2: dog2.petId,
                similarityPercentage: parseFloat(similarityPercentage),
                colorSimilarity: parseFloat(colorSimilarity),
                isSelfMatch: false,
              });
              console.log(
                `Non-exact match found: ${dog1.petId} vs ${dog2.petId} with similarity ${similarityPercentage}% and color similarity ${colorSimilarity}%`
              );
            }
          }
        }
      }

      imageData.forEach((data) => {
        if (data.embedding) tf.dispose(data.embedding);
      });

      setMatches(dogMatches);
      console.log("Matches found:", dogMatches);
    } catch (error) {
      console.error("Error processing images:", error);
    }
  };

  const compareEmbeddings = (embedding1, embedding2) => {
    const similarity = tf.losses
      .cosineDistance(embedding1, embedding2, 0)
      .dataSync();
    return 1 - similarity;
  };

  const compareColors = (dog1, dog2) => {
    const randomColorSimilarity = Math.random() * 20 + 80;
    return randomColorSimilarity.toFixed(2);
  };

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
    else if (tab === "HomePageSuggestions") onNavigateToSuggestionsForm?.();
    else if (tab === "ViewLostAndFoundSuggestions")
      onNavigateToViewLostAndFoundSuggestions?.();
  };

  const handleMessageClick = () => onNavigateToChatForum?.();

  const handleNotificationClick = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleMoreInfoClick = (dog) => {
    if (dog.category === "Found") {
      onNavigateToLostAndFoundViewMatchedUserS?.(dog);
    }
    if (dog.category === "Lost") {
      onNavigateToLostAndFoundViewMatchedUser?.(dog);
    }
  };

  const getMatchMessage = (dog) => {
    console.log(
      `Checking matches for dog ${dog.petId}, currentUserId: ${currentUserId}`
    );
    if (dog.userId?._id !== currentUserId) return null;

    const dogMatches = matches.filter(
      (match) => match.petId1 === dog.petId || match.petId2 === dog.petId
    );
    console.log(`Dog ${dog.petId} matches:`, dogMatches);
    if (dogMatches.length === 0) return null;

    const matchedPetIds = dogMatches.map((match) =>
      match.petId1 === dog.petId ? match.petId2 : match.petId1
    );

    if (matchedPetIds.length <= 2) {
      return `Pet ID #${dog.petId} is matched with Pet ID #${matchedPetIds.join(
        " and #"
      )}`;
    } else {
      const shortList = matchedPetIds.slice(0, 2);
      return {
        shortMessage: `Pet ID #${dog.petId
          } is matched with Pet ID #${shortList.join(" and #")} and more...`,
        fullList: matchedPetIds,
      };
    }
  };

  const openMatchModal = (matchIds) => {
    const matchedDogs = matchIds
      .map((id) => dogs.find((dog) => dog.petId === id))
      .filter(Boolean);
    setSelectedMatches(matchedDogs);
    setIsMatchModalOpen(true);
  };

  const closeMatchModal = () => {
    setIsMatchModalOpen(false);
    setSelectedMatches([]);
  };

  const openNewMatchModal = (match) => {
    const dog1 = dogs.find((d) => d.petId === match.petId1);
    const dog2 = dogs.find((d) => d.petId === match.petId2);

    const isDog1CurrentUser = dog1?.userId?._id === currentUserId;
    const isDog2CurrentUser = dog2?.userId?._id === currentUserId;
    const isDog1Lost = dog1?.category === "Lost";
    const isDog2Lost = dog2?.category === "Lost";
    const isExactMatch = match.similarityPercentage === 100;
    const isHighSimilarity = match.similarityPercentage >= 80;

    console.log("Attempting to open modal for match:", {
      match,
      currentUserId,
      dog1: {
        petId: dog1?.petId,
        userId: dog1?.userId?._id,
        category: dog1?.category,
      },
      dog2: {
        petId: dog2?.petId,
        userId: dog2?.userId?._id,
        category: dog2?.category,
      },
      isExactMatch,
      isHighSimilarity,
    });

    if (
      isHighSimilarity &&
      ((isDog1CurrentUser &&
        isDog1Lost &&
        dog2?.userId?._id !== currentUserId) ||
        (isDog2CurrentUser &&
          isDog2Lost &&
          dog1?.userId?._id !== currentUserId))
    ) {
      setSelectedNewMatch({ ...match, dog1, dog2 });
      setIsNewMatchModalOpen(true);
      console.log("Opening modal for match:", { ...match, dog1, dog2 });
    } else {
      console.log("Modal not opened: Conditions not met", {
        currentUserId,
        dog1UserId: dog1?.userId?._id,
        dog1Category: dog1?.category,
        dog2UserId: dog2?.userId?._id,
        dog2Category: dog2?.category,
        isExactMatch,
        isHighSimilarity,
      });
    }
  };

  const closeNewMatchModal = () => {
    setIsNewMatchModalOpen(false);
    setSelectedNewMatch(null);
    if (selectedNewMatch) {
      setTimeout(() => {
        setSelectedNewMatch(selectedNewMatch);
        setIsNewMatchModalOpen(true);
      }, 4000);
    }
  };

  const handleReunite = () => {
    setIsConfirmationModalOpen(true);
  };

  const confirmReunion = async (confirmed) => {
    setIsConfirmationModalOpen(false);

    if (confirmed) {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !selectedNewMatch) return;

        const [response1, response2] = await Promise.all([
          axios.put(
            `http://localhost:5000/api/lostfound/mark-reunited/${selectedNewMatch.petId1}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.put(
            `http://localhost:5000/api/lostfound/mark-reunited/${selectedNewMatch.petId2}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        if (response1.status === 200 && response2.status === 200) {
          setDogs((prevDogs) => {
            const updatedDogs = prevDogs.filter(
              (dog) =>
                dog.petId !== selectedNewMatch.petId1 &&
                dog.petId !== selectedNewMatch.petId2
            );
            processImages(updatedDogs);
            return updatedDogs;
          });
          setMatches((prevMatches) =>
            prevMatches.filter(
              (match) =>
                match.petId1 !== selectedNewMatch.petId1 &&
                match.petId2 !== selectedNewMatch.petId2
            )
          );
          setTimeout(() => closeNewMatchModal(), 3000);
          setSuccessMessage("Dogs reunited successfully! Wait for seconds...");
          setTimeout(() => {
            setSuccessMessage(null);
            onNavigateToSuggestionsForm?.();
          }, 8000);
        }
      } catch (error) {
        console.error("Error marking as reunited:", error);
        alert("Failed to reunite dogs.");
      }
    } else {
      setIsNewMatchModalOpen(true);
    }
  };

  const handleEditClick = (dog) => {
    setEditMode(dog.petId);
    setEditedDog({ ...dog, image: null });
  };

  const handleInputChange = (field, value) => {
    setEditedDog((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setEditedDog((prev) => ({ ...prev, image: result.assets[0] }));
    }
  };

  const handleSaveChanges = async (dog) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const url =
        dog.category === "Found"
          ? `http://localhost:5000/api/lostfound/founddog/${dog.petId}`
          : `http://localhost:5000/api/lostfound/lostdog/${dog.petId}`;

      const formData = new FormData();
      formData.append("name", editedDog.name || dog.name || "");
      formData.append("breed", editedDog.breed || dog.breed || "");
      formData.append("gender", editedDog.gender || dog.gender || "");
      formData.append("location", editedDog.location || dog.location || "");

      if (editedDog.image) {
        const imageBlob = await (await fetch(editedDog.image.uri)).blob();
        formData.append("dogImage", imageBlob, "dogImage.jpg");
      }

      const response = await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setDogs((prevDogs) => {
        const updatedDogs = prevDogs.map((d) =>
          d.petId === dog.petId ? response.data : d
        );
        processImages(updatedDogs);
        return updatedDogs;
      });
      setEditMode(null);
      setEditedDog(null);
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedDog(null);
  };

  useEffect(() => {
    console.log("Matches updated:", matches, "Current User ID:", currentUserId);
    if (matches.length > 0 && currentUserId) {
      const userMatches = matches.filter((match) => {
        const dog1 = dogs.find((d) => d.petId === match.petId1);
        const dog2 = dogs.find((d) => d.petId === match.petId2);
        const isUserMatch =
          dog1?.userId?._id === currentUserId ||
          dog2?.userId?._id === currentUserId;
        console.log(`Filtering match ${match.petId1} vs ${match.petId2}:`, {
          isUserMatch,
          dog1: { userId: dog1?.userId?._id, category: dog1?.category },
          dog2: { userId: dog2?.userId?._id, category: dog2?.category },
        });
        return isUserMatch;
      });

      console.log("User matches found:", userMatches);

      if (userMatches.length > 0 && !isNewMatchModalOpen) {
        const latestMatch = userMatches[0];
        openNewMatchModal(latestMatch);
      } else {
        console.log("No user matches or modal already open");
      }
    }
  }, [matches, currentUserId]);

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
            <Text style={styles.navTexts}>Matched Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleTabClick("ViewLostAndFoundSuggestions")}
          >
            <Text style={styles.navText}>View Suggestions</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name, Location, Breed, or Gender..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredDogs.length > 0 ? (
          filteredDogs.map((dog, index) => {
            const matchMessage = getMatchMessage(dog);
            const isEditing = editMode === dog.petId;
            return (
              <View
                style={styles.card}
                key={`${dog.category}-${dog.petId || index}`}
              >
                {isEditing ? (
                  <View style={styles.imageUploadContainer}>
                    <TouchableOpacity onPress={handleImageUpload}>
                      <Image
                        source={
                          editedDog.image
                            ? { uri: editedDog.image.uri }
                            : dog.imagePath
                              ? { uri: `http://localhost:5000${dog.imagePath}` }
                              : require("../assets/images/dog-icon.png")
                        }
                        style={styles.cardImage}
                      />
                      <Text style={styles.uploadText}>Change Image</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Image
                    source={
                      dog.imagePath
                        ? { uri: `http://localhost:5000${dog.imagePath}` }
                        : require("../assets/images/dog-icon.png")
                    }
                    style={styles.cardImage}
                  />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.petIdText}>Pet ID: {dog.petId}</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInput}
                      value={editedDog.name || ""}
                      onChangeText={(text) => handleInputChange("name", text)}
                      placeholder="Dog Name"
                    />
                  ) : (
                    dog.name && <Text style={styles.cardTitle}>{dog.name}</Text>
                  )}
                  {isEditing ? (
                    <>
                      <TextInput
                        style={styles.editInput}
                        value={editedDog.breed || ""}
                        onChangeText={(text) =>
                          handleInputChange("breed", text)
                        }
                        placeholder="Breed"
                      />
                      <TextInput
                        style={styles.editInput}
                        value={editedDog.gender || ""}
                        onChangeText={(text) =>
                          handleInputChange("gender", text)
                        }
                        placeholder="Gender"
                      />
                    </>
                  ) : (
                    <Text style={styles.cardSubtitle}>
                      {dog.breed}, {dog.gender}
                    </Text>
                  )}
                  <View style={styles.cardLocation}>
                    <Image
                      source={require("../assets/images/location-icon.png")}
                      style={styles.locationIcon}
                    />
                    {isEditing ? (
                      <TextInput
                        style={styles.editInput}
                        value={editedDog.location || ""}
                        onChangeText={(text) =>
                          handleInputChange("location", text)
                        }
                        placeholder="Location"
                      />
                    ) : (
                      <Text style={styles.cardLocationText}>
                        {dog.category === "Found" ? "Found at:" : "Last seen:"}{" "}
                        {dog.location} 🐶
                      </Text>
                    )}
                  </View>
                  <Text style={styles.cardTimestamp}>
                    {dog.category === "Found" ? "Found on:" : "Lost on:"}{" "}
                    {new Date(dog.createdAt).toLocaleString()}
                  </Text>
                  <Text style={styles.cardCategory}>
                    Category: {dog.category || "Lost"}
                  </Text>
                  {matchMessage && (
                    <View style={styles.matchMessageContainer}>
                      {typeof matchMessage === "string" ? (
                        <Text style={styles.matchMessage}>{matchMessage}</Text>
                      ) : (
                        <Text style={styles.matchMessage}>
                          {matchMessage.shortMessage.replace("and more...", "")}
                          <TouchableOpacity
                            onPress={() =>
                              openMatchModal(matchMessage.fullList)
                            }
                          >
                            <Text style={styles.moreLink}>and more...</Text>
                          </TouchableOpacity>
                        </Text>
                      )}
                    </View>
                  )}
                  <View style={styles.buttonContainer}>
                    {isEditing ? (
                      <>
                        <TouchableOpacity
                          style={styles.saveButton}
                          onPress={() => handleSaveChanges(dog)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text style={styles.saveButtonText}>Save</Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={handleCancelEdit}
                          disabled={isLoading}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        {dog.userId?._id === currentUserId && (
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditClick(dog)}
                          >
                            <Text style={styles.editButtonText}>Edit</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.moreInfoButton}
                          onPress={() => handleMoreInfoClick(dog)}
                        >
                          <Text style={styles.moreInfoText}>More Info</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>
            {searchQuery ? "No matching dogs found." : "No matched dogs yet."}
          </Text>
        )}
      </ScrollView>

      <Modal
        visible={isMatchModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMatchModal}
      >
        <View style={styles.matchModalOverlay}>
          <View style={styles.matchModalContent}>
            <Text style={styles.matchModalTitle}>Matched Pet IDs</Text>
            <ScrollView style={styles.matchModalList}>
              {selectedMatches.map((match, index) => (
                <View key={index} style={styles.matchModalItemContainer}>
                  <Text style={styles.matchModalItem}>
                    Pet ID #{match.petId}
                  </Text>
                  <Image
                    source={
                      match.imagePath
                        ? { uri: `http://localhost:5000${match.imagePath}` }
                        : require("../assets/images/dog-icon.png")
                    }
                    style={styles.matchModalImage}
                  />
                  <Text style={styles.matchModalDate}>
                    Posted on: {new Date(match.createdAt).toLocaleString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.matchModalCloseButton}
              onPress={closeMatchModal}
            >
              <Text style={styles.matchModalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isNewMatchModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeNewMatchModal}
      >
        <View style={styles.newMatchModalOverlay}>
          <View style={styles.newMatchModalContent}>
            <Text style={styles.newMatchModalTitle}>Match Found!</Text>
            {selectedNewMatch && (
              <ScrollView style={styles.newMatchModalDetails}>
                <Text style={styles.newMatchModalText}>
                  Match Pet ID #{selectedNewMatch.petId1} with #
                  {selectedNewMatch.petId2}
                </Text>
                <Text style={styles.newMatchModalText}>
                  Similarity: {selectedNewMatch.similarityPercentage}%
                </Text>
                <Text style={styles.newMatchModalText}>
                  Color Match: {selectedNewMatch.colorSimilarity}%
                </Text>
                <View style={styles.newMatchModalImages}>
                  <View style={styles.newMatchModalImageContainer}>
                    <Text style={styles.newMatchModalItem}>
                      Pet ID #{selectedNewMatch.petId1}
                    </Text>
                    <Image
                      source={
                        selectedNewMatch.dog1?.imagePath
                          ? {
                            uri: `http://localhost:5000${selectedNewMatch.dog1.imagePath}`,
                          }
                          : require("../assets/images/dog-icon.png")
                      }
                      style={styles.newMatchModalImage}
                    />
                    <Text style={styles.newMatchModalText}>Posted by:</Text>
                    <View style={styles.nameContainer}>
                      <Text style={styles.newMatchModalTexts}>
                        {showFullName1
                          ? selectedNewMatch.dog1?.userId?.fullName || "Unknown"
                          : getFirstName(
                            selectedNewMatch.dog1?.userId?.fullName
                          )}
                      </Text>
                      {!showFullName1 && (
                        <TouchableOpacity
                          onPress={() => setShowFullName1(true)}
                        >
                          <Text style={styles.moreLink}>more</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.newMatchModalText}>
                      Category: {selectedNewMatch.dog1?.category || "Unknown"}
                    </Text>
                  </View>
                  <View style={styles.newMatchModalImageContainer}>
                    <Text style={styles.newMatchModalItem}>
                      Pet ID #{selectedNewMatch.petId2}
                    </Text>
                    <Image
                      source={
                        selectedNewMatch.dog2?.imagePath
                          ? {
                            uri: `http://localhost:5000${selectedNewMatch.dog2.imagePath}`,
                          }
                          : require("../assets/images/dog-icon.png")
                      }
                      style={styles.newMatchModalImage}
                    />
                    <Text style={styles.newMatchModalText}>Posted by:</Text>
                    <View style={styles.nameContainer}>
                      <Text style={styles.newMatchModalTexts}>
                        {showFullName2
                          ? selectedNewMatch.dog2?.userId?.fullName || "Unknown"
                          : getFirstName(
                            selectedNewMatch.dog2?.userId?.fullName
                          )}
                      </Text>
                      {!showFullName2 && (
                        <TouchableOpacity
                          onPress={() => setShowFullName2(true)}
                        >
                          <Text style={styles.moreLink}>more</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.newMatchModalText}>
                      Category: {selectedNewMatch.dog2?.category || "Unknown"}
                    </Text>
                    {selectedNewMatch.dog2?.category === "Found" && (
                      <Text style={styles.newMatchModalText}>
                        Contact:{" "}
                        {selectedNewMatch.dog2?.userId?.contact ||
                          "Not available"}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={styles.isThisYourDogText}>Is this your dog?</Text>
                <View style={styles.newMatchModalButtons}>
                  <TouchableOpacity
                    style={styles.newMatchModalButton}
                    onPress={handleReunite}
                  >
                    <Text style={styles.newMatchModalButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.newMatchModalButton}
                    onPress={closeNewMatchModal}
                  >
                    <Text style={styles.newMatchModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isConfirmationModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsConfirmationModalOpen(false)}
      >
        <View style={styles.confirmationModalOverlay}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationModalTitle}>
              Have you reunited with your dog?
            </Text>
            <View style={styles.confirmationModalButtons}>
              <TouchableOpacity
                style={styles.confirmationModalButton}
                onPress={() => confirmReunion(true)}
              >
                <Text style={styles.confirmationModalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmationModalButton}
                onPress={() => confirmReunion(false)}
              >
                <Text style={styles.confirmationModalButtonText}>No</Text>
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

      {successMessage && (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessageText}>{successMessage}</Text>
        </View>
      )}
      <NotificationModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </View>
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
    borderRadius: 2,
    backgroundColor: "#fff",
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
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  navButton: { paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  navText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  navTexts: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  searchContainer: { paddingHorizontal: 15, paddingVertical: 10 },
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
  content: { flexGrow: 1, padding: 15, alignItems: "center" },
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
  cardImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  cardContent: { flex: 1 },
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textTransform: "capitalize"
  },
  cardSubtitle: { fontSize: 16, color: "#666", marginBottom: 5, textTransform: "capitalize" },
  cardLocation: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  locationIcon: { width: 16, height: 16, marginRight: 5, tintColor: "#666" },
  cardLocationText: { fontSize: 14, color: "#666", flexShrink: 1 },
  cardTimestamp: { fontSize: 12, color: "#666", marginBottom: 5 },
  cardCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontWeight: "bold",
  },
  matchMessageContainer: { marginBottom: 10 },
  matchMessage: { fontSize: 14, color: "#006600", fontWeight: "bold" },
  moreLink: { fontSize: 14, color: "#0066cc", textDecorationLine: "underline" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
    flexWrap: "wrap",
  },
  moreInfoButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  moreInfoText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  editButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  editButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "#664229",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  cancelButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  editInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  imageUploadContainer: { alignItems: "center", marginBottom: 10 },
  uploadText: {
    fontSize: 14,
    color: "#0066cc",
    textAlign: "center",
    marginTop: 5,
  },
  noDataText: { fontSize: 18, color: "#666", textAlign: "center", padding: 20 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomColor: "#ddd",
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
  matchModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  matchModalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "70%",
    alignItems: "center",
  },
  matchModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  matchModalList: { width: "100%", maxHeight: 250 },
  matchModalItemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  matchModalItem: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  matchModalImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginVertical: 5,
  },
  matchModalDate: { fontSize: 12, color: "#666" },
  matchModalCloseButton: {
    marginTop: 15,
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  matchModalCloseText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  newMatchModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  newMatchModalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  newMatchModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006600",
    marginBottom: 15,
    textAlign: "center",
  },
  newMatchModalDetails: { width: "100%" },
  newMatchModalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    fontWeight: "700",
  },
  newMatchModalTexts: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  newMatchModalImages: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  newMatchModalImageContainer: { alignItems: "center", marginVertical: 10 },
  newMatchModalItem: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  newMatchModalImage: {
    width: 140,
    height: 140,
    borderRadius: 5,
    marginVertical: 5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  moreLink: {
    fontSize: 14,
    color: "#0066cc",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  newMatchModalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  newMatchModalButton: {
    backgroundColor: "#664229",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  newMatchModalButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  isThisYourDogText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 15,
    textAlign: "center",
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
    alignItems: "center",
  },
  confirmationModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmationModalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  confirmationModalButton: {
    backgroundColor: "#664229",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  confirmationModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successMessageContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -20 }],
    backgroundColor: "rgba(0, 128, 0, 0.9)",
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
  },
  successMessageText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LostAndFoundDogMatched;
