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
import { useRouter, Stack } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleAuth, {
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import MTLogo from "../assets/icons/MTLOGO.svg";
import MTWhiteLogo from "../assets/icons/MTWHITESVG.svg";
import GoogleIcon from "../assets/icons/google.png";
import * as WebBrowser from "expo-web-browser";

GoogleSignin.configure({
  webClientId:
    "279214582421-p2cbd0j2svemhh9ul06pnpmqppefis44.apps.googleusercontent.com",
  offlineAccess: true,
});

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleSignUp = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert("Success", "User created successfully");
      router.replace("/map", {
        animation: "none",
      });
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

      await auth().signInWithCredential(googleCredential);
      router.replace("/map", {
        animation: "none",
      });
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
      router.replace("/map", {
        animation: "none",
      });
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
          animation: "slide_from_right",
          headerShown: false,
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
          placeholder="Name"
          placeholderTextColor={isDarkMode ? "#888" : "#999"}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={[styles.inputNew, isDarkMode && styles.darkInput]}
          placeholder="Email Address"
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

        <TouchableOpacity style={styles.signUpButtonNew} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
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

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signIn")}>
            <Text style={styles.loginLink}>Log in</Text>
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
    borderColor: "#007AFF",
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
  toggleText: {
    marginTop: 16,
    color: "blue",
    textAlign: "center",
  },
  darkToggleText: {
    color: "#4287f5",
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
  footer: {
    marginTop: "auto",
    marginBottom: -15,
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
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginPromptText: {
    fontSize: 12,
    color: "gray",
  },
  loginLink: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
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
});

export default SignUpScreen;
