import { useEffect, useState } from "react";

const useFetch = (url, initValue, refresh) => {
  const [data, setData] = useState(initValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchData = async () => {
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
  }, [url, refresh]);

  return { data, setData, error, loading };
};

export default useFetch;
