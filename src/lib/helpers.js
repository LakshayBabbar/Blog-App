export const getData = async (url, cacheDisabled = false) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "default",
      next: {},
    };

    if (cacheDisabled) {
      options.cache = "no-store";
    }

    const req = await fetch(process.env.NEXT_PUBLIC_API_URL + url, options);
    const res = await req.json();

    if (!req.ok) {
      throw new Error(res.message || "Something went wrong");
    }

    return res;
  } catch (error) {
    return { error: error.message };
  }
};
