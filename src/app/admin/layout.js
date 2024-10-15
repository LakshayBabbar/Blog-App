import SideBar from "@/components/SideBar";
import React from "react";

const layout = ({ children }) => {
  return (
    <main className="flex gap-10 md:ml-56">
      <SideBar />
      {children}
    </main>
  );
};

export default layout;
