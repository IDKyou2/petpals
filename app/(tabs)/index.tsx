// -------------------------------------------- Page navigations and names --------------------------------------------//

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../../components/LoadingScreen";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import TermsModal from "../../components/TermsCondition";
import ChooseDestination from "../../components/ChooseDestination";
import ProfileUser from "../../components/ProfileUser";
import LostDogForm from "../../components/LostDogForm";
import ViewLostDogFormAfter from "../../components/ViewLostDogFormAfter";
import LostDogPage from "../../components/LostDogPage";
import FoundDogForm from "../../components/FoundDogForm";
import ViewFoundDogFormAfter from "../../components/ViewFoundDogFormAfter";
import FoundDogPage from "../../components/FoundDogPage";
import LostAndFoundDogMatched from "../../components/MatchPage";
import ChatForum from "../../components/ChatForum";
import PrivateChat from "../../components/PrivateChat";
import LostDogViewUserInfo from "../../components/LostDogViewUserInfo";
import FoundDogViewUserInfo from "../../components/FoundDogViewUserInfo";
import LostAndFoundViewMatchedUser from "../../components/LostAndFoundViewMatchedUser";
import ViewLostAndFoundSuggestions from "../../components/ViewLostAndFoundSuggestions";
import SuggestionsForm from "../../components/SuggestionsForm";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

interface FormData {
  name?: string;
  breed: string;
  size: string;
  details: string;
  gender: string;
  location: string;
  image: {
    uri: string;
    type?: string;
    name?: string;
  } | null;
}

