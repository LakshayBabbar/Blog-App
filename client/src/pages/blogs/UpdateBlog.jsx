import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthContext } from "../../context/Authentication";
import { FaRegEdit } from "react-icons/fa";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const UpdateBlog = () => {
  const params = useParams();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [title, setTitle] = useState("");
  const { token } = useContext(AuthContext);
  const history = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/get-blog/${params.blogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const resData = await response.json();
        console.log(resData);
        setTitle(resData.blogs.title);
        setDesc(resData.blogs.description);
        setImg(resData.blogs.img.url);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (img) {
      formData.append("img", img);
    }

    try {
      const updateData = await fetch(
        `http://localhost:3000/update-blog/${params.blogId}`,
        {
          method: "PUT",
          headers: {
            authorization: token,
          },
          body: formData,
        }
      );
      if (!updateData.ok) {
        throw new Error("Failed to update data");
      }

      const resData = await updateData.json();
      console.log(resData);
      history(-1);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="my-28 flex justify-center">
      <form
        className="w-[85%] xl:w-[50rem] flex flex-col gap-10 items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="w-full border h-14 rounded-md px-5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="img" className="relative">
          {img ? (
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt="blog image"
              className="hover:brightness-50"
            />
          ) : (
            <div>No image selected</div>
          )}
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
        />
        <div className="w-full">
          <CKEditor
            editor={ClassicEditor}
            data={desc}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDesc(data);
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
            className="w-36 bg-bak2 h-11 sm:w-44 rounded-md text-white font-bold"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
