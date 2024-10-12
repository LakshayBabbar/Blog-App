import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SuperUser = ({ user, handelFn, refetch }) => {
  const removeSuper = async () => {
    handelFn("remove", user?.email);
    refetch();
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 rounded-xl w-11/12 md:w-auto flex flex-col items-center justify-center gap-4">
      <Image
        src={user?.profileImg}
        width={60}
        height={60}
        alt={`${user?.username} image`}
        className="rounded-full "
      />
      <div className="flex flex-col items-center gap-2">
        <Link
          href={`/users/${user.username}`}
          className="font-semibold cursor-pointer hover:underline hover:underline-offset-4 relative"
        >
          {user?.username}
          <ArrowUpRight className="absolute size-3 top-0 -right-3" />
        </Link>
        <span>{user?.email}</span>
      </div>
      <button
        className="px-5 py-2 bg-indigo-950 rounded-md"
        onClick={removeSuper}
        disabled={user.isAdmin === true ? true : false}
      >
        Remove Super
      </button>
    </div>
  );
};

export default SuperUser;
