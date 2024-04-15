import { useState } from "react";
import UsersCard from "../../components/ui/UsersCard";
import { BiSearchAlt } from "react-icons/bi";
import useFetch from "../../hooks/useFetch";
import { Input } from "@/components/ui/input";

const Users = () => {
  const [input, setInput] = useState("all");
  const [search, setSearch] = useState(null);
  const { data, isError, loading } = useFetch(
    `/get-users/${input}`,
    `users/${input}`
  );
  const handelSubmit = (e) => {
    e.preventDefault();
    if (search.length === 0) {
      return setInput("all");
    }
    setInput(search);
  };

  return (
    <div className="my-24 sm:my-36 flex flex-col gap-10 items-center">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(#ffffff33_1px,#010816_1px)] bg-[size:20px_20px] opacity-[0.6]" />
      <h1 className="text-4xl font-[500] w-4/5 text-slate-100 sm:w-[65%] text-center">
        Discover and Connect with Talented Content Creators!
      </h1>
      <form className="relative w-4/5 xl:w-[25%]" onSubmit={handelSubmit}>
        <Input
          type="text"
          placeholder="Search User"
          className="h-12"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="h-12 px-5 text-xl absolute top-0 right-1"
        >
          <BiSearchAlt />
        </button>
      </form>
      {loading ? (
        <div className="col-span-3 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-500" />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {isError ? (
            <h1 className="col-span-3">User not found.</h1>
          ) : (
            data &&
            data.map((items) => {
              return <UsersCard key={items._id} data={items} />;
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