interface SuggestionData {
  suggestion: string;
  rating: number;
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    | "ChooseDestination"
    | "ProfileUser"
    | "LostDogForm"
    | "ViewLostDogFormAfter"
    | "LostDogPage"
    | "FoundDogForm"
    | "ViewFoundDogFormAfter"
    | "FoundDogPage"
    | "LostAndFoundDogMatched"
    | "ChatForum"
    | "PrivateChat"
    | "LostDogViewUserInfo"
    | "FoundDogViewUserInfo"
    | "LostAndFoundViewMatchedUser"
    | "LostAndFoundViewMatchedUserS"
    | "ViewLostAndFoundSuggestions"
    | "SuggestionsForm"
  >("ChooseDestination");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedDog, setSelectedDog] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newSuggestion, setNewSuggestion] = useState<SuggestionData | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        setCurrentScreen("ChooseDestination");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleFinishLoading = () => {
    setLoading(false);
  };

  const handleSignUpClick = () => {
    setIsTermsModalVisible(true);
  };

  const handleAcceptTerms = () => {
    setIsTermsModalVisible(false);
    setShowRegisterForm(true);
  };

  const handleLoginClick = () => {
    setShowRegisterForm(false);
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen("ChooseDestination");
  };

  const navigateToProfile = () => {
    setCurrentScreen("ProfileUser");
  };

  const navigateToHome = () => {
    setCurrentScreen("ChooseDestination");
    setFormData(null);
    setSelectedDog(null);
    setSelectedUser(null);
    setNewSuggestion(null);
  };

  const navigateToLostDogForm = () => {
    setCurrentScreen("LostDogForm");
    setFormData(null);
  };

  const navigateToFoundDogForm = () => {
    setCurrentScreen("FoundDogForm");
    setFormData(null);
  };

  const navigateToLostAndFoundDogMatched = () => {
    setCurrentScreen("LostAndFoundDogMatched");
  };

  const navigateToLostAndFoundViewMatchedUser = (dog: any) => {
    console.log("Setting currentScreen to LostAndFoundViewMatchedUser");
    setSelectedDog(dog);
    setCurrentScreen("LostAndFoundViewMatchedUser");
  };

  const navigateToViewLostDogFormAfter = (data: FormData) => {
    setFormData(data);
    setCurrentScreen("ViewLostDogFormAfter");
  };

  const navigateToViewFoundDogFormAfter = (data: FormData) => {
    setFormData(data);
    setCurrentScreen("ViewFoundDogFormAfter");
  };

  const navigateToLostDogPage = () => {
    setCurrentScreen("LostDogPage");
    setFormData(null);
    setSelectedDog(null);
  };

  const navigateToFoundDogPage = () => {
    setCurrentScreen("FoundDogPage");
    setFormData(null);
    setSelectedDog(null);
  };

  const navigateToMatchedPage = () => {
    // -------------------------------------------- Matched page --------------------------------------------//
    setCurrentScreen("LostAndFoundDogMatched");
    setFormData(null);
    setSelectedDog(null);
  };

  const navigateToChatForum = () => {
    setCurrentScreen("ChatForum");
    setFormData(null);
    setSelectedDog(null);
    setSelectedUser(null);
  };

  const navigateToPrivateChat = (user: any) => {
    setSelectedUser(user);
    setCurrentScreen("PrivateChat");
  };

  const navigateToFoundDogViewUserInfo = (dog: any) => {
    console.log("Setting currentScreen to FoundDogViewUserInfo");
    setSelectedDog(dog);
    setCurrentScreen("FoundDogViewUserInfo");
  };

  const navigateToLostDogViewUserInfo = (dog: any) => {
    setSelectedDog(dog);
    setCurrentScreen("LostDogViewUserInfo");
  };

  const navigateToViewLostAndFoundSuggestions = (data?: SuggestionData) => {
    setNewSuggestion(data || null);
    setCurrentScreen("ViewLostAndFoundSuggestions");
    setFormData(null);
    setSelectedDog(null);
    setReloadTrigger((prev) => prev + 1);
  };

  const navigateToSuggestionsForm = () => {
    setCurrentScreen("SuggestionsForm");
    setFormData(null);
    setSelectedDog(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen("ChooseDestination");
    setFormData(null);
    setSelectedDog(null);
    setSelectedUser(null);
    setNewSuggestion(null);
    setReloadTrigger(0);
    AsyncStorage.removeItem("token");
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <LoadingScreen onFinishLoading={handleFinishLoading} />
      ) : showRegisterForm ? (
        <RegisterForm onLoginClick={handleLoginClick} />
      ) : isLoggedIn ? (
        currentScreen === "ChooseDestination" ? (
          <ProtectedRoute
            component={ChooseDestination}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onBackClick={handleLogout}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogForm={navigateToLostDogForm}
            onNavigateToFoundDogForm={navigateToFoundDogForm}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
          />
        ) : currentScreen === "ProfileUser" ? (
          <ProtectedRoute
            component={ProfileUser}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "LostDogForm" ? (
          <ProtectedRoute
            component={LostDogForm}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToViewLostDogFormAfter={navigateToViewLostDogFormAfter}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "ViewLostDogFormAfter" ? (
          <ProtectedRoute
            component={ViewLostDogFormAfter}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogForm={navigateToLostDogForm}
            formData={formData}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "LostDogPage" ? (
          <ProtectedRoute
            component={LostDogPage}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onLogout={handleLogout}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToLostDogForm={navigateToLostDogForm}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToLostDogViewUserInfo={navigateToLostDogViewUserInfo}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
          />
        ) : currentScreen === "FoundDogForm" ? (
          <ProtectedRoute
            component={FoundDogForm}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToViewFoundDogFormAfter={navigateToViewFoundDogFormAfter}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "ViewFoundDogFormAfter" ? (
          <ProtectedRoute
            component={ViewFoundDogFormAfter}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToFoundDogForm={navigateToFoundDogForm}
            formData={formData}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
          />
        ) : currentScreen === "FoundDogPage" ? (
          <ProtectedRoute
            component={FoundDogPage}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onLogout={handleLogout}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToFoundDogForm={navigateToFoundDogForm}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToFoundDogViewUserInfo={navigateToFoundDogViewUserInfo}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
          />
        ) : currentScreen === "LostAndFoundDogMatched" ? (
          // -------------------------------------------- Matched page --------------------------------------------//
          <ProtectedRoute
            component={LostAndFoundDogMatched}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onLogout={handleLogout}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToLostDogViewUserInfo={navigateToLostDogViewUserInfo}
            onNavigateToLostAndFoundViewMatchedUser={navigateToLostAndFoundViewMatchedUser}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
            onNavigateToSuggestionsForm={navigateToSuggestionsForm}
          />
        ) : currentScreen === "ChatForum" ? (
          <ProtectedRoute
            component={ChatForum}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToPrivateChat={navigateToPrivateChat}
          />
        ) : currentScreen === "PrivateChat" ? (
          <ProtectedRoute
            component={PrivateChat}
            user={selectedUser}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToChatForum={navigateToChatForum}
            onLogout={handleLogout}
          />
        ) : currentScreen === "LostDogViewUserInfo" ? (
          <ProtectedRoute
            component={LostDogViewUserInfo}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            dog={selectedDog}
          />
        ) : currentScreen === "FoundDogViewUserInfo" ? (
          <ProtectedRoute
            component={FoundDogViewUserInfo}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            dog={selectedDog}
          />
        ) : currentScreen === "LostAndFoundViewMatchedUser" ? (
          <ProtectedRoute
            component={LostAndFoundViewMatchedUser}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostAndFoundDogMatched={navigateToLostAndFoundDogMatched}
            onLogout={handleLogout}
            onNavigateToChatForum={navigateToChatForum}
            dog={selectedDog}
          />
        ) : currentScreen === "ViewLostAndFoundSuggestions" ? (
          <ProtectedRoute
            component={ViewLostAndFoundSuggestions}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToMatchedPage={navigateToMatchedPage}
            onNavigateToChatForum={navigateToChatForum}
            onLogout={handleLogout}
            reloadTrigger={reloadTrigger}
            newSuggestion={newSuggestion}
          />
        ) : currentScreen === "SuggestionsForm" ? (
          <ProtectedRoute
            component={SuggestionsForm}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={navigateToHome}
            onNavigateToProfile={navigateToProfile}
            onNavigateToLostDogPage={navigateToLostDogPage}
            onNavigateToFoundDogPage={navigateToFoundDogPage}
            onNavigateToChatForum={navigateToChatForum}
            onNavigateToViewLostAndFoundSuggestions={navigateToViewLostAndFoundSuggestions}
            onBackClick={handleLogout}
          />
        ) : null
      ) : (
        <LoginForm
          onSignUpClick={handleSignUpClick}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      <TermsModal
        visible={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
        onAccept={handleAcceptTerms}
      />
    </View>
  );
};

export default App;