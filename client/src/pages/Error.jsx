import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
const Error = () => {
  return (
    <div className="flex flex-col h-[100vh] items-center justify-center gap-1">
      <h1 className="text-transparent bg-bak2 bg-clip-text text-3xl text-center py-2">
        404 | This page could not be found.
      </h1>
      <Link to="/" className="underline flex gap-1 items-center">
        <IoArrowBack /> Back to home page.
      </Link>
    </div>
  );
};

export default Error;
