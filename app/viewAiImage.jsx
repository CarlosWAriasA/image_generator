import { View, Image, Text, TouchableOpacity, Share } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Colors from "../constants/Colors";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import generateUuid from "../util/generateUuid";
import Toast from "react-native-toast-message";

export default function ViewAiImage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Ai Generated Image",
      headerBackTitle: "Back",
    });
  }, []);

  const downloadImage = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        const permission = await requestPermission();
        if (permission.status !== "granted") {
          Toast.show({
            type: "error",
            text1: "Error!",
            text2: "Permission denied to download image",
          });
          return;
        }
      }

      const imageUri = params.imageUrl;

      const downloadedFile = await FileSystem.downloadAsync(
        imageUri,
        FileSystem.documentDirectory + generateUuid() + ".png"
      );

      const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);

      if (asset) {
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Image saved successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error!",
          text2: "There was an error saving the image",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shareImage = async () => {
    try {
      const result = await Share.share({
        message: `Check out this amazing image generated using AI! ${params.imageUrl}`,
        url: params.imageUrl,
      });

      if (result.action === Share.sharedAction) {
        Toast.show({
          type: "success",
          text1: "Shared Successfully!",
          text2: "Image shared successfully.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error Sharing Image",
        text2: "There was an error sharing the image.",
      });
      console.log(error);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Image
        source={{ uri: params.imageUrl }}
        style={{ width: "100%", height: 400, borderRadius: 20 }}
      />
      <Text style={{ marginVertical: 5, fontSize: 16, color: Colors.PRIMARY }}>
        PROMPT: {params.prompt}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={downloadImage}
          style={{
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 10,
            width: "50%",
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Download
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={shareImage}
          style={{
            padding: 15,
            backgroundColor: Colors.YELLOW,
            borderRadius: 10,
            width: "50%",
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
