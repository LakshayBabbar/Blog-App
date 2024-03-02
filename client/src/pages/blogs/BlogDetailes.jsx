import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { MdDelete } from "react-icons/md";
import {AuthContext} from '../../context/Authentication';
import { FaEdit } from "react-icons/fa";

const Blogs = () => {
  const params = useParams();
  const [data, setData] = useState();
  const [auth, setAuth] = useState(false);
  const {token} = useContext(AuthContext);
  const history = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username")
    const fetchdata = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "get-blog/" + `${username}/` + params.blogId,{
          headers: {
            "Content-Type": "application/json",
            authorization: token
          }
        }
      );
      if (!response.ok) {
        return undefined;
      }
      const resData = await response.json();
      console.log(resData.auth)
      setAuth(resData.auth)
      setData(resData.blogs);
    };
    fetchdata();
  }, [params, token]);

  const date = data && data.createdAt.substring(0, 10);

  return (
    <div className="flex flex-col items-center mt-28">
      <div
        className="flex cursor-pointer justify-between w-[85%] md:w-[70%] xl:w-[50%]"
        onClick={() => history(-1)}
      >
        <span className="flex gap-2 items-center underline">
          <IoArrowBack />
          Go back
        </span>
        {auth && <div className="flex gap-2 text-xl">
          <MdDelete className="text-red-500" />
          <FaEdit className="text-green-600" />
        </div>}
      </div>
      {data ? (
        <div className="flex flex-col gap-10 w-[85%] md:w-[70%] xl:w-[50%] my-10">
          <h1 className="text-5xl">{data.title}</h1>
          <img src={data.img} alt="blog image" />
          <div className="flex justify-between w-full">
            <Link
              to={`/users/${data.author}`}
              className="cursor-pointer hover:underline"
            >
              By {data.author}
            </Link>
            <span>Created on: {date}</span>
          </div>
          {parse(data.description)}
        </div>
      ) : (
        <h1 className="text-2xl font-light my-10">Blog not found.</h1>
      )}
    </div>
  );
};

export default Blogs;
