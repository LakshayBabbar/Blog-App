import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authentication";

const EditUser = () => {
  const params = useParams();
  const history = useNavigate();
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    bio: "",
  });
  const [img, setImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + `users/${params.username}`
      );
      const resData = await response.json();
      setData({
        username: resData.user.username,
        firstname: resData.user.firstname,
        lastname: resData.user.lastname,
        bio: resData.user.bio,
      });
      setImg(resData.user.profileImg.url);
    };
    fetchData();
  }, [params]);

  const handelData = (e) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("bio", data.bio);
    if (typeof img !== "string") {
      formData.append("img", img);
    }

    const response = await fetch(import.meta.env.VITE_AUTH + `update-user`, {
      method: "PUT",
      headers: {
        authorization: token,
      },
      body: formData,
    });
    const resData = await response.json();
    console.log(resData);
    return history(-1);
  };

  return (
    <div className="mt-28 flex justify-center">
      <form
        className="w-[80%] md:w-[60%] xl:w-[40%] flex flex-col gap-5 items-center"
        onSubmit={submitHandler}
        encType="multipart/form-data"
      >
        <label htmlFor="img">
          <img
            src={
              typeof img === "string" || img === null
                ? img
                : URL.createObjectURL(img)
            }
            alt="Profile pic"
            className="rounded-full w-48 sm:w-64 hover:brightness-75 aspect-square cursor-pointer"
          />
        </label>
        <input
          type="file"
          id="img"
          onChange={(e) => setImg(e.target.files[0])}
          className="hidden"
          accept="image/*"
        />
        <input
          type="text"
          name="username"
          value={data.username}
          onChange={handelData}
          className="border h-10 px-4 w-full"
        />
        <div className="flex gap-5 w-full flex-col sm:flex-row">
          <input
            type="text"
            name="firstname"
            value={data.firstname}
            onChange={handelData}
            className="flex-grow border h-10 px-4"
          />
          <input
            type="text"
            name="lastname"
            value={data.lastname}
            onChange={handelData}
            className="flex-grow border h-10 px-4"
          />
        </div>
        <input
          type="text"
          name="bio"
          value={data.bio}
          onChange={handelData}
          className="flex-grow border h-10 px-4 w-full"
        />
        <div className="flex gap-5 w-full">
          <button
            type="reset"
            className="flex-grow h-10 px-4 border rounded"
            onClick={() => history(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="flex-grow h-10 border px-4 rounded">
            Done
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
