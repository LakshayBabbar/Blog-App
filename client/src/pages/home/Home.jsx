import { Link, useSearchParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { categories, capitalizeFirstLetter } from "../../utils/categories";
import useFetch from "../../hooks/useFetch";
import Footer from "../../components/Footer";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { images, images2, images3 } from "../../utils/list";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const { data, loading } = useFetch(
    "get-blogs/?category=" + category,
    `home/category=${category}`
  );
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 200, damping: 40, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.1, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="ml-4 md:ml-0 w-[90%] md:w-[80%] xl:w-[65%] md:text-center flex flex-col gap-5 md:gap-10 md:items-center mt-36 z-10">
        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mt-5 md:mt-20">
          Unlock Your Creativity: Explore a World of Inspiration with Our
          Blogging Platform
        </h1>
        <p className="md:w-[70%] text-xl">
          Ignite your passion for writing and share your voice with the world
          through our intuitive blogging platform. Unleash your creativity and
          join a community of fellow bloggers today.
        </p>
        {/*         <div className="bg-bak w-full h-[60%] top-80 blur-[200px] z-[-1] absolute" /> */}
        <div className="flex gap-4">
          <Link to="/auth?mode=login">
            <button className="w-40 sm:w-44 p-3 font-[500] shadow-md bg-white text-black rounded-full">
              Log in
            </button>
          </Link>
          <Link to="/users">
            <button className="w-40 sm:w-44 p-3 shadow-md font-[500] bg-bak2 text-white rounded-full">
              Creators
            </button>
          </Link>
        </div>
      </div>
      <motion.div
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
      </motion.div>
      <div
        className="mt-[35rem] space-y-10 w-[80%] md:w-[52rem] xl:w-[80rem]"
        id="blogs"
      >
        <h1 className="text-4xl">Categories</h1>
        <ul className="flex gap-4 flex-wrap">
          {categories.map((items, index) => {
            return (
              <li
                key={index}
                className="p-4 bg-zinc-800 py-1 shadow-md text-white rounded-full cursor-pointer"
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
          <h1>Loading...</h1>
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
