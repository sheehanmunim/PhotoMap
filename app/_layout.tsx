import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, useRouter, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import auth from "@react-native-firebase/auth";
import analytics from "@react-native-firebase/analytics";

SplashScreen.preventAutoHideAsync();

export function useScreenTracking(screenName: string) {
  const pathname = usePathname();

  useEffect(() => {
    const logScreenView = async () => {
      try {
        await analytics().logScreenView({
          screen_name: screenName,
          screen_class: screenName,
        });
        console.log("Screen view logged:", screenName);
      } catch (error) {
        console.error("Error logging screen view:", error);
      }
    };

    logScreenView();
  }, [screenName]);
}

export default function RootLayout() {
  useScreenTracking("RootLayout");
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    boolean | null
  >(null);
  const [isSplashReady, setIsSplashReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await new Promise((resolve) => {
          const unsubscribe = auth().onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
          });
        });

        setIsUserAuthenticated(!!user);

        await analytics().logEvent("auth_state_changed", {
          authenticated: !!user,
        });
      } catch (e) {
        console.error("Error checking auth state:", e);
        setIsUserAuthenticated(false);
      } finally {
        setIsSplashReady(true);
        await SplashScreen.hideAsync();
      }
    };

    checkAuthState();
  }, []);

  useEffect(() => {
    const logScreenView = async (screenName: string) => {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    };

    if (isUserAuthenticated === true) {
      router.replace("/(tabs)/map", { animation: "none" });
      logScreenView("Map");
    } else if (isUserAuthenticated === false) {
      router.replace("/signUp", { animation: "none" });
      logScreenView("SignUp");
    }
  }, [isUserAuthenticated, router]);

  if (isUserAuthenticated === null) {
    return (
      <View style={{ flex: 1 }}>
        {!isSplashReady ? null : (
          <Image
            source={require("../assets/images/splash.png")}
            style={{ flex: 1, width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
