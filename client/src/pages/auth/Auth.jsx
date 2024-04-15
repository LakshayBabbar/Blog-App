import { useContext, useEffect } from "react";
import { redirect, useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../../components/authForm/authForm";
import { AuthContext } from "../../context/Authentication";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirect = useNavigate();
  const { isAuth, username } = useContext(AuthContext);
  useEffect(() => {
    if (searchParams.get("mode") !== ("login" || "signup")) {
      redirect("/auth?mode=signup");
    }
    if (isAuth) {
      redirect(`/users/${username}`);
    }
  }, [searchParams, redirect, isAuth, username]);

  return (
    <div className="flex items-center justify-center h-lvh">
      <AuthForm />
    </div>
  );
};
export default Auth;

export async function action({ request }) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("mode") || "login";

  try {
    const data = await request.formData();
    const authData = {
      firstname: data.get("firstname"),
      lastname: data.get("lastname"),
      email: data.get("email"),
      password: data.get("password"),
    };
    const response = await fetch(import.meta.env.VITE_BASE_URL + `/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });
    const resData = await response.json();
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 404
    ) {
      return { error: resData.message };
    }
    if (!response.ok) {
      return { error: "Could not authenticate user." };
    }
    if ("authToken" in resData) {
      localStorage.setItem("authToken", "Bearer " + resData.authToken);
    } else {
      return redirect("/auth?mode=login");
    }
    return resData;
  } catch (error) {
    return { error: error.message };
  }
}
