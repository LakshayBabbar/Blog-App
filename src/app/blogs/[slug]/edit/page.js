"use client";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import useSend from "@/hooks/useSend";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { modules } from "@/lib/quill";
import { Textarea } from "@/components/ui/textarea";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";

const UpdateBlog = ({ params }) => {
  const { data: blogData } = useFetch(`/api/blogs/${params.slug}`, params.slug);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    img: null,
  });
  const [content, setContent] = useState("");
  const { fetchData, loading, err, isErr } = useSend();
  const router = useRouter();
  const { status, data: sessionData } = useSession();
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    setFormData({
      title: blogData?.title,
      description: blogData?.description,
      content: blogData?.content,
      img: null,
    });
    setFeatured(blogData?.featured);
    setContent(blogData?.content);
  }, [blogData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append("title", formData.title);
    updateData.append("description", formData.description);
    updateData.append("content", content);
    updateData.append("featured", featured);
    updateData.append("category", blogData.category);
    if (formData.img) {
      updateData.append("img", formData.img);
    }
    const response = await fetchData(
      `/api/blogs/${blogData._id}/edit`,
      "PUT",
      updateData
    );
    if (response?.success) {
      router.push(`/blogs/${params.slug}`);
    }
  };

  if (
    blogData?.userId !== sessionData?.user?.id ||
    status === "unauthenticated"
  ) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <h1 className="text-xl ">You are authorized to perform this action.</h1>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="my-24 sm:my-36 flex justify-center">
      {blogData && (
        <form
          className="w-[85%] xl:w-[50rem] flex flex-col gap-10 items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4 items-center justify-between w-full">
            <Input
              type="text"
              className="w-full h-12"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <Button
              variant="outline"
              className="h-12"
              type="button"
              onClick={() => setFeatured(!featured)}
            >
              {featured ? (
                <MdFavorite className="text-red-500 text-2xl" />
              ) : (
                <MdFavoriteBorder className="text-2xl" />
              )}
            </Button>
          </div>
          <label htmlFor="img" className="relative w-full">
            <Image
              src={
                formData.img
                  ? URL.createObjectURL(formData.img)
                  : blogData?.img?.url
              }
              alt="Blog Image"
              width={500}
              height={300}
              className="hover:brightness-50 w-full h-auto object-cover"
              priority
            />
            <FaRegEdit
              className="absolute top-5 right-5 text-white text-4xl cursor-pointer"
              onClick={() => document.getElementById("img").click()}
            />
          </label>
          <input
            type="file"
            className="hidden"
            id="img"
            onChange={(e) =>
              setFormData({ ...formData, img: e.target.files[0] })
            }
            accept="image/jpeg, image/jpg, image/png, image/webp"
          />
          <Textarea
            name="description"
            value={formData?.description}
            onChange={handleChange}
          />
          <div className="w-full">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
            />
          </div>
          <div className="w-full flex gap-4 justify-end">
            <Button
              onClick={() => router.push(`/blogs/${params.slug}`)}
              type="reset"
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} size="lg">
              Update
            </Button>
          </div>
          {isErr && <p className="text-red-500">{err}</p>}
        </form>
      )}
    </div>
  );
};

export default UpdateBlog;
