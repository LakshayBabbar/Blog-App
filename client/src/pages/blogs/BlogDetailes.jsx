import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { MdDelete } from "react-icons/md";
import { AuthContext } from "../../context/Authentication";
import { FaEdit } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";

const Blogs = () => {
  const params = useParams();
  const [refresh, setRefresh] = useState(null);
  const { data } = useFetch(`get-blog/${params.blogId}`, "GET", {
    blogs: null,
    auth: false,
  });
  const [comment, setComment] = useState("");
  const { blogs } = data;
  const { data: commentData } = useFetch(
    `get-comments/${params.blogId}`,
    "GET",
    [],
    null,
    refresh
  );
  const { token } = useContext(AuthContext);
  const history = useNavigate();

  const deleteBlogHandler = async () => {
    const isSure = window.confirm("Are you sure to delete?");
    if (isSure) {
      try {
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
        if (!response.ok) {
          throw new Error("Failed to delete blog");
        }
        const resData = await response.json();
        console.log(resData);
        history(-1);
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/create-comment/${params.blogId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            description: comment,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create comment");
      }
      const resData = await response.json();
      console.log(resData);
      setRefresh(resData);
      setComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const deleteComment = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/delete-comment/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      const resData = await response.json();
      console.log(resData);
      setRefresh(resData);
    } catch (error) {
      console.error("Error deleting comment:", error);
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
        {data.auth && (
          <div className="flex gap-2 text-xl cursor-pointer">
            <MdDelete className="text-red-500" onClick={deleteBlogHandler} />
            <FaEdit
              className="text-green-600"
              onClick={() => history(`/blogs/${data._id}/edit`)}
            />
          </div>
        )}
      </div>
      {blogs ? (
        <div className="flex flex-col gap-10 w-[85%] md:w-[70%] xl:w-[55%] my-10 font-arapey">
          <h1 className="text-4xl md:text-6xl">{blogs.title}</h1>
          <img src={blogs.img.url} alt="blog image" />
          <div className="flex justify-between w-full">
            <Link
              to={`/users/${blogs.author}`}
              className="cursor-pointer hover:underline"
            >
              By {blogs.author}
            </Link>
            <span>Created on: {blogs.createdAt.substring(0, 10)}</span>
          </div>
          <article className="prose-neutral prose-lg lg:prose-xl">
            {parse(blogs.description)}
          </article>
          <div className="space-y-4">
            <form
              action="POST"
              onSubmit={handleComment}
              className="flex relative"
            >
              <input
                type="text"
                required
                className="w-full border-b h-10 px-2 focus:outline-0"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 border px-4 py-1 rounded-md"
              >
                Add
              </button>
            </form>
            {commentData.map((item) => (
              <div key={item._id} className="text-lg">
                <div className="flex justify-between">
                  <Link
                    to={`/users/${item.username}`}
                    className="hover:underline"
                  >
                    @{item.username}
                  </Link>
                  <div className="flex items-center gap-1">
                    <span>{item.createdAt.substring(0, 10)}</span>
                    {item.isUser && (
                      <MdDelete
                        onClick={() => deleteComment(item._id)}
                        className="cursor-pointer text-red-600"
                      />
                    )}
                  </div>
                </div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1 className="text-2xl font-light my-10">Blog not found.</h1>
      )}
    </div>
  );
};

export default Blogs;