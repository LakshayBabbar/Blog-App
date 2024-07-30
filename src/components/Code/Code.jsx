"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy } from "lucide-react";
import coldarkDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";

const Code = ({ children, lan }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(children.toString());
    alert("Copied to clipboard");
  };
  return (
    <div className="relative">
      <code>
        <SyntaxHighlighter
          language={lan || "html"}
          style={coldarkDark}
          customStyle={{ padding: "1rem 2rem" }}
        >
          {children.toString()}
        </SyntaxHighlighter>
      </code>
      <button
        aria-label="copy code"
        className="absolute top-2 right-2 z-20 p-2 text-white rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all ease-in-out duration-300"
        onClick={handleCopy}
      >
        <Copy className="size-5" />
      </button>
    </div>
  );
};

export default Code;
