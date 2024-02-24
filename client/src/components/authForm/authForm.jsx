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

  return (
    <>
      <h1 className="text-3xl">{handleTitle}</h1>
      <Form method="post" className="flex flex-col gap-5 border-slate-800 mt-4">
        {!isLogin && (
          <>
            <input
              type="text"
              name="username"
              {...register("username", {
                required: { value: true, message: "Username is required" },
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Username only contains alphanumeric characters",
                },
              })}
              className="w-96 border h-10 rounded-3xl px-5 border-slate-800"
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
          className="w-96 border h-10 rounded-3xl px-5 border-slate-800"
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
          className="w-96 border h-10 rounded-3xl px-5 border-slate-800"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <button
          type="submit"
          className="w-96 border h-10 rounded-3xl border-slate-800"
        >
          {handleTitle}
        </button>
      </Form>
      {isLogin ? (
        <p>
          Need an account? <Link to="?mode=signup">Sign Up</Link>
        </p>
      ) : (
        <p>
          Already have an account? <Link to="?mode=login">Login</Link>
        </p>
      )}
    </>
  );
};

export default AuthForm;
