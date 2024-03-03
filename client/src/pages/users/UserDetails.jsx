import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { IoArrowBack } from "react-icons/io5";
import { AuthContext } from "../../context/Authentication";
import UsersCard from "../../components/ui/UsersCard";

const UserDetails = () => {
  const history = useNavigate();
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [blogData, setBlogData] = useState([]);
  const [auth, setAuth] = useState(false);
  const { token, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "users/" + params.username,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );
      const resData = await response.json();
      console.log(resData)
      setUserData(resData.user);
      setBlogData(resData.blogs);
      setAuth(resData.auth);
    };

    !loading && fetchData();
  }, [params, token, loading]);

  return (
    <div className="flex flex-col gap-5 items-center justify-center mt-28">
      {userData ? (
        <div className="w-[fit-content]">
          <span
            className="cursor-pointer underline flex items-center gap-1 mb-10 ml-10 md:ml-0"
            onClick={() => history(-1)}
          >
            <IoArrowBack />
            Go back
          </span>
          <div className="flex flex-col gap-10 items-center">
            <UsersCard data={userData} />
            <h1 className="text-3xl">Blogs</h1>
            {blogData.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-8">
                {blogData.map((items) => {
                  return <BlogsCard key={items._id} data={items} auth={auth} />;
                })}
              </div>
            ) : (
              <h1>It seems the user hasn&#39;t created any blogs yet.</h1>
            )}
          </div>
        </div>
      ) : (
        <div>User Not Found.</div>
      )}
    </div>
  );
};

export default UserDetails;
