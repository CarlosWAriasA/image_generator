import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://10.0.0.11:1337/api",
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_SCRAPI_API_KEY,
  },
});

const GetUserInfo = (email) => {
  return axiosClient.get("user-lists?filters[userEmail][$eq]=" + email);
};

const CreateNewUser = (data) => {
  return axiosClient.post("/user-lists", {
    data: data,
  });
};

export default {
  GetUserInfo,
  CreateNewUser,
};
