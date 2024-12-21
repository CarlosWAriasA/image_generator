import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import GlobalApi from "../../services/GlobalApi";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function AllUsersCreation({
  title = "User's Creation",
  fontSize = 20,
  email,
}) {
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [aiImageList, setAiImageList] = useState([]);
  const columnWidth = (Dimensions.get("screen").width * 0.87) / 2;
  const router = useRouter();
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    GetAllAiImages(pageSize);
  }, []);
  const GetAllAiImages = async (size) => {
    if (loading || !hasMoreData) return;

    setLoading(true);
    try {
      const result = await GlobalApi.GetAllAiImages(size, email);
      const data = result.data.data;

      if (data.length < size) {
        setHasMoreData(false);
      }

      setAiImageList((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const RenderFooter = () => {
    if (loading) {
      return <ActivityIndicator size={"large"} color={Colors.PRIMARY} />;
    } else {
      return null;
    }
  };

  const onClick = (item) => {
    router.push({
      pathname: "viewAiImage",
      params: {
        imageUrl: item.image,
        prompt: "Hidden",
      },
    });
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize, fontWeight: "bold" }}>{title}</Text>
      <FlatList
        data={aiImageList}
        numColumns={2}
        onEndReached={() => {
          if (hasMoreData) {
            setPageSize((prevSize) => prevSize + 5);
            GetAllAiImages(pageSize + 5);
          }
        }}
        onEndReachedThreshold={0.7}
        ListFooterComponent={RenderFooter}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              style={{ margin: 5 }}
              onPress={() => {
                onClick(item);
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  height: 250,
                  width: columnWidth,
                  borderRadius: 15,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
