import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { AuthContext } from "../context/Authentication";

const Navbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const pre = "top-[-18rem] right-[-5rem]";
  const post = "right-[1.5rem] top-20 shadow-xl";
  const [active, setActive] = useState(pre);
  const [username, setUserName] = useState(null);
  const menuHandler = () => {
    active === pre ? setActive(post) : setActive(pre);
  };

  useEffect(() => {
    const name = localStorage.getItem("username");
    name && setUserName(name);
  }, [username]);

  function logoutHandler() {
    setIsAuth(false);
    localStorage.removeItem("authToken");
  }

  const linkStyle =
    "text-[1.1rem] p-2 rounded-md hover:bg-slate-200 transition-all";
  return (
    <div className="fixed top-0 left-0 h-16 bg-white w-full flex items-center justify-around sm:justify-evenly shadow-md">
      <h2 className="text-2xl">Blog-Tech</h2>
      <div
        className={`absolute bg-white rounded-2xl sm:relative ${active} sm:top-0 sm:right-0 sm:shadow-none transition-all duration-300`}
      >
        <ul className="w-36 p-4 flex flex-col gap-2 sm:gap-4 sm:flex-row sm:w-[fit-content] sm:p-0">
          <li className={linkStyle}>
            <Link to="/">Home</Link>
          </li>
          <li className={linkStyle}>
            <Link to="/create-blog">Create Blog</Link>
          </li>
          {!isAuth ? (
            <>
              <li className={linkStyle}>
                <Link to="/auth?mode=login">Login</Link>
              </li>
              <li className="text-[1.1rem] py-2 px-4 rounded-3xl bg-purple-500 text-white hover:bg-purple-600 text-center">
                <Link to="/auth/?mode=signup">Sign Up</Link>
              </li>
            </>
          ) : (
            <>
              <li className={linkStyle}>
                <Link to={`/users/${username}`}>Profile</Link>
              </li>
              <li className="text-[1.1rem] py-2 px-4 rounded-3xl bg-purple-500 text-white hover:bg-purple-600 text-center">
                <Link to="/auth/?mode=signup" onClick={logoutHandler}>
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="sm:hidden" onClick={menuHandler}>
        {active === pre ? (
          <CiMenuFries className="text-2xl" />
        ) : (
          <MdClose className="text-2xl" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
