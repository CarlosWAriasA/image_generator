import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Colors from "../constants/Colors";
import TextInput from "../components/FormInput/TextInput";
import ImageUpload from "../components/FormInput/ImageUpload";

export default function FormInput() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [aiModel, setAiModel] = useState({});
  const [userInputValue, setUserInputValue] = useState("");
  const [userImage, setUserImage] = useState({});

  useEffect(() => {
    setAiModel(params);
    navigation.setOptions({
      headerShown: true,
      headerTitle: params?.name,
    });
  }, []);

  const onGenerate = () => {
    console.log(userInputValue);
  };

  return (
    <View
      style={{ padding: 20, backgroundColor: Colors.WHITE, height: "100%" }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{aiModel.name}</Text>
      <View>
        {!aiModel?.userImageUpload && (
          <TextInput
            userInputValue={userInputValue}
            setUserInputValue={setUserInputValue}
          />
        )}
        {aiModel?.userImageUpload && (
          <ImageUpload
            uploadedImage={(value) => {
              setUserImage(value);
            }}
          />
        )}
        <Text style={{ color: Colors.GRAY, marginVertical: 5 }}>
          1 credit will use to generate image
        </Text>
        <TouchableOpacity
          onPress={onGenerate}
          style={{
            padding: 12,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 15,
            marginVertical: 30,
            width: "100%",
          }}
        >
          <Text
            style={{ textAlign: "center", color: Colors.WHITE, fontSize: 20 }}
          >
            Generate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
