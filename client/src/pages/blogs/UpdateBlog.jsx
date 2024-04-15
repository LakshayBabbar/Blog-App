import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";
import ReactQuill from "react-quill";
import Button from "../../components/ui/Button";
import { Input } from "@/components/ui/input";
import "react-quill/dist/quill.snow.css";

const UpdateBlog = () => {
  const params = useParams();
  const { data: fd } = useFetch(`/get-blog/${params.blogId}`, params.blogId);
  const [data, setData] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const { fetchData, loading } = useSend();
  const history = useNavigate();

  useEffect(() => {
    setData(fd);
    setDesc(fd.description);
  }, [fd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", desc);
    if (img) {
      formData.append("img", img);
    }
    await fetchData(`/update-blog/${params.blogId}`, "PUT", formData);
    formData.delete("title");
    formData.delete("description");
    formData.delete("img");
    history(-1);
  };

  return (
    <div className="my-24 sm:my-36 flex justify-center">
      {data && (
        <form
          className="w-[85%] xl:w-[50rem] flex flex-col gap-10 items-center"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            className="w-full h-12"
            value={data.title}
            onChange={(e) =>
              setData((prev) => {
                return { ...prev, title: e.target.value };
              })
            }
          />
          <label htmlFor="img" className="relative">
            <img
              src={img ? URL.createObjectURL(img) : data.img.url}
              alt="blog image"
              className="hover:brightness-50"
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
            onChange={(e) => setImg(e.target.files[0])}
            accept="image/*"
          />
          <div className="w-full">
            <ReactQuill theme="snow" value={desc} onChange={setDesc} />
          </div>
          <div className="flex gap-5 w-[full]">
            <Button onClick={() => history(-1)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              Update
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateBlog;
