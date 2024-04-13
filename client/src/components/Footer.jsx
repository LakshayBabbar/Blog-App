import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-28 w-full flex flex-col items-center">
    <hr className="w-4/5" />
      <div className="py-10 px-10 sm:px-0 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-evenly w-full sm:items-center text-slate-400">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-slate-100">Blog Tech</h1>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/">Home</Link>
            <Link to="/auth?mode=signup">Sign Up</Link>
            <Link to="/auth?mode=login">Login</Link>
            <Link to="/users">Creators</Link>
            <Link to="/blogs/create-blog">Create</Link>
          </div>
        </div>
        <hr className="border-gray-600" />
        <p>© 2024 by Blog-Tech. &nbsp;All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
