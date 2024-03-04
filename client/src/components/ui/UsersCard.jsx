/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

const UsersCard = ({ data, auth }) => {
  return (
    <div className="flex flex-col gap-10 items-center border w-[fit-content] rounded-md p-5">
      <div className="flex gap-5">
        <img
          src={data.profileImg.url}
          alt="profile pic"
          className="w-24 rounded-full aspect-square object-cover"
        />
        <div>
          <Link
            className="text-xl hover:underline"
            to={`/users/${data.username}`}
          >
            @{data.username}
          </Link>
          <h1>{`${data.firstname} ${data.lastname}`}</h1>
          <span className="flex items-center gap-1">
            <FaRegCalendarAlt /> Date joined: {data.createdAt.substring(0, 10)}
          </span>
        </div>
        {auth && (
          <Link to={`/users/${data.username}/edit`}>
            <FaRegEdit className="text-xl cursor-pointer text-green-600" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default UsersCard;
