import UsersCard from "@/components/ui/UsersCard";
import { getData } from "@/lib/helpers";
import SearchBar from "@/components/SearchBar";

const page = async () => {
  const users = await getData("/api/users", true);
  if (!users) return <div className="mt-28 text-center">No users found</div>;
  if (users.error)
    return <div className="mt-28 text-center">{users.error}</div>;
  
  return (
    <div className="mt-32 space-y-10">
      <section className="w-full flex justify-center">
        <SearchBar type="users" url="/api/users?search=" />
      </section>
      <section className="flex flex-wrap gap-4">
        {users?.map((user) => (
          <UsersCard key={user._id} data={user} />
        ))}
      </section>
    </div>
  );
};

export default page;
