import { Form } from "react-router-dom";
import { useState } from "react";
import UsersCard from "../../components/ui/UsersCard";
import { BiSearchAlt } from "react-icons/bi";
import useFetch from "../../hooks/useFetch";

const Users = () => {
  const [input, setInput] = useState("all");
  const [search, setSearch] = useState(null);
  const { data, error } = useFetch(`get-users/${input}`, "GET", []);

  const handelSubmit = () => {
    if (search.length === 0) {
      return setInput("all");
    }
    return setInput(search);
  };

  return (
    <div className="mt-28 flex flex-col gap-14 items-center">
      <Form className="relative w-96" onSubmit={handelSubmit}>
        <input
          type="search"
          className="border border-purple-500 w-96 h-12 px-4 rounded-full focus:outline-none"
          placeholder="Search User"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="h-10 rounded-full px-4 bg-purple-500 text-white absolute top-1 right-1"
        >
          <BiSearchAlt />
        </button>
      </Form>
      <div className="sm:w-[90%] md:w-[80%] xl:w-[75%]">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center">
          {error ? (
            <h1>{error.message}</h1>
          ) : (
            data.map((items) => {
              return <UsersCard key={items._id} data={items} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
