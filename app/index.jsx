import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Redirect href={"/login"} />;
  }

  return <Redirect href={"/(tabs)/home"} />;
}
