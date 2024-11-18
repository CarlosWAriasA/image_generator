import { FlatList, ScrollView, View } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Banner from "../../components/Home/Banner";
import AiFeaturesModel from "../../components/Home/AiFeaturesModel";
import AiModels from "../../components/Home/AiModels";

export default function Home() {
  return (
    <FlatList
      data={[1]}
      style={{ padding: 20, marginTop: 20 }}
      nestedScrollEnabled={true}
      renderItem={() => {
        return (
          <View>
            <Header />
            <Banner />
            <AiFeaturesModel />
            <AiModels type={"avatar"} />
            <AiModels type={"style"} />
            <View style={{ height: 50 }}></View>
          </View>
        );
      }}
    />
  );
}
