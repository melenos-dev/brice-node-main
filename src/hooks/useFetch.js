import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import useAuth from "./useAuth.js";

export function useFetch(apiPath, formData = null) {
  const [fetchResponse, setFetchResponse] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { auth } = useAuth();

  async function fetchData(apiPath, formData = null, method = null) {
    method =
      formData === null && method === null
        ? "get"
        : formData !== null
        ? "post"
        : method;

    if (!apiPath) return;
    setLoading(true);
    try {
      let xsrfToken = localStorage.getItem("xsrfToken");
      xsrfToken = JSON.parse(xsrfToken);

      const response = await fetch(process.env.REACT_APP_BACK_URL + apiPath, {
        method: method,
        mode: "cors",
        credentials: "include",
        headers: {
          "x-xsrf-token": xsrfToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: formData,
      });

      if (response.status > 399) {
        console.log("wow");
        return setError(response.status);
      }

      const fetchResponse = await response.json();

      if (auth.accessToken || fetchResponse.accessToken) {
        let accessToken = fetchResponse.accessToken // find accessToken from loginPost response or login Auth
          ? fetchResponse.accessToken
          : auth.accessToken;
        let decodedToken = jwtDecode(accessToken, process.env.ACCESS_TOKEN, {
          algorithms: process.env.ALGORITHM,
        });
        if (!decodedToken) return setError(403); // token problem
      }

      setFetchResponse(fetchResponse);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!apiPath) return;
    fetchData(apiPath, formData);
  }, [apiPath, formData]);

  return { isLoading, fetchResponse, error, fetchData, setFetchResponse };
}
