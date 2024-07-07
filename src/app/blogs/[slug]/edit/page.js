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

const UpdateBlog = ({ params }) => {
  const { data: blogData } = useFetch(`/api/blogs/${params.slug}`, params.slug);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: null,
  });
  const [description, setDescription] = useState("");
  const { fetchData, loading, err, isErr } = useSend();
  const router = useRouter();
  const { status, data: sessionData } = useSession();

  useEffect(() => {
    setFormData({
      title: blogData?.title,
      description: blogData?.description,
      img: null,
    });
    setDescription(blogData?.description);
  }, [blogData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append("title", formData.title);
    updateData.append("description", description);
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

  return (
    <div className="my-24 sm:my-36 flex justify-center">
      {blogData && (
        <form
          className="w-[85%] xl:w-[50rem] flex flex-col gap-10 items-center"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            className="w-full h-12"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
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
          <div className="w-full">
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
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
