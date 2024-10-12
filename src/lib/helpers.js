export const getData = async (url, cacheDisabled = false) => {
  try {
    const options = {
      method: "GET",
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

export const blogApproval = async (blogId, status) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ blogId, status }),
    };

    const req = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/admin/approval",
      options
    );
    const res = await req.json();

    if (!req.ok) {
      throw new Error(res.message || "Something went wrong");
    }

    return res;
  } catch (error) {
    return { error: error.message };
  }
};
