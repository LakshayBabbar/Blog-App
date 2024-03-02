/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";

const UsersCard = ({ data }) => {

  return (
    <div className="flex flex-col gap-10 items-center border w-[fit-content] rounded-md p-5">
      <div className="flex gap-5 items-center">
        <img
          src={data.profileImg}
          alt="profile pic"
          className="w-28 rounded-full"
        />
        <div>
          <Link className="text-xl hover:underline" to={`/users/${data.username}`}>
            @{data.username}
          </Link>
          <h1>{`${data.firstname} ${data.lastname}`}</h1>
          <span className="flex items-center gap-1">
            <FaRegCalendarAlt /> Date joined: {data.createdAt.substring(0, 10)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UsersCard;
