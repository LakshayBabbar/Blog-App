import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../../components/authForm/authForm";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigation = useNavigate();

  useEffect(() => {
    if (searchParams.get("mode") !== ("login" || "signup")) {
      navigation("/auth?mode=signup");
    }
  }, [searchParams, navigation]);

  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center bg-bak bg-cover">
      <AuthForm />
    </div>
  );
};
export default Auth;

export async function action({ request }) {

  const params = new URL(request.url).searchParams;
  const mode = params.get('mode') || 'login';

  const data = await request.formData();
  const authData = {
    username: data.get("username"),
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(import.meta.env.VITE_AUTH+mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData)
  });

  const resData = await response.json();
  console.log(resData);
  return resData;
}
