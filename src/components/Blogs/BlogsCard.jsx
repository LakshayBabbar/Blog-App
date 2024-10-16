/* eslint-disable react/prop-types */
"use client";
import Link from "next/link";
import Image from "next/image";
import { CheckIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { blogApproval } from "@/lib/helpers";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import React from "react";
import { useToast } from "../ui/use-toast";

const BlogsCard = ({ data, route, refetchData }) => {
  const date = data.createdAt;
  const { data: session } = useSession();
  const [featured, setFeatured] = React.useState(data.featured);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const approvaleHandler = (id, status) => async () => {
    blogApproval(id, status);
    refetchData();
  };

  const featuredHandler = async () => {
    setLoading(true);
    try {
      const req = await fetch(`/api/admin/featured/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: data.category }),
      });
      const res = await req.json();
      if (!req.ok) {
        throw new Error(res.error || "Something went wrong");
      }
      setFeatured(true);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[20rem] md:w-[40%] xl:w-[30%] 2xl:w-[25rem] flex flex-col rounded-xl bg-[rgba(46,46,46,0.48)] shadow-md hover:scale-105 transition-all ease-in-out duration-300">
      <div className="relative w-full aspect-video">
        <Image
          src={data.img.url}
          alt={data.title}
          fill={true}
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-t-xl"
        />
      </div>
      <div className="flex flex-col gap-2 py-6 px-5">
        <span className="py-1 px-4 bg-zinc-800 w-fit rounded-full text-white text-sm">
          {data.category.toUpperCase()}
        </span>
        <Link
          href={`/blogs/${data.url}`}
          className="text-xl xl:text-2xl hover:underline cursor-pointer line-clamp-2"
        >
          {data.title}
        </Link>
        <Link
          className="text-gray-400 hover:underline"
          href={`/users/${data.author}`}
        >
          @{data.author}
        </Link>
        <div className="flex justify-between w-full items-center">
          <span className="text-gray-400">{date && date.substring(0, 10)}</span>
        </div>
        {(session?.user?.isAdmin || session?.user?.isSuper) &&
          route === "admin" && (
            <div className="flex gap-4 items-center w-full justify-end">
              <acronym title="Approve Blog">
                <CheckIcon
                  size={25}
                  className="text-green-600 cursor-pointer"
                  strokeWidth={3}
                  onClick={approvaleHandler(data?._id, "approved")}
                />
              </acronym>
              <acronym title="Reject Blog">
                <XIcon
                  size={25}
                  className="text-red-600 cursor-pointer"
                  onClick={approvaleHandler(data?._id, "reject")}
                  strokeWidth={3}
                />
              </acronym>
            </div>
          )}
        {(session?.user?.isSuper || session?.user?.isAdmin) &&
          route !== "admin" && (
            <div>
              <button disabled={loading} onClick={featuredHandler}>
                {featured ? (
                  <MdFavorite className="text-red-500 text-2xl" />
                ) : (
                  <MdFavoriteBorder className="text-2xl" />
                )}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default BlogsCard;
