import { useContext, useEffect } from "react";
import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { AuthContext } from "../../context/Authentication";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const data = useActionData();
  const { setIsAuth, setUserName } = useContext(AuthContext);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const handleTitle = isLogin ? "Login" : "Sign Up";

  // checking if token is recieved and then change the authentication state to true
  useEffect(() => {
    if (data && "authToken" in data) {
      setIsAuth(true);
      setUserName(data.username);
    }
  }, [data, setIsAuth, setUserName]);

  const inputStyle =
    "w-full border h-12 bg-zinc-800 rounded-md px-5 border-zinc-600 selection:bg-purple-300";
  return (
    <div className="w-[90%] sm:w-[fit-content] p-8 gap-4 border border-zinc-700 rounded-2xl flex flex-col items-center">
      <div>
        <h1 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Blog-Tech
        </h1>
        <h1 className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {isLogin
            ? "Login to manage your profile or create blogs."
            : "Sign Up to join our community."}
        </h1>
      </div>
      <Form
        method="post"
        className="flex flex-col gap-5 mt-4 items-center w-[72vw] sm:w-[25rem]"
      >
        {!isLogin && (
          <>
            <div className="flex gap-3">
              <input
                type="text"
                name="firstname"
                className={inputStyle}
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastname"
                className={inputStyle}
                placeholder="Last Name"
              />
            </div>
          </>
        )}
        <input
          type="email"
          name="email"
          className={inputStyle}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          className={inputStyle}
          placeholder="Password"
        />
        <button
          type="submit"
          className={`border border-zinc-700 w-full h-12 rounded-md bg-zinc-900 transition-all duration-300 disabled:bg-gray-600 `}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : handleTitle}
        </button>
        {data && <p className="text-red-600">{data.message}</p>}
      </Form>
      {isLogin ? (
        <p>
          Need an account? <Link to="?mode=signup">Sign Up </Link>
        </p>
      ) : (
        <p>
          Already have an account? <Link to="?mode=login">Login</Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
