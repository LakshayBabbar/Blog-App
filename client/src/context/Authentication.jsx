/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext({});
import useFetch from "../hooks/useFetch";

const Authentication = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const { data, refetch } = useFetch("/", "auth");
  const [username, setUserName] = useState("");

  useEffect(() => {
    if (data && data.isLogedin) {
      setIsAuth(true);
      setUserName(data.username);
      refetch();
    } else {
      setIsAuth(false);
    }
  }, [data, refetch]);
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, username, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Authentication;
