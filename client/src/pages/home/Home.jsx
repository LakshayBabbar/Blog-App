import { Link, useSearchParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { categories, capitalizeFirstLetter } from "../../utils/categories";
import useFetch from "../../hooks/useFetch";
import Footer from "../../components/Footer";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const { data, loading } = useFetch(
    "get-blogs/?category=" + category,
    `home/category=${category}`
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="ml-4 md:ml-0 w-[90%] md:w-[80%] xl:w-[65%] md:text-center flex flex-col gap-5 md:gap-10 md:items-center mt-20 xl:mt-[10vh] z-10">
        <h1 className="text-5xl leading-tight md:text-6xl md:leading-tight xl:text-7xl xl:leading-tight font-bold mt-5 md:mt-20">
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
        <div className="flex gap-4">
          <Link to="/auth?mode=login">
            <button className="w-40 sm:w-44 p-3 font-[500] shadow-md bg-white text-black rounded-xl">
              Log in
            </button>
          </Link>
          <Link to="/users">
            <button className="w-40 sm:w-44 p-3 shadow-md font-[500] bg-bak2 text-white rounded-xl">
              Creators
            </button>
          </Link>
        </div>
      </div>
      {/* <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 sm:space-x-20 mb-10 sm:mb-20">
          {images.map((item, index) => {
            return (
              <motion.div
                key={index}
                style={{ x: translateX }}
                className="w-72 sm:w-[25rem]"
              >
                <img src={item} alt="pic" className="rounded-xl" />
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x space-x-10 sm:space-x-20 mb-10 sm:mb-20">
          {images2.map((item, index) => {
            return (
              <motion.div
                key={index}
                style={{ x: translateXReverse }}
                className="w-72 sm:w-[25rem]"
              >
                <img src={item} alt="pic" className="rounded-xl" />
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 sm:space-x-20 mb-20">
          {images3.map((item, index) => {
            return (
              <motion.div
                key={index}
                style={{ x: translateX }}
                className="w-72 sm:w-[25rem]"
              >
                <img src={item} alt="pic" className="rounded-xl" />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div> */}
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
            <h1>
              Cannot find any blog with &#39;{searchParams.get("category")}&#39;
              category.
            </h1>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
