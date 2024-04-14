import { useContext, useEffect } from "react";
import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { AuthContext } from "../../context/Authentication";
import Button from "../ui/Button";
import { Input } from "../ui/input";
import { MdOutlineLogin } from "react-icons/md";
import { useToast } from "../ui/use-toast";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const data = useActionData();
  const { setIsAuth, setUserName } = useContext(AuthContext);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { toast } = useToast();

  // checking if token is recieved and then change the authentication state to true
  useEffect(() => {
    if (data && "authToken" in data) {
      setIsAuth(true);
      setUserName(data.username);
    }
    if (data && "message" in data) {
      const date = new Date();
      toast({
        title: data.message,
        description: date.toString(),
      });
    }
  }, [data, setIsAuth, setUserName, toast]);

  const inputStyle = "h-12 text-md";
  return (
    <div className="w-[90%] sm:w-[fit-content] gap-4 rounded-2xl flex flex-col items-center">
      <Form
        method="post"
        className="flex flex-col gap-5 mt-4 w-11/12 sm:w-[25rem]"
      >
        <div>
          <h1 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">
            {isLogin ? "Log in to Blog Tech" : "Sign Up in to Blog Tech"}
          </h1>
          <p className="text-sm max-w-sm mt-2 text-slate-200">
            {isLogin
              ? "Log in to manage your profile or blogs."
              : "Sign Up to join our community."}
          </p>
        </div>
        {!isLogin && (
          <>
            <div className="flex gap-3">
              <Input
                type="text"
                name="firstname"
                className={inputStyle}
                placeholder="First Name"
              />
              <Input
                type="text"
                name="lastname"
                className={inputStyle}
                placeholder="Last Name"
              />
            </div>
          </>
        )}
        <Input
          type="email"
          name="email"
          className={inputStyle}
          placeholder="Email Address"
        />
        <Input
          type="password"
          name="password"
          className={inputStyle}
          placeholder="Password"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-md gap-2"
        >
          {isSubmitting ? "Submitting..." : isLogin ? "Login" : "Sign Up"}
          <MdOutlineLogin />
        </Button>
        {data && <p className="text-red-600">{data.error}</p>}
        <div className="w-full">
          <Link
            to={`?mode=${isLogin ? "signup" : "login"}`}
            className="text-blue-500 hover:underline underline-offset-4"
          >
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default AuthForm;
