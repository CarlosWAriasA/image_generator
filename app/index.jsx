import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View, Text } from "react-native";

export default function Index() {
  const { user } = useUser();

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);
  console.log(user);
  return (
    <View>
      {!user ? <Redirect href={"/login"} /> : <Text>Login success</Text>}
    </View>
  );
}
