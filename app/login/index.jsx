import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export default function LoginScreen() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        // setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", JSON.stringify(err, null, 2));
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
