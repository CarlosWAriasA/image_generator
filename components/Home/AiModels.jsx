import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function AiModels({ type }) {
  const [aiModelList, setAiModelList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetAiModels();
  }, []);

  const GetAiModels = async () => {
    const result = await GlobalApi.GetAiModels(type);
    setAiModelList(result.data?.data);
  };

  const onClickModel = (item) => {
    router?.push({ pathname: "/formInput", params: item });
  };

  return (
    <View>
      <Text
        style={{
          textTransform: "capitalize",
          fontWeight: "bold",
          fontSize: 20,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        {type}
      </Text>
      <FlatList
        data={aiModelList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => onClickModel(item)}
              key={index}
              style={{ marginRight: 15 }}
            >
              <Image
                source={{ uri: item?.banner?.url }}
                style={{ width: 140, height: 180, borderRadius: 15 }}
              />
              <Text
                style={{
                  position: "absolute",
                  bottom: 10,
                  color: Colors.WHITE,
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                {item?.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
