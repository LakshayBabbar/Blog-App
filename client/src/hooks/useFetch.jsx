import { useQuery } from "@tanstack/react-query";

const useFetch = (url, queryKey) => {
  const { isPending, error, isError, data, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: async ({ signal }) => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + url, {
          headers: {
            "Content-Type": "application/json",
          },
          signal,
          credentials: "include",
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.message);
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
      }
    },
  });

  return { data, isError, error, loading: isPending, refetch };
};

export default useFetch;
