import { useState } from "react";

const useSend = () => {
  const [isErr, setIsError] = useState(false);
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (url, method = "GET", body = {}) => {
    setLoading(true);
    setError("");
    try {
      const options = {
        method: method,
        headers: {},
        credentials: "include",
      };

      if (method !== "GET") {
        if (body instanceof FormData) {
          options.body = body;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
      }

      const req = await fetch(process.env.NEXT_PUBLIC_API_URL + url, options);
      const res = await req.json();
      if (!req.ok) {
        throw new Error(res.error || "Something went wrong");
      }
      return res;
    } catch (error) {
      setIsError(true);
      setError(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, isErr, err, loading };
};

export default useSend;
