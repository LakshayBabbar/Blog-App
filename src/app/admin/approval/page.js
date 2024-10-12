"use client";
import useFetch from "@/hooks/useFetch";
import BlogsCard from "@/components/Blogs/BlogsCard";

const Approval = () => {
  const { data, isError, error, refetch } = useFetch(
    "/api/admin/approval",
    "pending_blogs"
  );
  if (isError) {
    return <div className="mt-32 text-center">{error}</div>;
  }

  if (!data || data.blogs.length === 0) {
    return (
      <div className="mt-32 w-full text-center">No Blogs left to approve</div>
    );
  }
  return (
    <div className="flex my-24 md:mt-28 p-5 flex-wrap gap-6 w-full">
      {data?.blogs?.map((blog) => (
        <BlogsCard key={blog._id} data={blog} route="admin" refetch={refetch} />
      ))}
    </div>
  );
};

export default Approval;
