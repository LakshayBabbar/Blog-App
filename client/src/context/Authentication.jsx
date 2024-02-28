import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext({});

const Authentication = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = localStorage.getItem("authToken");
    if (getToken) {
      setToken(getToken);
      setIsAuth(true);
    } else {
      setIsAuth(false);
      setToken(null);
    }
  }, [isAuth]);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Authentication;
