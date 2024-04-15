import { Link, useNavigate, useParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { FaRegEdit } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import { GradientButton } from "@/components/ui/GradientButton";
import Button from "@/components/ui/Button";

const UserDetails = () => {
  const params = useParams();
  const { data, loading, isError } = useFetch(
    `/users/${params.username}`,
    params.username
  );
  const redirect = useNavigate();
  return loading ? (
    <div className="flex justify-center mt-36">
      <div className="col-span-3 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-500" />
    </div>
  ) : (
    <div className="flex items-center justify-center my-24 sm:my-36">
      {data && !isError ? (
        <div className="w-[fit-content] flex flex-col gap-10 items-center">
          <div className="flex px-5 sm:px-0 sm:items-start gap-5 sm:gap-14">
            <img
              src={data.profileImg.url}
              alt="Profile pic"
              className="size-32 rounded-full object-cover"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-10">
              <div className="space-y-1 sm:space-y-1">
                <h1 className="text-xl font-[500]">{data.username}</h1>
                <h2 className="flex items-center gap-2 text-sm text-slate-400">
                  <FaRegCalendarAlt />
                  Date joined: {data.createdAt.substring(0, 10)}
                </h2>
                <div>
                  <h3 className="font-[500]">{`${data.firstname} ${data.lastname}`}</h3>
                  <p>{data.bio}</p>
                </div>
              </div>
              <div>
                {data.auth && (
                  <GradientButton
                    onClick={() => redirect(`/users/${data.username}/edit`)}
                  >
                    <span className="flex items-center gap-2">
                      <FaRegEdit /> Edit
                    </span>
                  </GradientButton>
                )}
              </div>
            </div>
          </div>
          <hr className="w-full border-zinc-600" />
          <div
            className={`flex justify-${
              data.auth ? "between" : "center"
            } w-4/5 md:w-full`}
          >
            <h1 className="text-3xl font-[500]">Blogs</h1>
            {data.auth && (
              <Button variant="outline">
                <Link to="/blogs/create-blog">New Blog</Link>
              </Button>
            )}
          </div>
          {data.blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-8">
              {data.blogs.map((items) => {
                return <BlogsCard key={items._id} data={items} />;
              })}
            </div>
          ) : (
            <h1>
              {data.auth
                ? "It seems that you haven't created any blogs yet."
                : "It seems the user hasn't created any blogs yet."}
            </h1>
          )}
        </div>
      ) : (
        <div>User Not Found.</div>
      )}
    </div>
  );
};

export default UserDetails;
