"use client";
import useFetch from "@/hooks/useFetch";
import BlogsCard from "@/components/Blogs/BlogsCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCallback } from "react";

const Approval = () => {
  const { data, isError, error, isLoading, refetch } = useFetch(
    "/api/admin/approval",
    "pendingBlogs"
  );

  const refetchData = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isError) {
    return <div className="mt-32 text-center">{error}</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data || data.blogs.length === 0) {
    return (
      <div className="mt-32 w-full text-center">No Blogs left to approve</div>
    );
  }
  return (
    <div className="flex my-24 md:mt-28 p-5 flex-wrap gap-5 w-full">
      {data?.blogs?.map((blog) => (
        <BlogsCard
          key={blog._id}
          data={blog}
          route="admin"
          refetchData={refetchData}
        />
      ))}
    </div>
  );
};

export default Approval;
