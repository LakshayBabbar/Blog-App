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
import Authentication from "./context/Authentication";
import ProtectedRoute from "./pages/protected/ProtectedRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
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
        path: "users/:username/edit",
        element: (
          <ProtectedRoute>
            <EditUser />,
          </ProtectedRoute>
        ),
      },
      {
        path: "blogs/create-blog",
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: "blogs/:blogId",
        element: <BlogDetails />,
      },
      {
        path: "blogs/:blogId/edit",
        element: (
          <ProtectedRoute>
            <UpdateBlog />,
          </ProtectedRoute>
        ),
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
    <QueryClientProvider client={queryClient}>
      <Authentication>
        <RouterProvider router={router} />
      </Authentication>
    </QueryClientProvider>
  </React.StrictMode>
);
