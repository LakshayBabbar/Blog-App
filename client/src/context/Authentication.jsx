import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext({});

const Authentication = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getToken = localStorage.getItem("authToken");
    if (getToken) {
      setToken(getToken);
      setIsAuth(true);
    } else {
      setIsAuth(false);
      setToken(null);
    }
    setLoading(false)
  }, [isAuth]);

  return (
    <AuthContext.Provider
      value={{ isAuth, setIsAuth, token, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default Authentication;
