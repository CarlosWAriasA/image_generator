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

const AiGenerateImage = (data) => {
  return axios.post("http://10.0.0.11:8081/aimodel", data);
};

const UpdateUserCredits = (documentId, data) => {
  return axiosClient.put("/user-lists/" + documentId, { data: data });
};

const AddAiImage = (data) => {
  return axiosClient.post("ai-generated-images", { data: data });
};

const GetAllAiImages = (pageSize, email) => {
  let url = `ai-generated-images?pagination[start]=${
    pageSize - 5
  }&pagination[limit]=${pageSize}`;

  if (email) {
    url = url + `&filters[email][$eq]=${email}`;
  }

  return axiosClient.get(url);
};

export default {
  GetUserInfo,
  CreateNewUser,
  GetFeaturesCategoryList,
  GetAiModels,
  AiGenerateImage,
  UpdateUserCredits,
  AddAiImage,
  GetAllAiImages,
};
