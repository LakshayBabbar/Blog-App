import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
const Error = () => {
  return (
    <div className="flex flex-col h-[100vh] items-center justify-center gap-2">
      <h1 className="text-slate-200 text-2xl text-center py-2">
        404 | This page could not be found.
      </h1>
      <Link
        to="/"
        className="flex gap-1 items-center text-slate-400 underline underline-offset-4"
      >
        <IoArrowBack /> Back to home page.
      </Link>
    </div>
  );
};

export default Error;
