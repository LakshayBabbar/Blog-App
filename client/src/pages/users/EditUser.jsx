import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authentication";
import useSend from "../../hooks/useSend";
import useFetch from "../../hooks/useFetch";

const EditUser = () => {
  const params = useParams();
  const history = useNavigate();
  const { setIsAuth } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const { fetchData, loading } = useSend();
  const { data: fd } = useFetch(`users/${params.username}`, params.username);
  const [data, setData] = useState();
  useEffect(() => setData(fd), [fd]);

  const handelData = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("bio", data.bio);
    if (img) {
      formData.append("img", img);
    }
    await fetchData("update-user", "PUT", formData);
    formData.delete("firstname");
    formData.delete("lastname");
    formData.delete("bio");
    formData.delete("img");
    history(-1);
  };

  const accountCloseHandler = async () => {
    const isSure = confirm("Are you sure to close your account?");
    if (isSure) {
      await fetchData("delete-user", "DELETE");
      setIsAuth(false);
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      return history("/", { replace: true });
    }
  };

  return (
    <div className="my-24 sm:my-36 flex flex-col items-center gap-5">
      {data && (
        <form
          className="w-[80%] md:w-[60%] xl:w-[40%] flex flex-col gap-4 items-center"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <label htmlFor="img">
            <img
              src={img ? URL.createObjectURL(img) : data.profileImg.url}
              alt="Profile pic"
              className="rounded-full w-48 sm:w-64 hover:brightness-75 aspect-square object-cover cursor-pointer"
            />
          </label>
          <input
            type="file"
            id="img"
            onChange={(e) => setImg(e.target.files[0])}
            className="hidden"
            accept="image/*"
          />
          <div className="w-full space-y-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={data.username}
              onChange={() => alert("Username cannot be changed.")}
              className="w-full border h-12 bg-zinc-800 rounded-md px-5 border-zinc-600 selection:bg-purple-300"
            />
          </div>
          <div className="flex gap-5 w-full flex-col sm:flex-row">
            <div className="flex flex-col flex-grow space-y-2">
              <label htmlFor="firstname" className="">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={data.firstname}
                onChange={handelData}
                className="w-full border h-12 bg-zinc-800 rounded-md px-5 border-zinc-600 selection:bg-purple-300"
              />
            </div>
            <div className="flex flex-col flex-grow space-y-2">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={data.lastname}
                onChange={handelData}
                className="w-full border h-12 bg-zinc-800 rounded-md px-5 border-zinc-600 selection:bg-purple-300"
              />
            </div>
          </div>
          <div className="w-full space-y-2">
            <label htmlFor="bio">Bio</label>
            <input
              type="text"
              name="bio"
              id="bio"
              value={data.bio}
              onChange={handelData}
              className="w-full border h-12 bg-zinc-800 rounded-md px-5 border-zinc-600 selection:bg-purple-300"
            />
          </div>
          <div className="flex gap-5 w-full">
            <button
              type="reset"
              className="border border-zinc-700 w-full h-12 rounded-md bg-zinc-900 transition-all duration-300 disabled:bg-gray-600"
              onClick={() => history(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="border border-zinc-700 w-full h-12 rounded-md bg-zinc-900 transition-all duration-300 disabled:bg-gray-600"
            >
              Done
            </button>
          </div>
        </form>
      )}
      <div className="w-[80%] md:w-[60%] xl:w-[40%]">
        <button
          className="h-10 px-4 rounded-md bg-red-600 text-white ring-red-300 active:ring-4"
          onClick={accountCloseHandler}
        >
          Close Account
        </button>
      </div>
    </div>
  );
};

export default EditUser;
