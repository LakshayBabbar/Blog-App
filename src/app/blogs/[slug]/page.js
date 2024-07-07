import parse from "html-react-parser";
import Footer from "@/components/Footer";
import { getData } from "@/lib/helpers";
import Image from "next/image";
import Link from "next/link";
import Comments from "@/components/Blogs/Comments";
import BlogCustomization from "@/components/Blogs/BlogCustomization";

export const generateMetadata = async ({ params }) => {
  const data = await getData(`/api/blogs/${params.slug}`);
  if ("error" in data) {
    return { title: "Blog Not Found", description: "Blog Not Found" };
  }
  return {
    title: data.title,
    description: data.description.substring(0, 160),
    creator: data.author,
    alternates: {
      canonical: `https://www.legitblogs.me/blogs/${params.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.description.substring(0, 200),
      url: "https://www.legitblogs.me/blogs/" + params.slug,
      siteName: "Legit Blogs",
      images: [
        {
          url: data.img.url,
          width: 800,
          height: 600,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description.substring(0, 160),
      images: [data.img.url],
    },
  };
};

const Blog = async ({ params }) => {
  const { slug } = params;
  const data = await getData(`/api/blogs/${slug}`, true);

  return (
    <div className="flex flex-col items-center mt-20">
      {"error" in data ? (
        <h1>{data.error}</h1>
      ) : (
        <div className="w-[85%] md:w-[70%] xl:w-[55%]">
          <div className="flex flex-col gap-10 my-10">
            <div className="space-y-5">
              <BlogCustomization
                slug={params.slug}
                blogId={data?._id}
                userId={data?.userId}
              />
              <h1 className="text-4xl md:text-5xl font-arapey">{data.title}</h1>
            </div>
            <Image
              src={data.img.url}
              alt={data.title}
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
            <div className="flex justify-between w-full">
              <Link
                href={`/users/${data.author}`}
                className="cursor-pointer hover:underline"
                aria-label={`Author: ${data.author}`}
              >
                By {data.author}
              </Link>
              <span>
                Created on: {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
            <article className="prose-neutral prose-lg lg:prose-xl text-gray-300">
              {parse(data.description)}
            </article>
            <Comments blogId={data._id} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Blog;
