import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Colors from "../constants/Colors";
import TextInput from "../components/FormInput/TextInput";
import ImageUpload from "../components/FormInput/ImageUpload";
import GlobalApi from "../services/GlobalApi";
import { UserDetailContext } from "../context/UserDetailContext";
import * as FileSystem from "expo-file-system";
import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";
import generateUuid from "../util/generateUuid";

export default function FormInput() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [aiModel, setAiModel] = useState({});
  const [userInputValue, setUserInputValue] = useState("");
  const [userImage, setUserImage] = useState({});
  const isUserImageUpload = aiModel?.userImageUpload == "true";
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAiModel(params);
    navigation.setOptions({
      headerShown: true,
      headerTitle: params?.name,
      headerBackTitle: "Back",
    });
  }, []);

  const onGenerate = async () => {
    if (isUserImageUpload) {
      ImageToAiImage();
    } else {
      TextToImage();
    }
  };

  const saveBase64AsFile = async (base64Image) => {
    const myUUID = generateUuid();
    const base64Data = base64Image.split(",")[1];
    const fileUri = FileSystem.cacheDirectory + myUUID + "generated_image.png";

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  };

  const updateUserCredits = async () => {
    try {
      const updatedResult = await GlobalApi.UpdateUserCredits(
        userDetail.documentId,
        {
          userCredits: Number(userDetail.userCredits) - 1,
        }
      );
      setUserDetail(updatedResult.data.data);
    } catch (error) {
      console.error("Error updating user credits:", error);
    }
  };

  const TextToImage = async () => {
    try {
      setLoading(true);
      const data = {
        aiModelName: aiModel?.aiModelName,
        inputPrompt: userInputValue,
        defaultPrompt: aiModel?.defaultPrompt,
      };
      const result = await GlobalApi.AiGenerateImage(data);
      const base64Image = result.data.image;
      const fileUri = await saveBase64AsFile(base64Image);
      updateUserCredits();
      UploadImageAndSave(fileUri);
    } catch (error) {
      console.log("Error form input:", error);
      setLoading(false);
    }
  };

  const ImageToAiImage = async () => {
    try {
      setLoading(true);
      const cld = new Cloudinary({
        cloud: {
          cloudName: "defvziw44",
        },
        url: {
          secure: true,
        },
      });

      const options = {
        upload_preset: "aiimage",
        unsigned: true,
      };

      await upload(cld, {
        file: userImage,
        options: options,
        callback: async (error, response) => {
          const data = {
            prompt: aiModel?.defaultPrompt,
            userImageUrl: response?.url,
            aiModelName: aiModel?.aiModelName,
          };

          const result = await GlobalApi.AiGenerateImage(data);
          updateUserCredits();

          const base64Image = result.data.image;
          const fileUri = await saveBase64AsFile(base64Image);
          setLoading(false);
          router.push({
            pathname: "viewAiImage",
            params: {
              imageUrl: fileUri,
              prompt: aiModel?.defaultPrompt,
            },
          });
        },
      });
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const UploadImageAndSave = async (fileUri) => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "defvziw44",
      },
      url: {
        secure: true,
      },
    });

    const options = {
      upload_preset: "aiimage",
      unsigned: true,
    };

    await upload(cld, {
      file: fileUri,
      options: options,
      callback: async (error, response) => {
        const dataImage = {
          email: userDetail?.userEmail,
          image: response.url,
        };

        await GlobalApi.AddAiImage(dataImage);

        setLoading(false);
        router.push({
          pathname: "viewAiImage",
          params: {
            imageUrl: response.url,
            prompt: userInputValue,
          },
        });
      },
    });
  };

  return (
    <View
      style={{ padding: 20, backgroundColor: Colors.WHITE, height: "100%" }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{aiModel.name}</Text>
      <View>
        {!isUserImageUpload && (
          <TextInput
            userInputValue={userInputValue}
            setUserInputValue={setUserInputValue}
          />
        )}
        {isUserImageUpload && (
          <ImageUpload
            uploadedImage={(value) => {
              setUserImage(value);
            }}
          />
        )}
        <TouchableOpacity
          disabled={loading}
          onPress={onGenerate}
          style={{
            padding: 12,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 15,
            marginVertical: 30,
            width: "100%",
          }}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#fff"} />
          ) : (
            <Text
              style={{ textAlign: "center", color: Colors.WHITE, fontSize: 20 }}
            >
              Generate
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
