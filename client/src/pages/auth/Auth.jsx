import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
    const req = await fetch(import.meta.env.VITE_BASE_URL + `/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
      credentials: "include",
    });
    const resData = await req.json();
    return resData;
  } catch (error) {
    return { message: error.message };
  }
}
