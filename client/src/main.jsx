/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { action as authAction } from "./pages/auth/Auth.jsx";
import Authentication from "./context/Authentication";
import ProtectedRoute from "./pages/protected/ProtectedRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import App from "./App.jsx";
import Home from "./pages/home/Home.jsx";
const Auth = React.lazy(() => import("./pages/auth/Auth.jsx"));
const Users = React.lazy(() => import("./pages/users/Users.jsx"));
const UserDetails = React.lazy(() => import("./pages/users/UserDetails.jsx"));
const CreateBlog = React.lazy(() => import("./pages/blogs/CreateBlog.jsx"));
const EditUser = React.lazy(() => import("./pages/users/EditUser.jsx"));
const BlogDetails = React.lazy(() => import("./pages/blogs/BlogDetailes.jsx"));
const UpdateBlog = React.lazy(() => import("./pages/blogs/UpdateBlog.jsx"));
const Error = React.lazy(() => import("./pages/Error.jsx"));

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
        <Suspense fallback=<LoadingSpinner />>
          <RouterProvider router={router} />
        </Suspense>
      </Authentication>
    </QueryClientProvider>
  </React.StrictMode>
);
