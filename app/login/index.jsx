import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        console.log("Session activated: ", createdSessionId);
        router.replace("/(tabs)/home"); // Redirect after session activation
      } else {
        console.log("Login successful but no session created.");
      }
    } catch (err) {
      if (err.errors && err.errors[0].code === "session_exists") {
        console.log("Session already exists. Redirecting to home...");
        router.replace("/(tabs)/home");
      } else {
        console.log(err);
        console.error("OAuth error", JSON.stringify(err, null, 2));
      }
    }
  }, []);

  return (
    <View>
      <Image
        source={require("./../../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: "65%",
        }}
      />
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Welcome to Image Generator</Text>
        <Text style={styles.subtitle}>Create AI art just on click</Text>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={styles.textButton}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.info}>
          By Continuing you agree to our terms and conditions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    padding: 25,
    marginTop: -20,
    backgroundColor: "white",
    height: "40%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.GRAY,
    textAlign: "center",
    marginTop: 15,
  },
  button: {
    width: "100%",
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 40,
    marginTop: 20,
  },
  textButton: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
  },
  info: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    color: Colors.GRAY,
  },
});

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();
