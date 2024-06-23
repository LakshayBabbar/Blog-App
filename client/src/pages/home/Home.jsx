import { Link, useSearchParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { categories, capitalizeFirstLetter } from "../../lib/categories";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";
import { BiSearchAlt } from "react-icons/bi";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const pageNo = Number(searchParams.get("page")) || 1;
  const { fetchData } = useSend();
  const navigate = useNavigate();

  const {
    searchTerm,
    searchResults,
    isFocused,
    setIsFocused,
    handleChange,
    handleInputBlur,
  } = useDebouncedSearch(fetchData);

  const { data, loading, refetch } = useFetch(
    `/get-blogs/?category=${category}&page=${pageNo}&limit=9`,
    `home/${category}`
  );

  useEffect(() => {
    if ((data && pageNo > data.totalPages) || pageNo < 1) {
      navigate("/");
    }
    refetch();
  }, [pageNo, refetch, navigate, data]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Helmet>
        <title>Blog-Tech</title>
        <meta
          name="description"
          content="Ignite your passion for writing and share your voice with the world through our intuitive blogging platform. Unleash your creativity and join a community of fellow bloggers today."
        />
      </Helmet>
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-[0.05]" />
      <div className="absolute size-96 bg-neutral-700 top-0 rounded-full blur-[150px] -z-50" />
      <div className="my-44 sm:my-52 flex flex-col gap-14 items-center justify-center text-center">
        <h1 className="text-5xl md:w-[75%] md:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 leading-tight px-4 md:px-0">
          Start Sharing Your Voice Today!
        </h1>
        <p className="w-11/12 md:w-[55%] sm:text-xl text-slate-400">
          Ignite your passion for writing and share your voice with the world
          through our{" "}
          <span className="text-slate-100">intuitive blogging platform.</span>{" "}
          Unleash your creativity and join a community of fellow bloggers today.
        </p>
        <div className="w-4/5 md:w-[40%] relative">
          <Input
            type="text"
            placeholder="Search Blogs"
            className="rounded-xl h-12 bg-transparent backdrop-blur-sm"
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleInputBlur}
          />
          <BiSearchAlt className="absolute h-11 top-1 right-5 text-xl" />
          {searchResults && searchResults.length > 0 && isFocused && (
            <motion.div
              className="absolute backdrop-blur-xl bg-slate-950 mt-5 p-5 rounded-xl max-h-80 overflow-y-scroll"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <ul className="w-[30rem] flex flex-col gap-2 items-start">
                {searchResults.map((blogs) => {
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
            </motion.div>
          )}
        </div>
      </div>
      <div className="space-y-10 w-[80%] md:w-[50rem] xl:w-[80rem]" id="blogs">
        <h1 className="text-3xl sm:text-4xl">Categories</h1>
        <ul className="flex gap-4 flex-wrap leading-loose">
          {categories.map((items, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/?category=${items}&page=${pageNo}`}
                  className={`px-4 py-[6px] shadow-md rounded-full cursor-pointer ${
                    category === items
                      ? "bg-white text-black"
                      : "text-white bg-zinc-800"
                  }`}
                >
                  {capitalizeFirstLetter(items)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center mt-20">
        {loading ? (
          Array.from({ length: 9 }).map((items, index) => {
            return (
              <div
                className="flex flex-col space-y-3 w-[80vw] md:w-[25rem]"
                key={index}
              >
                <Skeleton className="h-[12rem] md:h-[14rem] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <div className="flex gap-2">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="w-3/5 space-y-2">
                      <Skeleton className="w-3/5 h-3 " />
                      <Skeleton className="w-2/5 h-3   " />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : data && data.blogs.length > 0 ? (
          data.blogs.map((items) => {
            return <BlogsCard key={items._id} data={items} />;
          })
        ) : (
          <div className="col-span-3 flex justify-center items-center">
            <h1>Cannot find any blog.</h1>
          </div>
        )}
      </div>
      <section className="flex mt-20 gap-4 items-center">
        {pageNo > 1 && (
          <Link
            to={`/?category=${category}&page=${Number(pageNo) - 1}`}
            className="py-2 px-4 bg-secondary rounded-md text-sm disabled:opacity-[0.7] disabled:cursor-not-allowed"
          >
            Prev
          </Link>
        )}
        <p className="text-slate-200 text-sm">
          {pageNo} of {data && data.totalPages}
        </p>
        {data && pageNo < data.totalPages && (
          <Link
            to={`/?category=${category}&page=${Number(pageNo) + 1}`}
            disabled={data && pageNo >= data.totalPages}
            className="py-2 px-4 bg-secondary rounded-md text-sm disabled:opacity-[0.7] disabled:cursor-not-allowed"
          >
            Next
          </Link>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Home;
