import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm = ({ onSignUpClick, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async () => {
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Username or password cannot be blank!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("token", response.data.token);
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess();
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "Incorrect username or password."
        );
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.loginFormContainer}>
        <View style={styles.loginLogo}>
          <Image
            source={require("../assets/images/Global-images/Logo-removebg.png")}
            style={styles.logoImage}
          />
        </View>

        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <View style={styles.loginForm}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.passwordIcon}
              disabled={isLoading}
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
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLoginSubmit}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingBarContainer}>
            <View style={styles.loadingBar} />
          </View>
        )}

        <Text style={styles.loginText}>
          Don't have an account?{" "}
          <TouchableOpacity onPress={onSignUpClick} disabled={isLoading}>
            <Text style={styles.signUpLinkButton}>Signup</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D2B48C",
  },
  loginFormContainer: {
    width: "80%",
    maxWidth: 400,
    minHeight: 350,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 20,
  },
  loginLogo: {
    marginBottom: 10,
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    opacity: 0.95,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  loginForm: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputWithIcon: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 16,
    paddingRight: 40,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  passwordIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  loginButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#664229",
    borderRadius: 4,
    alignItems: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#888",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
  },
  loginText: {
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },
  signUpLinkButton: {
    color: "#0066cc",
    textDecorationLine: "underline",
  },
  loadingBarContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#f1f1f1",
    marginTop: 15,
    borderRadius: 5,
    overflow: "hidden",
  },
  loadingBar: {
    height: "100%",
    backgroundColor: "#030303",
    width: "0%",
  },
});

export default LoginForm;