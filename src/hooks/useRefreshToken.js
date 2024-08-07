import axios from "../utils/axios.js";
import useAuth from "./useAuth.js";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("api/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      const datas = !prev.length ? response.data : prev; // If the page is refreshed, "prev" is empty
      prev.accessToken = response.data.accessToken;
      return {
        ...datas,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
