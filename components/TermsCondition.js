import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    CheckBox,
    ScrollView,
} from "react-native";

const TermsModal = ({ visible, onClose, onAccept }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleNextButtonClick = () => {
        if (isChecked) {
            onAccept();
        }
    };


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Petpals Registration Terms and Agreements</Text>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>1. Introduction</Text>
                            <Text style={styles.sectionText}>
                                Welcome to Petpals, a mobile application designed to help track lost and found pet dogs using an image recognition algorithm. By signing up, you agree to the following terms and agreements...
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>2. Acceptance of Terms</Text>
                            <Text style={styles.sectionText}>
                                By creating an account, you confirm that you have read, understood, and accepted these terms. If you do not agree to any part of these terms, please refrain from using Petpals.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>3. Eligibility</Text>
                            <Text style={styles.sectionText}>
                                You must be at least 13 years old to create an account. By registering, you affirm that you meet this minimum age requirement.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4. Account Responsibilities</Text>
                            <Text style={styles.sectionText}>You are responsible for keeping your login credentials confidential.</Text>
                            <Text style={styles.sectionText}>Notify us immediately if you suspect unauthorized access to your account.</Text>
                            <Text style={styles.sectionText}>Petpals is not liable for any losses resulting from failure to secure your account.</Text>
                        </View>
                    </ScrollView>

                    <View style={styles.agreementCheckbox}>
                        <CheckBox value={isChecked} onValueChange={handleCheckboxChange} />
                        <Text style={styles.checkboxLabel}>I accept and understand the agreement.</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.nextButton, !isChecked && styles.nextButtonDisabled]}
                        onPress={handleNextButtonClick}
                        disabled={!isChecked}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: "#D2B48C",
        borderRadius: 8,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "black",
        borderRadius: 50,
        padding: 10,
        zIndex: 1,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    modalHeader: {
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalBody: {
        flex: 1,
        marginBottom: 20,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    sectionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    agreementCheckbox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "center",
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 14,
    },
    nextButton: {
        backgroundColor: "#030303",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    nextButtonDisabled: {
        backgroundColor: "#ccc",
    },
    nextButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default TermsModal;
