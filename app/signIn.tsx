import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  useColorScheme,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleAuth, {
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import MTLogo from "../assets/icons/MTLOGO.svg";
import MTWhiteLogo from "../assets/icons/MTWHITESVG.svg";
import GoogleIcon from "../assets/icons/google.png";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordResetAlert, setShowPasswordResetAlert] = useState(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleSignIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      router.replace("/map");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data || !userInfo.data.idToken) {
        throw new Error("Google Sign-In failed - no ID token");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data.idToken
      );

      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      router.replace("/map");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred during Google Sign-In"
      );
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("Apple Sign-In failed - no identify token returned");
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      await auth().signInWithCredential(appleCredential);
      router.replace("/map");
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        Alert.alert("Sign In Cancelled");
      } else {
        Alert.alert(
          "Sign In Error",
          "An error occurred during Apple Sign In. Please try again."
        );
      }
    }
  };

  const sendPasswordReset = async () => {
    try {
      await auth().sendPasswordReset(email);
      Alert.alert("Success", "Password reset email sent!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleTermsPress = () => {
    WebBrowser.openBrowserAsync(
      "https://www.munimtech.com/manhunt/termsofservice"
    );
  };

  const handlePrivacyPress = () => {
    WebBrowser.openBrowserAsync("https://www.munimtech.com/manhunt/privacy");
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkContainer]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <View style={styles.backButtonContent}>
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={isDarkMode ? "#fff" : "#000"}
                />
                <Text
                  style={[
                    styles.backButtonText,
                    isDarkMode && { color: "#fff" },
                  ]}
                >
                  Back
                </Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={styles.logoContainer}>
          {isDarkMode ? (
            <MTWhiteLogo style={styles.logo} width={200} height={40} />
          ) : (
            <MTLogo style={styles.logo} width={200} height={40} />
          )}
        </View>

        <TextInput
          style={[styles.inputNew, isDarkMode && styles.darkInput]}
          placeholder="Email"
          placeholderTextColor={isDarkMode ? "#888" : "#999"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.inputNew, isDarkMode && styles.darkInput]}
          placeholder="Password"
          placeholderTextColor={isDarkMode ? "#888" : "#999"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.signUpButtonNew} onPress={handleSignIn}>
          <Text style={styles.signUpButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View
          style={[styles.dividerContainer, { marginTop: 0, marginBottom: 20 }]}
        >
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={[styles.socialButton, isDarkMode && styles.darkSocialButton]}
          onPress={handleGoogleSignIn}
        >
          <View style={styles.socialButtonContent}>
            <Image source={GoogleIcon} style={styles.socialIcon} />
            <Text
              style={[
                styles.socialButtonText,
                isDarkMode && styles.darkSocialButtonText,
              ]}
            >
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>

        {appleAuth.isSupported && (
          <View style={styles.appleButtonWrapper}>
            <AppleButton
              buttonStyle={
                isDarkMode ? AppleButton.Style.WHITE : AppleButton.Style.BLACK
              }
              buttonType={AppleButton.Type.SIGN_IN}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => {
            Alert.alert(
              "Reset Password",
              "Enter your email address to receive a password reset link.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Send",
                  onPress: sendPasswordReset,
                },
              ]
            );
          }}
        >
          <Text
            style={[
              styles.forgotPasswordText,
              {
                textDecorationLine: "underline",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.termsText}>
          I accept Manhunt's{" "}
          <Text style={styles.link} onPress={handleTermsPress}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text style={styles.link} onPress={handlePrivacyPress}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  inputNew: {
    height: 52,
    borderColor: "#0066FF",
    borderWidth: 1,
    marginBottom: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "white",
  },
  darkInput: {
    borderColor: "#007AFF",
    color: "white",
    backgroundColor: "#333",
  },
  socialButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    height: 52,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  darkSocialButton: {
    backgroundColor: "#fff",
    borderWidth: 0,
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    color: "#000000",
    textAlign: "center",
    fontSize: 16,
  },
  darkSocialButtonText: {
    color: "#000000",
  },
  logoContainer: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    marginTop: 0,
    marginBottom: 100,
  },
  signUpButtonNew: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    height: 52,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "white",
    textAlign: "center",

    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  divider: {
    flex: 1,
    height: 0.35,
    backgroundColor: "lightgray",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "gray",
  },
  appleButtonWrapper: {
    marginHorizontal: 10,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 10,
  },
  appleButton: {
    height: 52,
    width: "100%",
  },
  backButton: {
    marginLeft: 0,
    padding: 4,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 17,
    color: "#000",
    marginLeft: 0,
  },
  forgotPasswordButton: {
    marginTop: 0,
    alignItems: "center",
    padding: 10,
  },
  forgotPasswordText: {
    fontSize: 12,
  },
  footer: {
    marginTop: "auto",
    marginBottom: 0,
    alignSelf: "center",
  },
  termsText: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});

export default SignInScreen;
