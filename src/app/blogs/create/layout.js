import LoginPage from "@/components/login/LoginPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const metadata = {
  title: "Create a Blog Post - Legit Blogs",
  description:
    "Share your thoughts and stories with the world. Create a unique blog post on Legit Blogs and join our community of writers. Easy and intuitive blogging platform to express your creativity.",
  alternates: {
    canonical: "https://www.legitblogs.me/blogs/create",
  },
  openGraph: {
    title: "Create a Blog Post - Legit Blogs",
    description:
      "Share your thoughts and stories with the world. Create a unique blog post on Legit Blogs and join our community of writers. Easy and intuitive blogging platform to express your creativity.",
    url: "https://www.legitblogs.me/blogs/create",
    site_name: "Legit Blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create a Blog Post - Legit Blogs",
    description:
      "Share your thoughts and stories with the world. Create a unique blog post on Legit Blogs and join our community of writers. Easy and intuitive blogging platform to express your creativity.",
  },
};
const Layout = async ({ children }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return <LoginPage />;
  }
  return children;
};

export default Layout;
