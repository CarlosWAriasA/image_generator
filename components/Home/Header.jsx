import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";

export default function Header() {
  const { user } = useUser();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 30, color: Colors.PRIMARY, fontWeight: "bold" }}>
        Image Generator
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 40, height: 40, borderRadius: 99 }}
        />
      </View>
    </View>
  );
}
