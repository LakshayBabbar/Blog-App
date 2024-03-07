import { categories, capitalizeFirstLetter } from "../../utils/categories";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import useSend from "../../hooks/useSend";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [category, setCategory] = useState("all");
  const formData = new FormData();
  const redirect = useNavigate();
  const { fetchData, loading } = useSend();

  const submitHandler = async (e) => {
    e.preventDefault();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("category", category);
    if (img) {
      formData.append("img", img);
    }
    const response = await fetchData("create-blog", "POST", formData);
    console.log(response);
    setImg(null);
    formData.delete("img");
    formData.delete("title");
    formData.delete("category");
    formData.delete("description");
    return redirect("/");
  };

  return (
    <div className="flex justify-center mt-28">
      <div className="flex flex-col sm:p-10 w-[90%] sm:w-[30rem] xl:w-[35rem] h-[fit-content] gap-8 sm:shadow-xl sm:border  rounded-xl bg-white">
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
            className="border border-slate-300 rounded-md px-2 h-10 focus:outline-0"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CKEditor
            editor={ClassicEditor}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDesc(data);
            }}
          />
          <div className="flex gap-4 flex-col sm:flex-row">
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-300 p-2 rounded-md flex-grow"
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
              className="cursor-pointer text-white flex-grow bg-bak2 font-bold p-2 rounded-md flex items-center justify-center gap-2"
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
            className="border h-10 rounded-md bg-bak2 text-white font-bold disabled:brightness-50"
            disabled={loading}
          >
            Create
          </button>
          <h1>{loading && "Processing...Please Wait."}</h1>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
