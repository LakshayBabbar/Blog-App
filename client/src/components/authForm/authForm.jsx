import { Form, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const {
    register,
    formState: { errors },
  } = useForm();

  const handleTitle = isLogin ? "Login" : "Sign Up";
  const inputStyle = "w-[75vw] sm:w-96 border h-10 rounded-md px-5 border-purple-600";

  return (
    <div className="flex flex-col gap-5 bg-white border p-6 sm:p-10 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold">{handleTitle}</h1>
      <Form method="post" className="flex flex-col gap-5 mt-4">
        {!isLogin && (
          <>
            <input
              type="text"
              {...register("username", {
                required: { value: true, message: "Username is required" },
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Username only contains alphanumeric characters",
                },
              })}
              className={inputStyle}
              placeholder="Username"
            />
            {errors.username && <p>{errors.username.message}</p>}
          </>
        )}
        <input
          type="email"
          {...register("email", {
            required: { value: true, message: "Email is required" },
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          className={inputStyle}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          type="password"
          {...register("password", {
            required: { value: true, message: "Password is required" },
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
          className={inputStyle}
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <button
          type="submit"
          className={`${inputStyle} bg-purple-600 text-white`}
        >
          {handleTitle}
        </button>
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
