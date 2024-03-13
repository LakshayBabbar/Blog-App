import { Link, useSearchParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { categories, capitalizeFirstLetter } from "../../utils/categories";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";
import { BiSearchAlt } from "react-icons/bi";
import Footer from "../../components/Footer";
import { useRef, useState } from "react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const search = useRef("");
  const [searchRes, setSearchRes] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { data, loading } = useFetch(
    `get-blogs/?category=${category}`,
    `home/${category}`
  );
  const { fetchData } = useSend();

  const searchHandler = async () => {
    const res = await fetchData(`search/${search.current.value}`);
    setSearchRes(res);
    res && res.length > 0 && setIsFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="ml-4 md:ml-0 w-[90%] md:w-[80%] xl:w-[65%] md:text-center flex flex-col gap-5 md:gap-10 md:items-center z-10 my-20 sm:my-[15vh]">
        <h1 className="text-5xl leading-tight md:text-6xl md:leading-tight xl:text-7xl xl:leading-tight font-bold mt-5">
          Unlock Your Creativity:{" "}
          <span className="text-transparent bg-bak2 bg-clip-text">
            Explore a World of Inspiration with Our Blogging Platform
          </span>
        </h1>
        <p className="md:w-[70%] text-xl">
          Ignite your passion for writing and share your voice with the world
          through our intuitive blogging platform. Unleash your creativity and
          join a community of fellow bloggers today.
        </p>
        <div className="md:w-96 xl:w-[30rem] relative">
          <input
            type="text"
            className="h-11 w-full rounded-xl bg-transparent border-2 border-pink-500 outline-none px-5"
            placeholder="Search Blogs"
            ref={search}
            onChange={searchHandler}
            onFocus={() => setIsFocused(true)}
            onBlur={handleInputBlur}
          />
          <button type="submit" className="absolute h-11 right-5 text-xl">
            <BiSearchAlt />
          </button>
          {searchRes && searchRes.length > 0 && isFocused && (
            <div className="absolute bg-[rgba(0,0,0,0.19)] mt-5 p-5 rounded-xl max-h-80 overflow-y-scroll">
              <ul className="w-96 flex flex-col gap-2 items-start">
                {searchRes.map((blogs) => {
                  return (
                    <li
                      key={blogs._id}
                      className="p-2 rounded-xl hover:bg-white hover:text-black flex items-center h-10 text-left"
                    >
                      <Link
                        to={`/blogs/${blogs._id}`}
                        className="cursor-pointer flex gap-2 items-center"
                      >
                        <BiSearchAlt />
                        <p className="line-clamp-1">{blogs.title}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bg-bak2 size-36 top-0 left-0 sm:left-48 blur-[90px] sm:blur-[70px] xl:blur-[120px] -rotate-45 animate-pulse-slow" />
      <div className="absolute bg-bak2 size-20 bottom-40 right-0 sm:right-48 blur-[90px] sm:blur-[70px] xl:blur-[120px] rounded-full animate-bounce-slow" />
      <div className="absolute bg-bak2 size-40 top-52 right-0 sm:right-32 blur-[90px] sm:blur-[70px] xl:blur-[120px] rounded-full animate-bounce-slow" />
      <div className="absolute bg-bak2 size-28 bottom-0 sm:bottom-24 left-0 sm:left-48 blur-[90px] sm:blur-[70px] xl:blur-[120px] rounded-full animate-bounce-slow" />
      <div className="absolute bg-bak2 sm:size-36 bottom-60 blur-[90px] sm:blur-[70px] xl:blur-[120px] rounded-full animate-pulse-slow" />
      <div className="space-y-10 w-[80%] md:w-[52rem] xl:w-[80rem]" id="blogs">
        <h1 className="mt-40 text-4xl">Categories</h1>
        <ul className="flex gap-4 flex-wrap">
          {categories.map((items, index) => {
            return (
              <li
                key={index}
                className={`p-4 py-1 shadow-md rounded-full cursor-pointer ${
                  category === items ? "bg-bak2" : "text-white bg-zinc-800"
                }`}
              >
                <Link to={`/?category=${items}`}>
                  {capitalizeFirstLetter(items)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center mt-20">
        {loading ? (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
        ) : data.length > 0 ? (
          data.map((items) => {
            return <BlogsCard key={items._id} data={items} />;
          })
        ) : (
          <div className="xl:col-span-3 flex justify-center items-center">
            <h1>Cannot find any blog with &#39;{category}&#39; category.</h1>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
