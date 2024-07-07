"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { BiSearchAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import Link from "next/link";
import useSend from "@/hooks/useSend";

const SearchBar = ({ type, url }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { fetchData } = useSend();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchData(url + searchTerm);
    if (res?.success) {
      setSearchResults(type === "Blogs" ? res.blogs : res.users);
    } else {
      setSearchResults([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setSearchResults([]);
    }, 100); // small delay to allow click events to register
  };

  return (
    <div className="w-4/5 md:w-[40%] relative">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder={`Search ${type}`}
          className="rounded-xl h-12 bg-transparent backdrop-blur-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
        />
        <button
          type="submit"
          className="absolute size-10 top-1 right-0 text-xl"
          aria-label="submit search"
        >
          <BiSearchAlt />
        </button>
      </form>
      {isFocused && searchResults.length > 0 && (
        <motion.div
          className="absolute backdrop-blur-xl bg-slate-950 mt-5 p-5 rounded-xl max-h-80 overflow-y-scroll z-50"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <ul className="w-[30rem] flex flex-col gap-2 items-start">
            {searchResults.map((item) => (
              <li
                key={item._id}
                className="p-2 rounded-xl hover:bg-white hover:text-black flex items-center h-10 text-left"
              >
                <Link
                  href={
                    type === "Blogs"
                      ? `/blogs/${item.url}`
                      : `/users/${item.username}`
                  }
                  className="cursor-pointer flex gap-2 items-center"
                >
                  <BiSearchAlt />
                  <p className="line-clamp-1">
                    {type === "Blogs" ? item.title : item.username}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};
export default SearchBar;
