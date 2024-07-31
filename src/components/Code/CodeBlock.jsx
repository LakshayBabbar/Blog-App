"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy } from "lucide-react";
import drakula from "react-syntax-highlighter/dist/esm/styles/prism/dracula";

const CodeBlock = ({ children }) => {
  const codeString = children.toString();
  const lines = codeString.split("\n");
  let detectedLanguage = lines[0].trim();
  lines.shift();
  const cleanedCodeString = lines.join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedCodeString);
    alert("Copied to clipboard");
  };

  return (
    <div className="border rounded-xl">
      <div className="w-full h-10 flex justify-end px-2">
        <button
          aria-label="copy code"
          className="top-2 right-2 z-20 p-2 text-white flex gap-2 items-center text-sm"
          onClick={handleCopy}
        >
          <Copy className="size-4" /> Copy Code
        </button>
      </div>
      <code>
        <SyntaxHighlighter
          language={detectedLanguage}
          style={drakula}
          customStyle={{
            background: "transparent",
            paddingTop: "0 1rem 0 0",
          }}
          showLineNumbers
        >
          {cleanedCodeString.replace(/\n$/, "")}
        </SyntaxHighlighter>
      </code>
    </div>
  );
};

export default CodeBlock;
