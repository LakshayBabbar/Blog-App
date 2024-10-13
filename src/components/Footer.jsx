import Link from "next/link";
import img from "@/../public/logo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-16 mb-5 w-full flex justify-center">
      <div className="px-10 md:px-0 flex flex-col gap-5 md:items-center w-full">
        <Image
          src={img}
          alt="logo"
          width={300}
          height={200}
          className="w-32 h-auto"
        />
        <hr className="md:w-[26rem]" />
        <div className="flex flex-col gap-4 md:flex-row">
          <Link href="/">Home</Link>
          <Link href="/category/tech">Tech</Link>
          <Link href="/category/tutorial">Tutorials</Link>
          <Link href="/category/shopping">Shopping</Link>
          <Link href="/support">Support</Link>
          <Link href="/login">Login</Link>
        </div>
        <p className="font-semibold">
          © 2024 by Legit-Blogs. &nbsp;All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
