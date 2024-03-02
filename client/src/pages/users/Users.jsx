import { Form } from "react-router-dom";
import { useEffect, useState } from "react";
import UsersCard from "../../components/ui/UsersCard";
import { BiSearchAlt } from "react-icons/bi";

const Users = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("all");
  const [search, setSearch] = useState(null);
  const [errMssg, setErrMssg] = useState(null);
  useEffect(() => {
    const fetchdata = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "get-users/" + input
      );
      const resData = await response.json();
      if (response.status === 404) {
        return setErrMssg(resData.message);
      }
      setErrMssg(null);
      return setData(resData);
    };
    fetchdata();
  }, [input]);

  const handelSubmit = () => {
    if (search.length === 0) {
      return setInput("all");
    }
    return setInput(search);
  };

  return (
    <div className="m-28 flex flex-col gap-5">
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
      <div className="flex gap-5">
        {errMssg ? (
          <h1>{errMssg}</h1>
        ) : (
          data.map((items) => {
            return <UsersCard key={items._id} data={items} />;
          })
        )}
      </div>
    </div>
  );
};

export default Users;
