import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function Profile() {
  const { user } = useUser();
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Profile</Text>
      <View
        style={{
          width: "100%",
          marginTop: 20,
        }}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 99,
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            textAlign: "center",
            color: Colors.PRIMARY,
            fontSize: 20,
            fontWeight: "bold",
            paddingTop: 5,
          }}
        >
          {fullName}
        </Text>
        <Text style={{ textAlign: "center", color: Colors.GRAY }}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          padding: 12,
          backgroundColor: "white",
          borderRadius: 15,
          marginVertical: 30,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="logout"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 20 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
