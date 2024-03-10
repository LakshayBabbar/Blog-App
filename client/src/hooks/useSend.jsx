import { useEffect, useState } from "react";

const useFetch = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const isToken = localStorage.getItem("authToken");
    if (isToken) {
      setToken(isToken);
    }
  }, []);

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

      const res = await fetch(import.meta.env.VITE_BASE_URL + url, options);
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
