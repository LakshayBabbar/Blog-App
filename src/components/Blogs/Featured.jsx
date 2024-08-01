import Image from "next/image";
import React from "react";
import Button from "../ui/Button";
import Link from "next/link";

const Featured = ({ blog }) => {
  return (
    <section className="w-full mb-10 flex items-center md:items-start flex-col md:flex-row justify-between gap-10">
      <Image
        src={blog?.img?.url}
        alt={blog?.title}
        width={600}
        height={400}
        className="aspect-video w-full md:w-[50%] 2xl:w-[35rem]"
      />
      <div className="space-y-5">
        <h2 className="text-2xl xl:text-3xl">{blog?.title}</h2>
        <p className="md:pr-10 xl:text-xl text-slate-300">{blog?.description}</p>
        <Button>
          <Link href={`/blogs/${blog?.url}`}>Read Full Article</Link>
        </Button>
      </div>
    </section>
  );
};

export default Featured;
