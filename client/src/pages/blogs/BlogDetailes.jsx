import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { MdDelete } from "react-icons/md";
import { AuthContext } from "../../context/Authentication";
import { FaEdit } from "react-icons/fa";

const Blogs = () => {
  const params = useParams();
  const [data, setData] = useState();
  const [auth, setAuth] = useState(false);
  const { token } = useContext(AuthContext);
  const history = useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "get-blog/" + params.blogId,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );
      if (!response.ok) {
        return undefined;
      }
      const resData = await response.json();
      setAuth(resData.auth);
      setData(resData.blogs);
    };
    fetchdata();
  }, [params, token]);

  const date = data && data.createdAt.substring(0, 10);

  const deleteBlogHandler = async () => {
    const isSure = confirm("Are you sure to delete?");
    if (isSure) {
      const response = await fetch(
        `http://localhost:3000/delete-blog/${data._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );
      const resData = await response.json();
      console.log(resData);
      history(-1);
    }
  };

  return (
    <div className="flex flex-col items-center mt-28">
      <div className="flex justify-between w-[85%] md:w-[70%] xl:w-[55%]">
        <span
          className="flex gap-2 items-center underline cursor-pointer w-[fit-content]"
          onClick={() => history(-1)}
        >
          <IoArrowBack />
          Go back
        </span>
        {auth && (
          <div className="flex gap-2 text-xl cursor-pointer">
            <MdDelete className="text-red-500" onClick={deleteBlogHandler} />
            <FaEdit
              className="text-green-600"
              onClick={() => history(`/blogs/${data._id}/edit`)}
            />
          </div>
        )}
      </div>
      {data ? (
        <div className="flex flex-col gap-10 w-[85%] md:w-[70%] xl:w-[55%] my-10 font-arapey">
        <h1 className="text-4xl md:text-6xl">{data.title}</h1>
        <img src={data.img.url} alt="blog image" />
          <div className="flex justify-between w-full">
            <Link
              to={`/users/${data.author}`}
              className="cursor-pointer hover:underline"
            >
              By {data.author}
            </Link>
            <span>Created on: {date}</span>
          </div>
          <article className="prose-neutral prose-lg lg:prose-xl">
            {parse(data.description)}
          </article>
        </div>
      ) : (
        <h1 className="text-2xl font-light my-10">Blog not found.</h1>
      )}
    </div>
  );
};

export default Blogs;
