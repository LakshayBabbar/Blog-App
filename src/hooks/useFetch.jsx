import { useQuery } from "@tanstack/react-query";

const useFetch = (url, queryKey) => {
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: async ({ signal }) => {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      return data;
    },
    retry: false,
  });

  return { data, isError, error, isLoading, refetch };
};

export default useFetch;
