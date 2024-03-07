import { useContext, useState } from "react";
import { AuthContext } from "../context/Authentication";

const useFetch = () => {
  const { token } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (url, method, body) => {
    setLoading(true);
    try {
      const options = {
        method: method,
        headers: {},
      };

      if (token) {
        options.headers.Authorization = token;
      }

      if (method === "POST" || method === "PUT") {
        if (body instanceof FormData) {
          options.body = body;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
      }

      const res = await fetch(import.meta.env.VITE_AUTH + url, options);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error while fetching data.");
      }

      const resData = await res.json();
      setLoading(false);
      return resData;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { fetchData, error, loading };
};

export default useFetch;
