import React from "react";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken.js";
import useAuth from "../hooks/useAuth.js";
import Loader from "./Loader/index.js";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, [auth?.accessToken]);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`accT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading, auth?.accessToken]);

  return (
    <>
      {isLoading ? (
        <div className="page home d-flex align-items-center justify-content-center">
          <Loader />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
