import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";
import Footer from '../../components/Footer';

const Blogs = () => {
  const params = useParams();
  const { data, loading, isError } = useFetch(
    `get-blog/${params.blogId}`,
    params.blogId
  );
  const [comment, setComment] = useState("");
  const { data: commentData, refetch } = useFetch(
    `get-comments/${params.blogId}`,
    `comments-${params.blogId}`
  );
  const { fetchData } = useSend();
  const history = useNavigate();

  const deleteBlogHandler = async () => {
    const isSure = window.confirm("Are you sure to delete?");
    if (isSure) {
      const response = await fetchData(
        `delete-blog/${params.blogId}`,
        "DELETE"
      );
      console.log(response);
      history(-1);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const response = await fetchData(
      `create-comment/${params.blogId}`,
      "POST",
      {
        description: comment,
      }
    );
    !response && alert("Login to add a comment.");
    setComment("");
    return refetch();
  };

  const deleteComment = async (id) => {
    await fetchData(`delete-comment/${id}`, "DELETE");
    return refetch();
  };

  return (
    <div className="flex flex-col items-center mt-28">
      {loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : data && !isError ? (
        <div className="w-[85%] md:w-[70%] xl:w-[55%]">
          <div className="flex justify-between">
            <span
              className="flex gap-2 items-center underline cursor-pointer w-[fit-content]"
              onClick={() => history(-1)}
            >
              <IoArrowBack />
              Go back
            </span>
            {data.auth && (
              <div className="flex gap-2 text-xl cursor-pointer">
                <MdDelete
                  className="text-red-500"
                  onClick={deleteBlogHandler}
                />
                <FaEdit
                  className="text-green-600"
                  onClick={() => history(`/blogs/${params.blogId}/edit`)}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-10 my-10 font-arapey">
            <h1 className="text-4xl md:text-6xl">{data.title}</h1>
            <img src={data.img.url} alt="blog image" />
            <div className="flex justify-between w-full">
              <Link
                to={`/users/${data.author}`}
                className="cursor-pointer hover:underline"
              >
                By {data.author}
              </Link>
              <span>Created on: {data.createdAt.substring(0, 10)}</span>
            </div>
            <article className="prose-neutral prose-lg lg:prose-xl">
              {parse(data.description)}
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
              {commentData &&
                commentData.map((item) => (
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
        </div>
      ) : (
        <h1 className="text-xl">Blog not found.</h1>
      )}
      <Footer />
    </div>
  );
};

export default Blogs;
