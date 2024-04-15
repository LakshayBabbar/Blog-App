import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authentication";
import useSend from "../../hooks/useSend";
import useFetch from "../../hooks/useFetch";
import { Input } from "@/components/ui/input";
import Button from "../../components/ui/Button";
import { useToast } from "@/components/ui/use-toast";
import AlertButton from "@/components/ui/AlertButton";

const EditUser = () => {
  const params = useParams();
  const history = useNavigate();
  const { setIsAuth } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const { fetchData, loading } = useSend();
  const { fetchData: deleteData, loading: loading2 } = useSend();
  const { data: fd } = useFetch(`/users/${params.username}`, params.username);
  const [data, setData] = useState();
  const { toast } = useToast();
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
  const formData = new FormData();
  const submitHandler = async (e) => {
    e.preventDefault();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("bio", data.bio);
    if (img) {
      formData.append("img", img);
    }
    const res = await fetchData("/update-user", "PUT", formData);
    const date = new Date();
    res &&
      toast({
        title: res.message,
        description: date.toString(),
      });
    formData.delete("firstname");
    formData.delete("lastname");
    formData.delete("bio");
    formData.delete("img");
    history(-1);
  };

  const accountCloseHandler = async () => {
    const res = await deleteData("/delete-user", "DELETE");
    setIsAuth(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    const date = new Date();
    res &&
      toast({
        title: res.message,
        description: date.toString(),
      });
    return history("/", { replace: true });
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
            <Input
              type="text"
              name="username"
              id="username"
              value={data.username}
              onChange={() => alert("Username cannot be changed.")}
              className="h-12"
            />
          </div>
          <div className="flex gap-5 w-full flex-col sm:flex-row">
            <div className="flex flex-col flex-grow space-y-2">
              <label htmlFor="firstname" className="">
                First Name
              </label>
              <Input
                type="text"
                name="firstname"
                id="firstname"
                value={data.firstname}
                onChange={handelData}
                className="h-12"
              />
            </div>
            <div className="flex flex-col flex-grow space-y-2">
              <label htmlFor="lastname">Last Name</label>
              <Input
                type="text"
                name="lastname"
                id="lastname"
                value={data.lastname}
                onChange={handelData}
                className="h-12"
              />
            </div>
          </div>
          <div className="w-full space-y-2">
            <label htmlFor="bio">Bio</label>
            <Input
              type="text"
              name="bio"
              id="bio"
              value={data.bio}
              onChange={handelData}
              className="h-12"
            />
          </div>
          <div className="flex gap-5 w-full">
            <Button
              type="reset"
              onClick={() => history(-1)}
              className="flex-grow"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-grow">
              Done
            </Button>
          </div>
        </form>
      )}
      <div className="w-[80%] md:w-[60%] xl:w-[40%]">
        <AlertButton
          variant="destructive"
          onClick={accountCloseHandler}
          disabled={loading2}
        >
          Close Account
        </AlertButton>
      </div>
    </div>
  );
};

export default EditUser;
