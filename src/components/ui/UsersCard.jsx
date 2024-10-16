/* eslint-disable react/prop-types */
"use client";
import Link from "next/link";
import { FaRegCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import { useToast } from "./use-toast";

const UsersCard = ({ data, refetch }) => {
  const { toast } = useToast();
  const userHandler = async (type) => {
    const url =
      type === "block" ? "/api/admin/users/block" : "/api/admin/users/unblock";
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: data._id }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }
      refetch();
      toast({
        title: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col p-6 rounded-md items-center justify-center gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 w-full md:w-auto">
      <Image
        src={data?.profileImg}
        alt="profile pic"
        width={50}
        height={50}
        className="rounded-full aspect-square object-fill"
      />
      <div className="flex flex-col gap-2 justify-center items-center w-full">
        <Link
          className="hover:underline underline-offset-4 font-semibold"
          href={`/users/${data?.username}`}
        >
          @{data?.username}
        </Link>
        <span className="flex items-center gap-1 text-slate-400 text-sm">
          <FaRegCalendarAlt /> Date joined: {data?.createdAt.substring(0, 10)}
        </span>
      </div>
      <button
        onClick={() => userHandler(data.blocked ? "unblock" : "block")}
        className={`mt-2 px-2 py-1 ${
          data.blocked ? "bg-green-900" : "bg-red-900"
        } rounded-sm text-sm disabled:opacity-50`}
      >
        {data.blocked ? "Reactivate" : "Suspend"}
      </button>
    </div>
  );
};

export default UsersCard;
