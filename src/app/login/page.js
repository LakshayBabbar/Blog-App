import LoginPage from "@/components/login/LoginPage";

export const metadata = {
  title: "Login - Legit Blogs",
  description:
    "Access your Legit Blogs account to manage your posts, view analytics, and connect with other bloggers. Secure and easy login to keep you connected.",
  alternates: {
    canonical: "https://www.legitblogs.me/login",
  },
  openGraph: {
    title: "Login - Legit Blogs",
    description:
      "Access your Legit Blogs account to manage your posts, view analytics, and connect with other bloggers. Secure and easy login to keep you connected.",
    url: "https://www.legitblogs.me/login",
    site_name: "Legit Blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - Legit Blogs",
    description:
      "Access your Legit Blogs account to manage your posts, view analytics, and connect with other bloggers. Secure and easy login to keep you connected.",
  },
};

const Login = () => {
  return <LoginPage />;
};

export default Login;
