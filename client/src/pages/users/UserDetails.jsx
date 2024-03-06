import { Link, useParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { FaRegEdit } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";

const UserDetails = () => {
  const params = useParams();
  const { data } = useFetch(`users/${params.username}`, "GET", {
    user: null,
    blogs: [],
    auth: false,
  });
  const { user:userData, blogs: blogData, auth } = data;
  console.log(data)

  return (
    <div className="flex items-center justify-center mt-28">
      {userData ? (
        <div className="w-[fit-content] flex flex-col gap-10 items-center">
          <div className="flex sm:items-start gap-5 sm:gap-14">
            <img
              src={userData.profileImg.url}
              alt="Profile pic"
              className="size-32 sm:size-36 rounded-full object-cover"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-10">
              <div className="space-y-1 sm:space-y-3">
                <h1 className="text-xl font-[500]">{userData.username}</h1>
                <h2 className="flex items-center gap-2">
                  <FaRegCalendarAlt />
                  Date joined: {userData.createdAt.substring(0, 10)}
                </h2>
                <div>
                  <h3 className="font-[500]">{`${userData.firstname} ${userData.lastname}`}</h3>
                  <p>{userData.bio}</p>
                </div>
              </div>
              {auth && (
                <Link
                  to={`/users/${userData.username}/edit`}
                  className="flex items-center justify-center gap-1 border text=xl px-3 py-2 h-10 rounded-md"
                >
                  <FaRegEdit /> Edit
                </Link>
              )}
            </div>
          </div>
          <hr className="w-full" />
          <h1 className="text-3xl">Blogs</h1>
          {blogData.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-8">
              {blogData.map((items) => {
                return <BlogsCard key={items._id} data={items} />;
              })}
            </div>
          ) : (
            <h1>
              {auth
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
