import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";

const map = () => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await auth().signOut();
            router.replace("/signUp");
          } catch (error) {
            console.error("Logout failed", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default map;
