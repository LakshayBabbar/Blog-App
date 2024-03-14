import { categories, capitalizeFirstLetter } from "../../utils/categories";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useSend from "../../hooks/useSend";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [category, setCategory] = useState("all");
  const formData = new FormData();
  const redirect = useNavigate();
  const { fetchData, loading, error } = useSend();

  const submitHandler = async (e) => {
    e.preventDefault();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("category", category);
    if (img) {
      formData.append("img", img);
    }
    const response = await fetchData("create-blog", "POST", formData);
    if (!response) {
      return null;
    }
    setImg(null);
    formData.delete("img");
    formData.delete("title");
    formData.delete("category");
    formData.delete("description");
    return redirect("/");
  };

  return (
    <div className="flex justify-center my-24 sm:mt-36">
      <div className="flex flex-col sm:p-10 w-[90%] sm:w-[30rem] xl:w-[35rem] h-[fit-content] gap-8 sm:shadow-xl sm:border border-zinc-600 rounded-xl">
        <h1 className="text-3xl">What&#39;s on your mind?</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <input
            type="text"
            name="title"
            required
            className="w-full border h-12 bg-zinc-800 rounded-md px-5 border-zinc-600 selection:bg-purple-300"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill theme="snow" value={desc} onChange={setDesc} />
          <div className="flex gap-4 flex-col sm:flex-row">
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              className="border border-zinc-700 flex-grow px-5 h-12 rounded-md bg-zinc-900 disabled:bg-gray-600"
            >
              {categories.map((items, index) => {
                return (
                  <option value={items} key={index}>
                    {capitalizeFirstLetter(items)}
                  </option>
                );
              })}
            </select>
            <label
              htmlFor="input-file"
              className="cursor-pointer flex items-center justify-center gap-2 flex-grow border h-12 bg-zinc-800 rounded-md border-zinc-600 selection:bg-purple-300"
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
              required
            />
          </div>
          {img && (
            <img
              src={URL.createObjectURL(img)}
              alt="Preview"
              className="aspect-video object-contain"
            />
          )}
          <button
            type="submit"
            className="border border-zinc-700 w-full h-12 rounded-md bg-zinc-900 disabled:bg-gray-600"
            disabled={loading}
          >
            Create
          </button>
          <h1 className="text-center">
            {loading && "Processing...Please Wait."}
          </h1>
          {!loading && error && (
            <h1 className="text-red-500 text-center">
              Error while creating blog.
            </h1>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
