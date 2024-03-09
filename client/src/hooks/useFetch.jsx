import { useQuery } from "@tanstack/react-query";

const useFetch = (url, queryKey) => {
  const token = localStorage.getItem("authToken");
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const fetchData = await fetch(import.meta.env.VITE_AUTH + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const res = await fetchData.json();
      return res;
    },
  });
  return { data, error, loading: isPending, refetch };
};

export default useFetch;
