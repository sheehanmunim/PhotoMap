import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme, Platform } from "react-native";
import ShieldDone from "../../assets/icons/map-point-06.svg";
import Filter from "../../assets/icons/Filter.svg";
import Map from "../../assets/icons/map.svg";
import TwoUser from "../../assets/icons/2 User.svg";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#ffffff",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#888888" : "#666666",
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#ffffff",
        },
        headerTintColor: colorScheme === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Game",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <ShieldDone width={size} height={size} stroke={color} />
          ),
        }}
      />
    </Tabs>
  );
}
