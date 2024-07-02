/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BlogsCard = ({ data }) => {
  const date = data.createdAt;
  const redirect = useNavigate();

  return (
    <motion.div
      className="w-4/5 md:w-[20rem] xl:w-[25rem] flex flex-col rounded-xl bg-black"
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 1.07 }}
      transition={{ type: "spring" }}
    >
      <img
        src={data.img.url}
        alt={data.title}
        className="aspect-video rounded-md cursor-pointer w-full"
        onClick={() => redirect(`/blogs/${data.url}`)}
      />
      <div className="flex flex-col gap-2 py-6 px-5">
        <span className="py-1 px-4 bg-zinc-800 w-[fit-content] rounded-full text-white text-sm">
          {data.category.toUpperCase()}
        </span>
        <Link
          to={`/blogs/${data.url}`}
          className="text-2xl hover:underline cursor-pointer line-clamp-2"
        >
          {data.title}
        </Link>
        <Link
          className="text-gray-600 hover:underline"
          to={`/users/${data.author}`}
        >
          @{data.author}
        </Link>
        <span className="text-gray-600">{date && date.substring(0, 10)}</span>
      </div>
    </motion.div>
  );
};

export default BlogsCard;
