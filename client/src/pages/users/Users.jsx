import { useState } from "react";
import UsersCard from "../../components/ui/UsersCard";
import { BiSearchAlt } from "react-icons/bi";
import useFetch from "../../hooks/useFetch";

const Users = () => {
  const [input, setInput] = useState("all");
  const [search, setSearch] = useState(null);
  const { data, isError, loading } = useFetch(
    `get-users/${input}`,
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
    <div className="my-24 sm:my-36 flex flex-col gap-14 items-center">
      <form className="relative w-96 xl:w-[25%]" onSubmit={handelSubmit}>
        <input
          type="search"
          className="border border-zinc-600 w-11/12 bg-zinc-800 h-14 px-5 rounded-full focus:outline-none"
          placeholder="Search User"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="h-12 px-5 text-xl absolute top-1 right-1"
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
