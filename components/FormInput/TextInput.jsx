import { View, Text, TextInput as TextInputComponent } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function TextInput({ userInputValue, setUserInputValue }) {
  return (
    <View>
      <Text style={{ marginTop: 10 }}>Enter your prompt</Text>
      <TextInputComponent
        placeholder="Enter your prompt here"
        numberOfLines={4}
        multiline={true}
        value={userInputValue}
        onChangeText={(value) => setUserInputValue(value)}
        editable={true}
        textAlignVertical="top"
        style={{
          padding: 15,
          backgroundColor: Colors.LIGHT_GRAY || "#f5f5f5",
          borderRadius: 15,
          marginTop: 10,
        }}
      />
    </View>
  );
}
