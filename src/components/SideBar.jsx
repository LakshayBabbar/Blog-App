"use client";
import Link from "next/link";
import React from "react";
import { LayoutList, LogOut, Users, Clock, Zap } from "lucide-react";
import { signOut } from "next-auth/react";
import logo from "../../public/logo.png";
import Image from "next/image";

const menuItems = [
  { href: "/admin", icon: LayoutList, label: "Dashboard" },
  { href: "/admin/approval", icon: Clock, label: "Approval" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/super-users", icon: Zap, label: "Super Users" },
  { href: "#", icon: LogOut, label: "Logout" },
];

const SideBar = () => {
  const linkStyle =
    "flex flex-col md:flex-row text-sm md:text-base gap-2 md:hover:gap-4 transition-all ease-in-out duration-400 items-center font-semibold";
  const listStyle =
    "rounded-md md:rounded-l-xl py-2 px-3 text-center md:px-5 w-full";
  const icoSize = "20px";
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleItemClick = (index, label) => {
    if (label === "Logout") {
      signOut();
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <aside className="fixed bottom-0 md:bottom-auto left-0 md:top-0 z-50 w-full md:w-52 h-24 md:h-screen shadow-xl bg-black flex flex-col items-center overflow-auto">
      <div className="w-full px-5 hidden md:block">
        <Image
          width={400}
          height={200}
          src={logo}
          alt="Logo"
          className="w-32 h-auto mt-10"
        />
      </div>
      <div className="hidden md:block w-full px-5">
        <h4 className="mt-10 mb-1 w-full text-slate-300 text-sm">MENU LINKS</h4>
        <div className="mb-5 w-full">
          <hr className="w-full" />
        </div>
      </div>
      <ul className="flex md:flex-col h-full md:gap-2 w-full overflow-x-scroll md:overflow-hidden items-center md:items-start">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${listStyle} ${
              activeIndex === index &&
              "bg-gradient-to-r from-indigo-700 to-indigo-950"
            } ${item.label === "Logout" && "hidden md:block"}
            }`}
            onClick={() => handleItemClick(index, item.label)}
          >
            <Link href={item.href} className={linkStyle}>
              <item.icon size={icoSize} strokeWidth={2.5} /> {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
