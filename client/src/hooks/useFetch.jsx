import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authentication";

const useFetch = (url, method, initValue, body, refresh) => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(initValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        };

        if (method === "POST" || method === "PUT") {
          options.body = body;
        }

        const res = await fetch(import.meta.env.VITE_AUTH + url, options);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error while fetching data.");
        }

        const resData = await res.json();
        setData(resData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, body, method, url, refresh]);

  return { data, setData, error, loading };
};

export default useFetch;
