import Link from "next/link";
import BlogsCard from "@/components/Blogs/BlogsCard";
import { FaRegEdit } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GradientButton } from "@/components/ui/GradientButton";
import Button from "@/components/ui/Button";
import { getData } from "@/lib/helpers";
import Image from "next/image";
import EditUser from "@/components/users/EditUser";

const UserDetails = async ({ params }) => {
  const data = await getData(`/api/users/${params.userId}`, true);
  if ("error" in data) {
    return <h1 className="text-center mt-28">{data.error}</h1>;
  }
  return (
    <div className="flex items-center justify-center my-24 sm:my-36">
      <div className="w-[fit-content] flex flex-col gap-10 items-center">
        <div className="flex px-5 sm:px-0 sm:items-start gap-5 sm:gap-14">
          <Image
            src={data.profileImg}
            alt="Profile pic"
            width={100}
            height={100}
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
                <h3 className="font-[500]">{`${data.displayName}`}</h3>
                <p>{data.bio}</p>
              </div>
            </div>
            <EditUser data={data} />
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
            {data.blogs.map((items, index) => {
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
    </div>
  );
};

export default UserDetails;
