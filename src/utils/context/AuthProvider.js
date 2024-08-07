import React, { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const isAllowed = (roles) => {
    return roles.find((role) => auth?.roles?.levels?.includes(Number(role)));
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, persist, setPersist, isAllowed }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
