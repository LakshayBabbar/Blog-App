import Link from "next/link";
import img from "@/../public/logo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-28 w-full flex flex-col items-center">
      <hr className="w-4/5" />
      <div className="py-10 px-10 sm:px-0 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-evenly w-full sm:items-center">
        <div className="flex flex-col gap-4">
          <Image
            src={img}
            alt="logo"
            width={300}
            height={200}
            className="w-32 h-auto"
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/users">Creators</Link>
            <Link href="/blogs/create-blog">Create</Link>
          </div>
        </div>
        <hr className="border-gray-600" />
        <p>© 2024 by Legit-Blogs. &nbsp;All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
