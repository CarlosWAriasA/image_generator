import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://10.0.0.11:1337/api",
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_SCRAPI_API_KEY,
  },
});

const GetUserInfo = (email) => {
  return axiosClient.get("/user-lists?filters[userEmail][$eq]=" + email);
};

const CreateNewUser = (data) => {
  return axiosClient.post("/user-lists", {
    data: data,
  });
};

const GetFeaturesCategoryList = () => {
  return axiosClient.get("/ai-models?filters[isFeature][$eq]=true&populate=*");
};

const GetAiModels = (type) => {
  return axiosClient.get(`/ai-models?filters[${type}][$eq]=true&populate=*`);
};

export default {
  GetUserInfo,
  CreateNewUser,
  GetFeaturesCategoryList,
  GetAiModels,
};
