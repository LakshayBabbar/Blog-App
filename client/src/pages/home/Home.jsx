import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { categories, capitalizeFirstLetter } from "../../utils/categories";

const Home = () => {
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const fetchdata = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "all-blogs/?category=" + category
      );
      const resData = await response.json();
      setData(resData);
      console.log(resData);
    };
    fetchdata();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-28">
      <div className="md:w-[80%] xl:w-[65%] md:text-center flex flex-col gap-5 md:gap-10 items-center">
        <h1 className="text-5xl md:text-6xl font-[700] ml-4 sm:ml-0 mt-5 md:mt-20">
          Unlock Your Creativity:{" "}
          <span className="text-transparent bg-bak2 bg-clip-text">
            Explore a World of Inspiration with Our Blogging Platform
          </span>
        </h1>
        <p className="ml-4 md:w-[80%] text-xl font-[500]">
          Ignite your passion for writing and share your voice with the world
          through our intuitive blogging platform. Unleash your creativity and
          join a community of fellow bloggers today.
        </p>
        <div className="bg-bak w-full h-[60%] top-80 blur-[200px] z-[-1] absolute" />
        <div className="flex gap-4">
          <button className="w-40 sm:w-44 p-3 font-[500] shadow-md bg-white rounded-full">
            <Link to="/auth?mode=login">Log in</Link>
          </button>
          <button className="w-40 sm:w-44 p-3 shadow-md font-[500] bg-bak2 text-white rounded-full">
            <Link to="/users">Connect Others</Link>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center mt-10">
        <div className="w-[80%] md:w-[25rem] xl:w-96 bg-[rgba(255,255,255,0.3)] rounded-md px-4 py-6 flex flex-col gap-4">
          <Link to="/blogs/create-blog">
            <button className="bg-bak2 w-full h-10 rounded-xl shadow-md font-bold text-white">
              Create Blog
            </button>
          </Link>
          <h2 className="text-xl">Categories</h2>
          <ul className="flex gap-2 w-full flex-wrap">
            {categories.map((items, index) => {
              return (
                <li
                  key={index}
                  className="p-4 bg-purple-500 py-1 shadow-md text-white rounded-full cursor-pointer"
                >
                  <Link to={`/?category=${items}`}>
                    {capitalizeFirstLetter(items)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {data.length > 0 ? (
          data.map((items) => {
            return <BlogsCard key={items._id} data={items} />;
          })
        ) : (
          <div className="xl:col-span-2 flex justify-center items-center">
            <h1>
              Cannot find any blog with &#39;{searchParams.get("category")}&#39;
              category.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
