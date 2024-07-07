/* eslint-disable react/prop-types */
import Link from "next/link";
import Image from "next/image";

const BlogsCard = ({ data }) => {
  const date = data.createdAt;

  return (
    <div className="w-4/5 md:w-[20rem] xl:w-[25rem] flex flex-col rounded-xl bg-[rgba(46,46,46,0.48)] shadow-md hover:scale-105 transition-all ease-in-out duration-300">
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
          className="text-2xl hover:underline cursor-pointer line-clamp-2"
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
      </div>
    </div>
  );
};

export default BlogsCard;
