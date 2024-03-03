const capitalizeFirstLetter = (str) => {
  const capitalWord = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalWord;
};

const categories = [
  "all",
  "tech",
  "fashion",
  "nature",
  "travel",
  "fitness",
  "lifestyle",
  "finance",
  "news",
  "business",
  "Entertainment",
  "crafts",
  "music",
  "food",
  "marketing",
  "photography",
  "others",
];
export { categories, capitalizeFirstLetter };
