import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import e from "cors";

const RegisterForm = ({ onLoginClick }) => {
  const navigation = useNavigation();
  const [profilePic, setProfilePic] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow access to your photos to upload a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0]);
    }
  };

  // ------------------------------------------- Handle form submission and validation ------------------------------------------//
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!profilePic) {
      setError("Please upload profile picture.");
      return;
    }
    if (!username || !username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    // ------------------------------------------------------- Validate email ----------------------------------------------------
    // Validate email exists and isn't just whitespace
    if (!email?.trim()) {
      setError('Please enter your email address.');
      return;
    }

    // Remove all whitespace and trim
    const cleanEmail = email.replace(/\s+/g, '').trim();

    // Validate basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Invalid email format. (ex. user@email.com)');
      return;
    }

    // Validate specific domains
    const validDomains = ["@yahoo.com", "@gmail.com", "@hotmail.com"];
    const isValidDomain = validDomains.some(domain =>
      cleanEmail.toLowerCase().endsWith(domain.toLowerCase())
    );

    if (!isValidDomain) {
      setError('Please use Yahoo, Gmail, or Hotmail.');
      return;
    }


    // ------------------------------------------------------- Validate contact number ----------------------------------------------------
    if (!contact) {
      setError("Please enter your contact number.");
      return;
    } else if (contact.length < 11) {
      setError("Contact number must be atleast 11-digits.");
      return;
    }

    const phNumber = contact.replace(/\D/g, '');

    if (!/^(09|\+639)\d{9}$/.test(phNumber)) {
      setError("Invalid contact number. (ex. 09XXXXXXXXX)");
      return;
    }
    if (!password?.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (!confirmPassword?.trim()) {
      setError('Please enter confirm password.');
      return;
    }


    const formData = new FormData();
    const imageBlob = await (await fetch(profilePic.uri)).blob();
    formData.append(
      "profilePic",
      imageBlob,
      profilePic.fileName || "profile.jpg"
    );
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    console.log("FormData prepared for sending");
    for (let [key, value] of formData.entries()) {
      console.log(`FormData entry - ${key}:`, value);
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/register/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(`${data.message} Redirecting to login...`);
      setTimeout(() => onLoginClick(), 3000);
    } catch (err) {
      console.log("Axios error:", err);
      console.log("Server response (if any):", err.response?.data);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.registerFormContainer}>
          <View style={styles.registerLogo}>
            <Image
              source={require("../assets/images/Global-images/Logo-updated.png")}
              style={styles.logoImage}
            />
          </View>
          <TouchableOpacity
            style={styles.profilePicContainer}
            onPress={handleImageUpload}
          >
            <Image
              source={
                profilePic
                  ? { uri: profilePic.uri }
                  : require("../assets/images/Global-images/default-user.png")
              }
              style={styles.profilePic}
            />
            <Image
              source={require("../assets/images/Global-images/default-image-upload.png")}
              style={styles.uploadIcon}
            />
          </TouchableOpacity>
          <View style={styles.registerForm}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              // Removes spaces AS YOU TYPE
              onChangeText={(text) => setUsername(text.replace(/\s+/g, ''))}

            />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              // Removes spaces AS YOU TYPE
              onChangeText={(text) => setEmail(text.replace(/\s+/g, ''))}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number (ex. 09XXXXXXXXX)"
              value={contact}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                if (numericText.length <= 11) {
                  setContact(numericText);
                }
              }}
              keyboardType="number-pad"
              maxLength={11}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Password"
                value={password}
                // Removes spaces AS YOU TYPE
                onChangeText={(text) => setPassword(text.replace(/\s+/g, ''))}
                //onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.passwordIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Image
                  source={
                    passwordVisible
                      ? require("../assets/images/Global-images/hide-eyes-updated.png")
                      : require("../assets/images/Global-images/open-eyes-updated.png")
                  }
                  style={styles.iconImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Confirm password"
                value={confirmPassword}
                // Removes spaces AS YOU TYPE
                onChangeText={(text) => setConfirmPassword(text.replace(/\s+/g, ''))}
                //onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity
                style={styles.passwordIcon}
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Image
                  source={
                    confirmPasswordVisible
                      ? require("../assets/images/Global-images/hide-eyes-updated.png")
                      : require("../assets/images/Global-images/open-eyes-updated.png")
                  }
                  style={styles.iconImage}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSubmit}
            >
              <Text style={styles.registerButtonText}>Register now</Text>
            </TouchableOpacity>
            {success && <Text style={styles.successMessage}>{success}</Text>}
            {error && <Text style={styles.errorMessage}>{error}</Text>}
          </View>
          <Text style={styles.registerText}>
            Already part of our community?{" "}
            <TouchableOpacity onPress={onLoginClick}>
              <Text style={styles.registerSignUpLinkButton}>Login</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2B48C",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  registerFormContainer: {
    width: "80%",
    maxWidth: 400,
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 0,
  },
  registerLogo: {
    marginBottom: -50,
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  profilePicContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  uploadIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
  },
  registerForm: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    width: "90%",
    position: "relative",
    marginBottom: 15,
  },
  inputWithIcon: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 16,
    paddingRight: 40,
    backgroundColor: "#fff",
  },
  passwordIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  registerButton: {
    width: "90%",
    padding: 10,
    backgroundColor: "#664229",
    borderRadius: 4,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
  },
  registerText: {
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },
  registerSignUpLinkButton: {
    color: "#0066cc",
    textDecorationLine: "underline",
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  successMessage: {
    color: "#050505",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});

export default RegisterForm;
