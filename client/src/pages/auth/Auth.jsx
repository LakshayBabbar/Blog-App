import { useEffect } from "react";
import { json, useNavigate, useSearchParams } from "react-router-dom";
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
    <div className="flex flex-col h-[100vh] gap-5">
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

  const response = await fetch(`http://localhost:3000/${mode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData)
  });
  

  const abc = await response.json();
  console.log(abc)

  return abc;

}
