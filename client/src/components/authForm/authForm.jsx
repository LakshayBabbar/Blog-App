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
    "w-full border h-10 rounded-md px-5 border-purple-600 selection:bg-purple-300 outline-purple-500";
  return (
    <div className="flex flex-col gap-5 bg-white border p-10 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold">{handleTitle}</h1>

      <Form
        method="post"
        className="flex flex-col gap-5 mt-4 items-center w-[72vw] sm:w-96"
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
            <input
              type="text"
              name="username"
              className={inputStyle}
              placeholder="Username"
            />
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
          className={`${inputStyle} bg-bak2 font-bold text-white disabled:bg-gray-600`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : handleTitle}
        </button>
        {data && <p className="text-red-600">{data.message}</p>}
      </Form>
      {isLogin ? (
        <p>
          Need an account?{" "}
          <Link to="?mode=signup" className="text-purple-700">
            Sign Up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link to="?mode=login" className="text-purple-700">
            Login
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
