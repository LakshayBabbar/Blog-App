import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const params = useParams();
  const [data, setData] = useState();
  const history = useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "get-blog/" + params.blogId
      );
      if (!response.ok) {
        return undefined;
      }
      const resData = await response.json();
      setData(resData);
    };
    fetchdata();
  }, [params]);
  console.log(data);
  return (
    <div className="flex flex-col items-center">
    <div className="flex items-center mt-24 gap-1 underline cursor-pointer w-[85%] md:w-[70%] xl:w-[50%]" onClick={()=>history(-1)}><IoArrowBack />Go back</div>
      {data ? (
        <div className="flex flex-col gap-10 w-[85%] md:w-[70%] xl:w-[50%] my-10">
        <h1 className="text-4xl">{data.title}</h1>
        <img src={data.img} alt="blog image" />
        <div className="flex justify-between w-full">
        <Link to={`/users/${data.author}`} className="cursor-pointer hover:underline">By {data.author}</Link>
        <span>Created on: {data.date}</span>
        </div>
        <p>{data.description}</p>
        </div>
        ) : (
          <h1 className="text-2xl font-light my-10">Blog not found.</h1>
          )}
    </div>
  );
};

export default Blogs;
