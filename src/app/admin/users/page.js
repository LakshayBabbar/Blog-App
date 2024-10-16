"use client";
import UsersCard from "@/components/ui/UsersCard";
import SearchBar from "@/components/SearchBar";
import useFetch from "@/hooks/useFetch";
import LoadingSpinner from "@/components/LoadingSpinner";

const Users = () => {
  const { data, isError, error, isLoading, refetch } = useFetch(
    "/api/admin/users",
    "all_users"
  );

  if (isError) {
    return (
      <div className="mt-32 space-y-10 ml-10">
        <h1 className="text-2xl font-semibold text-red-500">
          {error.message || "Something went wrong!"}
        </h1>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="my-24 md:mt-28 p-5 space-y-10">
      <section className="w-full justify-center md:justify-start">
        <SearchBar type="users" url="/api/admin/users?search=" />
      </section>
      <section className="flex flex-wrap gap-4 justify-center md:justify-start">
        {data?.users?.map((user) => (
          <UsersCard key={user._id} data={user} refetch={refetch} />
        ))}
      </section>
    </div>
  );
};

export default Users;
