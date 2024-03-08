import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authentication";

const useFetch = (url, initValue, refresh) => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(initValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("UseFetch")
      try {
        const res = await fetch(import.meta.env.VITE_AUTH + url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
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
  }, [token, url, refresh]);

  return { data, setData, error, loading };
};

export default useFetch;
