/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";

const Card = ({ data }) => {
  const title =
    data.title.length > 65 ? data.title.substring(0, 65) + "..." : data.title;
  const desc = data.description;
  const description = desc.length > 140 ? desc.substring(0, 140) + "..." : desc;
  const date = data.createdAt;
  const redirect = useNavigate();

  return (
    <div className="w-4/5 bg-[rgba(255,255,255,0.5)] md:w-[25rem] flex flex-col rounded-md shadow-md border">
      <img
        src={data.img}
        alt="thubmnail"
        className="w-full aspect-video rounded-t-md"
      />
      <div className=" flex flex-col gap-2 p-4 justify-between">
        <span className="py-1 px-2 bg-purple-500 w-[fit-content] rounded-sm text-white text-sm">
          {data.category.toUpperCase()}
        </span>
        <h1
          className="text-2xl hover:underline cursor-pointer"
          onClick={() => redirect(`/users/${data.author}/${data._id}`)}
        >
          {title}
        </h1>
        <p className="text-gray-600">{description}</p>
        <Link
          className="text-gray-600 hover:underline"
          to={`/users/${data.author}`}
        >
          @{data.author}
        </Link>
        <p className="text-gray-600">{date && date.substring(0, 10)}</p>
      </div>
    </div>
  );
};

export default Card;
