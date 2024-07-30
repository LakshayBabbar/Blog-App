export const modules = {
  history: [{ delay: 500 }, { maxStack: 100 }, { userOnly: false }],
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["image"], // Add the "image" option here
    ["code-block"],
  ],
};
