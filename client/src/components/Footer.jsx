import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <hr className="mt-20 border border-purple-500 bg-purple-500 w-[85%] md:w-[75%] rounded-[100%] h-1" />
      <div className="py-10 px-10 sm:px-0 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-evenly w-full sm:items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-transparent bg-bak2 bg-clip-text font-bold">
            Blog-Tech
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/">Home</Link>
            <Link to="/auth?mode=signup">Sign Up</Link>
            <Link to="/auth?mode=login">Login</Link>
            <Link to="/users">Creators</Link>
            <Link to="/blogs/create-blog">Create-Blog</Link>
          </div>
        </div>
        <hr className="border-gray-600" />
        <p>© 2024 by Blog-Tech. &nbsp;All rights reserved.</p>
      </div>
    </>
  );
};

export default Footer;
