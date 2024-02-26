import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const UserDetails = () => {
  const history = useNavigate();
  const params = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "users/" + params.userId,
        {
          method: "POST",
        }
      );
      const resData = await response.json();
      setData(resData);
    };
    fetchdata();
  }, [params]);

  const joinDate = data.joinDate;

  return (
    <div className="flex flex-col gap-5 my-24 items-center justify-center">
      {"blogs" in data ? (
        <div className="w-[fit-content]">
          <span
            className="cursor-pointer underline flex items-center gap-1 mb-10 ml-10 md:ml-0"
            onClick={() => history(-1)}
          >
            <IoArrowBack />
            Go back
          </span>
          <div className="flex flex-col gap-10 items-center">
            <div className="flex gap-5 items-center">
              <img
                src={data.profileImg}
                alt="profile pic"
                className="w-28 rounded-full"
              />
              <div>
                <h1 className="text-xl">@{data.username}</h1>
                <h1>{data.fullname}</h1>
                <span className="flex items-center gap-1">
                  <FaRegCalendarAlt /> Date joined: {joinDate.substring(0, 10)}
                </span>
              </div>
            </div>
            <h1 className="text-3xl">Blogs</h1>
            {data.blogs.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-8">
                {data.blogs.map((items) => {
                  return <Card key={items._id} data={items} />;
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
