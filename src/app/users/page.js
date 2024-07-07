import UsersCard from "@/components/ui/UsersCard";
import { getData } from "@/lib/helpers";
import SearchBar from "@/components/SearchBar";

const Users = async () => {
  const data = await getData("/api/users", true);
  if ("error" in data) {
    return <h1 className="text-center w-full mt-28">{data.error}</h1>;
  }
  return (
    <div className="my-24 sm:my-36 flex flex-col gap-10 items-center">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(#ffffff33_1px,#010816_1px)] bg-[size:20px_20px] opacity-[0.6]" />
      <h1 className="text-4xl font-[500] w-4/5 text-slate-100 sm:w-[65%] text-center">
        Discover and Connect with Talented Content Creators!
      </h1>
      <SearchBar type="Users" url="/api/users?search=" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {data?.map((items) => {
          return <UsersCard key={items._id} data={items} />;
        })}
      </div>
    </div>
  );
};

export default Users;
