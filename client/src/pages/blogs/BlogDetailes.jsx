import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";
import Footer from "../../components/Footer";
import { motion, useScroll } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { GradientButton } from "@/components/ui/GradientButton";
import { Helmet } from "react-helmet";
import AlertButton from "@/components/ui/AlertButton";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiCommentDots } from "react-icons/bi";
import { LuShare2 } from "react-icons/lu";
import { RWebShare } from "react-web-share";
import { AuthContext } from "@/context/Authentication";
import { useContext } from "react";

const Blogs = () => {
  const params = useParams();
  const { isAuth } = useContext(AuthContext);
  const {
    data,
    loading: loadingBlog,
    refetch: refetchBlog,
  } = useFetch(`/api/blogs/${params.blogRef}`, params.blogRef);
  const [blogId, setBlogId] = useState("");
  const [comment, setComment] = useState("");
  const { data: commentData, refetch } = useFetch(
    `/api/comments/${blogId}`,
    `comments-${blogId}`
  );
  const { fetchData, loading, isError, error } = useSend();
  const history = useNavigate();
  const { toast } = useToast();
  const [like, setLike] = useState(false);
  useEffect(() => {
    setLike(data && data.isLiked);
    setBlogId(data && data._id);
  }, [data]);

  const deleteBlogHandler = async () => {
    const response = await fetchData(`/api/blogs/${blogId}`, "DELETE");
    const date = new Date();
    toast({
      title: isError ? error : response.message,
      description: !isError && date.toString(),
    });
    history(-1);
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (isAuth) {
      await fetchData(`/api/comments/${blogId}`, "POST", {
        description: comment,
      });
      return refetch();
    } else {
      toast({
        title: "Please login to add a comment.",
        description: "You need to be logged in to add a comment.",
      });
    }
  };

  const deleteComment = async (id) => {
    const res = await fetchData(`/api/comments/${id}`, "DELETE");
    res.success && refetch();
    toast({
      title: res.message,
      description: new Date().toString(),
    });
  };

  const likeHandler = async () => {
    if (isAuth) {
      const res = await fetchData(`/api/blogs/${blogId}/likes`, "PUT", {});
      !isError && setLike(res.liked);
      refetchBlog();
    } else {
      history("/auth?mode=login");
    }
  };

  const { scrollYProgress } = useScroll();

  return (
    <div className="flex flex-col items-center mt-28">
      <Helmet>
        <title>{data ? data.title : "Blog Not Found"}</title>
        <meta
          name="description"
          content={data ? data.description.substring(0, 200) : "Blog Not Found"}
        />
      </Helmet>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="h-[2px] sm:h-1 w-full fixed left-0 right-0 top-0 bg-slate-300 transform origin-left z-[999]"
      />
      {loadingBlog ? (
        <div className="col-span-3 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-500" />
      ) : data && !isError ? (
        <div className="w-[85%] md:w-[70%] xl:w-[55%]">
          <div className="flex justify-between">
            <span
              className="flex gap-2 items-center underline underline-offset-4 cursor-pointer w-[fit-content]"
              onClick={() => history(-1)}
            >
              <IoArrowBack />
              Go back
            </span>
            {data.auth && (
              <div className="flex gap-2 text-xl cursor-pointer">
                <AlertButton
                  onClick={deleteBlogHandler}
                  className="p-0 h-auto"
                  description="This action cannot be undone. This will permanently delete your blog and remove your data from our servers."
                >
                  <MdDelete className="text-xl text-red-500" />
                </AlertButton>
                <FaEdit
                  className="text-green-600"
                  onClick={() => history(`/blogs/${params.blogRef}/edit`)}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-10 my-10">
            <h1 className="text-4xl md:text-5xl font-arapey">{data.title}</h1>
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
            <section className="flex justify-center">
              <div className="flex gap-3 items-center">
                <div>
                  <button
                    onClick={likeHandler}
                    disabled={loading}
                    aria-label="like"
                  >
                    {!like ? (
                      <BiLike className="text-2xl" />
                    ) : (
                      <BiSolidLike className="text-blue-500 text-2xl" />
                    )}
                  </button>
                  <span>{data.likes}</span>
                </div>
                <a href="#comments">
                  <BiCommentDots className="text-2xl text-slate-300" />
                </a>
                <RWebShare
                  data={{
                    url: `https://Legit-Blogs-delta.vercel.app/blogs/${blogId}`,
                    title: "Share Blog",
                  }}
                  onClick={() => console.log("shared successfully!")}
                >
                  <button>
                    <LuShare2 className="text-2xl text-slate-300" />
                  </button>
                </RWebShare>
              </div>
            </section>
            <article className="prose-neutral prose-lg lg:prose-xl text-gray-300">
              {parse(data.description)}
            </article>
            <div className="space-y-4" id="comments">
              <form onSubmit={handleComment} className="flex relative">
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b h-10 px-2 focus:outline-0"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="absolute right-0">
                  <GradientButton type="submit" disabled={loading}>
                    Add
                  </GradientButton>
                </div>
              </form>
              {commentData && commentData.length > 0 ? (
                commentData.map((item) => (
                  <div key={item._id} className="text-slate-300">
                    <div className="flex justify-between">
                      <Link
                        to={`/users/${item.username}`}
                        className="hover:underline"
                      >
                        @{item.username}
                      </Link>
                      <div className="flex items-center gap-1 ">
                        <span>{item.createdAt.substring(0, 10)}</span>
                        {item.isUser && (
                          <button
                            disabled={loading}
                            className="disabled:brightness-50"
                          >
                            <MdDelete
                              onClick={() => deleteComment(item._id)}
                              className="cursor-pointer text-red-600"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-100">{item.description}</p>
                  </div>
                ))
              ) : (
                <h1>There are currently no comments on this blog post.</h1>
              )}
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
