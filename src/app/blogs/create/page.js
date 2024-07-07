"use client";
import { categories, capitalizeFirstLetter } from "@/lib/categories";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { useRouter } from "next/navigation";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Button from "@/components/ui/Button";
import useSend from "@/hooks/useSend";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import dynamic from "next/dynamic";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [category, setCategory] = useState("all");
  const redirect = useRouter();
  const { fetchData, loading, err, isErr } = useSend();
  const { toast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("category", category || "all");
    if (img) {
      formData.append("img", img);
    }
    const response = await fetchData("/api/blogs/create", "POST", formData);
    const date = new Date();
    toast({
      title: response?.message,
      description: date.toString(),
    });
    setImg(null);
    if (response?.success) {
      return redirect.push(`/blogs/${response.url}`);
    }
  };

  return (
    <div className="flex justify-center my-24 sm:mt-36">
      <div className="flex flex-col sm:p-10 w-[90%] sm:w-[45rem] h-[fit-content] gap-8 rounded-xl sm:border ">
        <div className="space-y-2 text-sm">
          <h1 className="text-4xl font-[500]">What&#39;s on your mind?</h1>
          <p className="text-slate-300">
            Start sharing your thoughts and stories with the world by crafting
            your own unique blog on our platform.
          </p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <Input
            type="text"
            name="title"
            required
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill theme="snow" value={desc} onChange={setDesc} />
          <div className="flex gap-4 flex-col sm:flex-row">
            <Select
              name="category"
              onValueChange={(value) => setCategory(value)}
              value={category}
            >
              <SelectTrigger className="flex-grow sm:w-[50%] h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((items, index) => {
                  return (
                    <SelectItem value={items} key={index}>
                      {capitalizeFirstLetter(items)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <label
              htmlFor="input-file"
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground gap-2 flex-grow h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <FaUpload /> Upload File
            </label>
            <input
              type="file"
              name="img"
              onChange={(e) => setImg(e.target.files[0])}
              className="hidden"
              id="input-file"
              accept="image/*"
            />
          </div>
          {img && (
            <Image
              src={URL.createObjectURL(img)}
              alt="Preview"
              width={300}
              height={200}
              className="aspect-video object-contain w-auto h-auto"
            />
          )}
          <Button type="submit" disabled={loading}>
            Create
          </Button>
          <h1 className="text-center">
            {loading && "Processing...Please Wait."}
          </h1>
          {!loading && isErr && (
            <h1 className="text-red-500 text-center">{err}</h1>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
