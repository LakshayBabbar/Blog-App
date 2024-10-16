"use client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";
import { BiSupport } from "react-icons/bi";
import useSend from "@/hooks/useSend";
import { useToast } from "@/components/ui/use-toast";

const Support = () => {
  const [inputs, setInputs] = React.useState({
    email: "",
    subject: "",
    message: "",
  });
  const { fetchData, isErr, err, loading } = useSend(
    "/api/support/new-request",
    inputs
  );
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchData("/api/support/new-request", "POST", inputs);
    if (!res?.error) {
      toast({
        title: "Success",
        description: "Request submitted successfully",
      });
      setInputs({
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="mt-20 sm:mt-0 flex flex-col w-full sm:h-screen gap-4 items-center justify-center">
      <section className="p-5 sm:p-8 rounded-xl sm:border space-y-4 shadow-xl sm:w-[30rem]">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Support Request</h1>
          <span className="w-full flex gap-1 items-center text-slate-300">
            <BiSupport className="text-md" />
            <Link href="mailto:lakshaybabbar0118@outlook.com">
              lakshaybabbar0118@outlook.com
            </Link>
          </span>
          <p className="max-w-full text-sm text-slate-300 font-semibold">
            It may take up to a week to respond to your support request via
            email.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
          <Input
            type="email"
            name="email"
            value={inputs.email}
            placeholder="Email (associated with your account)"
            onChange={handleInputs}
            className="w-full bg-slate-900"
            required
          />
          <Input
            type="text"
            name="subject"
            value={inputs.subject}
            placeholder="Subject"
            onChange={handleInputs}
            className="w-full bg-slate-900 active:outline-1 active:outline-slate-700"
            required
          />
          <Textarea
            name="message"
            value={inputs.message}
            placeholder="Message"
            onChange={handleInputs}
            className="max-w-full w-full min-h-48 sm:min-h-28 max-h-40 bg-slate-900"
            required
          />
          <Button type="submit" variant="secondary" disabled={loading}>
            Submit
          </Button>
        </form>
        {isErr && <p className="text-red-500">{err}</p>}
      </section>
      <div className="fixed -bottom-10 -right-10 bg-gradient-to-l from-indigo-700 to-indigo-950 w-2/3 h-40 -rotate-6 -z-1 blur-[100px]" />
    </main>
  );
};

export default Support;
