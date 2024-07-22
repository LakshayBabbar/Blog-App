"use client";
import Link from "next/link";
import React from "react";
import { LayoutDashboard, CirclePlus, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/create", icon: CirclePlus, label: "Create" },
  { href: "/", icon: User, label: "Users" },
  { href: "#", icon: LogOut, label: "Logout" },
];

const SideBar = () => {
  const linkStyle = "flex gap-5 text-md items-center";
  const listStyle = "rounded-md py-2 px-5";
  const icoSize = "20px";
  const [activeIndex, setActiveIndex] = React.useState();

  const handleItemClick = (index, label) => {
    if (label === "Logout") {
      signOut();
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <aside className="w-fit px-11 h-screen shadow-xl bg-slate-900 flex flex-col items-center">
      <ul className="mt-24 space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${listStyle} ${activeIndex === index && "bg-gray-700"}`}
            onClick={() => handleItemClick(index, item.label)}
          >
            <Link href={item.href} className={linkStyle}>
              <item.icon size={icoSize} /> {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
