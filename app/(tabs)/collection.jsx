import { View } from "react-native";
import React, { useContext } from "react";
import AllUsersCreation from "../../components/Home/AllUsersCreation";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Collection() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <AllUsersCreation
        title="My Collection"
        fontSize={30}
        email={userDetail.userEmail}
      />
    </View>
  );
}
