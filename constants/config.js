import { Platform } from "react-native";
export default API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5556" : "http://localhost:5556";
