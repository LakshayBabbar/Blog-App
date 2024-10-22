"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiMenu4Fill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { GradientButton } from "./ui/GradientButton";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const pre = "top-[-22rem] right-[-5rem] bg-transparent";
  const post = "right-[1.5rem] top-20 shadow-xl bg-gray-900 md:bg-transparent";
  const [active, setActive] = useState(pre);
  const menuHandler = () => {
    active === pre ? setActive(post) : setActive(pre);
  };
  const { status, data } = useSession();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [status]);

  const linkStyle = "rounded-xl transition-all";
  return (
    <div className="fixed top-0 md:top-5 left-0 w-full h-16 flex justify-center items-center z-50">
      <div className="backdrop-blur-lg border-b md:bg-gradient-to-b from-slate-900 to-slate-950 md:border-none gap-4 flex items-center justify-between md:justify-normal md:rounded-full px-6 w-full md:w-auto h-16 md:h-14 md:shadow-lg">
        <div className="md:hidden">
          <Image
            src={logo}
            alt="logo"
            width={100}
            height={80}
            className="w-24 h-auto"
          />
        </div>
        <div
          className={`absolute rounded-2xl md:relative  ${active} md:top-0 md:right-0 md:shadow-none transition-all duration-300 w-36 md:w-auto`}
        >
          <ul className="w-28 py-5 pl-5 text-sm flex flex-col gap-4 md:flex-row md:w-[fit-content] md:p-0 md:items-center">
            <li className={linkStyle} onClick={menuHandler}>
              <Link href="/">Home</Link>
            </li>
            <li className={linkStyle} onClick={menuHandler}>
              <Link href="/category/tech">Tech</Link>
            </li>
            <li className={linkStyle} onClick={menuHandler}>
              <Link href="/category/tutorial">Tutorials</Link>
            </li>
            <li className={linkStyle} onClick={menuHandler}>
              <Link href="/category/shopping">Shopping</Link>
            </li>
            <li className={linkStyle} onClick={menuHandler}>
              <Link href="/support">Support</Link>
            </li>
            {!auth ? (
              <li className={linkStyle} onClick={menuHandler}>
                <Link href={`/login`}>Login</Link>
              </li>
            ) : (
              <>
                {(data?.user?.isAdmin || data?.user?.isSuper) && (
                  <li className={linkStyle} onClick={menuHandler}>
                    <Link href="/admin">Admin</Link>
                  </li>
                )}
                <li className={linkStyle} onClick={menuHandler}>
                  <Link href="/blogs/create">Create</Link>
                </li>
                <li className={linkStyle} onClick={menuHandler}>
                  <Link href={`/users/${data?.user.username}`}>Profile</Link>
                </li>
                <li>
                  <GradientButton onClick={() => signOut()}>
                    Logout
                  </GradientButton>
                </li>
              </>
            )}
          </ul>
        </div>
        <button
          className="md:hidden"
          onClick={menuHandler}
          aria-label="Navigation Menu"
        >
          {active === pre ? (
            <RiMenu4Fill className="text-xl cursor-pointer" />
          ) : (
            <MdClose className="text-xl cursor-pointer" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
