import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function AiFeaturesModel() {
  const [aiModelList, setAiModelList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetAiModelFeaturesList();
  }, []);

  const GetAiModelFeaturesList = async () => {
    const result = await GlobalApi.GetFeaturesCategoryList();
    setAiModelList(result.data.data);
  };

  const onClickModel = (item) => {
    router?.push({ pathname: "/formInput", params: item });
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>Features</Text>
      <FlatList
        data={aiModelList}
        numColumns={4}
        style={{ marginTop: 7 }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              style={{ flex: 1, alignItems: "center" }}
              onPress={() => onClickModel(item)}
            >
              <View
                style={{
                  padding: 10,
                  borderRadius: 7,
                  backgroundColor: Colors.LIGHT_GRAY,
                }}
              >
                <Image
                  source={{ uri: item?.icon?.url }}
                  style={{ width: 35, height: 35 }}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  textAlign: "center",
                  color: Colors.PRIMARY,
                  marginTop: 2,
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
