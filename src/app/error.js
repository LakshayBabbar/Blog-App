"use client";
import Link from "next/link";

const error = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong!</h1>
      <Link href="/" className="underline underline-offset-4">
        Go to home page
      </Link>
    </div>
  );
};

export default error;
