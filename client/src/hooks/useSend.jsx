import { useState } from "react";

const useSend = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (url, method, body) => {
    setLoading(true);
    setError("");
    try {
      const options = {
        method: method,
        headers: {},
        credentials: "include",
      };

      if (method === "POST" || method === "PUT") {
        if (body instanceof FormData) {
          options.body = body;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
      }

      const req = await fetch(import.meta.env.VITE_BASE_URL + url, options);
      const res = await req.json();
      if (!req.ok) {
        setIsError(true);
        setError(res.message);
      }
      setLoading(false);
      return res;
    } catch (error) {
      setIsError(true);
      setError(error.message);
      setLoading(false);
    }
  };

  return { fetchData, isError, error, loading };
};

export default useSend;
