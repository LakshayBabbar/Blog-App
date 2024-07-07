"use client";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";

const LoginPage = () => {
  return (
    <main className="flex items-center justify-center w-full h-screen bg-gradient-to-t from-black to-slate-800">
      <section className="border p-10 bg-slate-900 flex flex-col gap-6 items-center rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-4">Welcome Back!</h1>
        <p className="text-white mb-4 ">Sign in to your account</p>
        <Button
          className="bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600 transition-all"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </Button>
        <Button
          className="bg-gray-800 text-white w-full py-2 rounded-lg hover:bg-gray-700 transition-all"
          onClick={() => signIn("github")}
        >
          Sign in with Github
        </Button>
      </section>
    </main>
  );
};

export default LoginPage;
