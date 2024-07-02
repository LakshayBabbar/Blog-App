import { useQuery } from "@tanstack/react-query";

const useFetch = (url, queryKey) => {
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: async ({ signal }) => {
      const response = await fetch(import.meta.env.VITE_API_URL + url, {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      return response.json();
    },
  });

  return { data, isError, error, isLoading, refetch };
};

export default useFetch;
