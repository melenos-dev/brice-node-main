import useAuth from "./useAuth.js";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await fetch("https://localhost:8443/api/auth/logout", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.setItem("persist", false);
    }
  };

  return logout;
};

export default useLogout;
