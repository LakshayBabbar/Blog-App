import { useState } from "react";
import { useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";

const UpdateBlog = () => {
  const params = useParams();
  const [img, setImg] = useState(null);
  const { data, setData } = useFetch(`get-blog/${params.blogId}`);
  const { fetchData, loading } = useSend();
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (img) {
      formData.append("img", img);
    }
    await fetchData(`update-blog/${params.blogId}`, "PUT", formData);
    formData.delete("title");
    formData.delete("description");
    formData.delete("img");
    history(-1);
  };

  return (
    <div className="my-28 flex justify-center">
      {data && (
        <form
          className="w-[85%] xl:w-[50rem] flex flex-col gap-10 items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="w-full border h-14 rounded-md px-5"
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
            <CKEditor
              editor={ClassicEditor}
              data={data.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setData((prev) => {
                  return { ...prev, description: data };
                });
              }}
            />
          </div>
          <div className="flex gap-5 w-[full]">
            <button
              type="button"
              className="w-36 bg-bak2 h-11 sm:w-44 rounded-md text-white font-bold"
              onClick={() => history(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-36 bg-bak2 h-11 sm:w-44 rounded-md text-white font-bold disabled:brightness-75"
              disabled={loading}
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateBlog;
