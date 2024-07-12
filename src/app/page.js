import Link from "next/link";
import BlogsCard from "@/components/Blogs/BlogsCard";
import { categories, capitalizeFirstLetter } from "@/lib/categories";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/helpers";
import SearchBar from "@/components/SearchBar";
import Script from "next/script";

export async function generateMetadata() {
  return {
    title: "Discover Engaging and Insightful Blogs",
    description:
      "Explore a wide range of captivating blogs on Legit Blogs. Join our community of readers today.",
    metadatabase: new URL("https://www.legitblogs.me"),
    alternates: {
      canonical: `https://www.legitblogs.me`,
    },
  };
}

const Home = async ({ searchParams }) => {
  const category = searchParams.category || "all";
  const pageNo = parseInt(searchParams.page) || 1;
  const data = await getData(
    `/api/blogs?category=${category}&page=${pageNo}&limit=9`
  );

  return (
    <div>
      <header>
        <div className="my-44 sm:my-52 flex flex-col gap-14 items-center justify-center text-center">
          <h1 className="text-5xl md:w-[75%] md:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 leading-tight px-4 md:px-0">
            Discover Engaging and Insightful Blogs
          </h1>
          <p className="w-11/12 md:w-[55%] sm:text-xl text-slate-400">
            Explore a wide range of captivating blogs through our{" "}
            <span className="text-slate-100">intuitive platform.</span> Join our
            community of avid readers today.
          </p>
          <SearchBar type="Blogs" url="/api/blogs/search?term=" />
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-[0.05]" />
          <div className="absolute size-96 bg-neutral-700 top-0 rounded-full blur-[150px] -z-50" />
        </div>
      </header>
      <main className="flex flex-col items-center justify-center">
        <section
          className="space-y-10 w-[80%] md:w-[45rem] xl:w-[80rem]"
          id="blogs"
        >
          <h2 className="text-3xl sm:text-4xl">Categories</h2>
          <ul className="flex gap-4 flex-wrap leading-loose">
            {categories.map((items, index) => (
              <li key={index}>
                <Link
                  href={`/?category=${items}&page=1&limit=9#blogs`}
                  className={`px-4 py-[6px] shadow-md rounded-full cursor-pointer ${
                    category === items
                      ? "bg-white text-black"
                      : "text-white bg-zinc-800"
                  }`}
                >
                  {capitalizeFirstLetter(items)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center mt-20">
          {!data ? (
            Array.from({ length: 9 }).map((items, index) => (
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
            ))
          ) : "error" in data ? (
            <h2 className="absolute text-center">{data.error}</h2>
          ) : data?.blogs.length > 0 ? (
            data.blogs.map((items, index) => (
              <BlogsCard key={items._id} data={items} />
            ))
          ) : (
            <div className="col-span-3 flex justify-center items-center">
              <h3>Cannot find any blog.</h3>
            </div>
          )}
        </section>
        <section className="flex mt-20 gap-4 items-center">
          {pageNo > 1 && (
            <Link
              href={`/?category=${category}&page=${Number(pageNo) - 1}#blogs`}
              className="py-2 px-4 bg-secondary rounded-md text-sm disabled:opacity-[0.7] disabled:cursor-not-allowed"
            >
              Prev
            </Link>
          )}
          <p className="text-slate-200 text-sm">
            Page {pageNo} of {data?.totalPages || 1}
          </p>
          {pageNo < data?.totalPages && (
            <Link
              href={`/?category=${category}&page=${Number(pageNo) + 1}#blogs`}
              disabled={pageNo >= data?.totalPages}
              className="py-2 px-4 bg-secondary rounded-md text-sm disabled:opacity-[0.7] disabled:cursor-not-allowed"
            >
              Next
            </Link>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
