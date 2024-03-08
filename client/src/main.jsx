import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/home/Home";
import Auth, { action as authAction } from "./pages/auth/Auth.jsx";
import Users from "./pages/users/Users.jsx";
import UserDetails from "./pages/users/UserDetails.jsx";
import CreateBlog from "./pages/blogs/CreateBlog.jsx";
import EditUser from "./pages/users/EditUser.jsx";
import BlogDetails from "./pages/blogs/BlogDetailes.jsx";
import UpdateBlog from "./pages/blogs/UpdateBlog.jsx";
import Error from "./pages/Error.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
        action: authAction,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:username",
        element: <UserDetails />,
      },
      {
        path: "users/:username/:edit",
        element: <EditUser />,
      },
      {
        path: "blogs/create-blog",
        element: <CreateBlog />,
      },
      {
        path: "blogs/:blogId",
        element: <BlogDetails />,
      },
      {
        path: "blogs/:blogId/edit",
        element: <UpdateBlog />,
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
