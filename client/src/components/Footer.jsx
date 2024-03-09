import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="py-10 flex justify-evenly items-center mt-10 border-t w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl text-transparent bg-bak2 bg-clip-text font-bold">
          Blog-Tech
        </h1>
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/auth?mode=signup">Sign Up</Link>
          <Link to="/auth?mode=login">Login</Link>
          <Link to="/users">Creators</Link>
          <Link to="/blogs/create-blog">Create-Blog</Link>
        </div>
      </div>
      <p>© 2024 by Blog-Tech. All rights reserved.</p>
    </div>
  );
};

export default Footer;
