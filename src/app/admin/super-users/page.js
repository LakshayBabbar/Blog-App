"use client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React, { useCallback } from "react";
import SuperUser from "@/components/ui/SuperUser";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const IamUsers = () => {
  const { data, isError, error, isLoading, refetch } = useFetch(
    "/api/admin/super-users",
    "super_users"
  );
  const [email, setEmail] = React.useState("");
  const { toast } = useToast();

  const handleSuperUsers = useCallback(
    async (status, userEmail) => {
      const targetEmail = status === "add" ? email : userEmail;
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/super-users`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: targetEmail || userEmail, status }),
          }
        );
        const res = await req.json();
        if (!req.ok) {
          throw new Error(res?.error || "Something went wrong");
        }
        toast({
          title: "Success",
          description: res.message,
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
        });
      }
    },
    [email]
  );

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSuperUsers("add");
  };

  return (
    <div className="my-24 md:mt-28 p-5 space-y-12">
      <form
        className="space-y-2 text-slate-300 font-semibold"
        onSubmit={handleSubmit}
      >
        <h2>Add Super User</h2>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter Email"
            className="md:w-96"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" aria-label="Add User" variant="secondary">
            <Plus strokeWidth={3} />
          </Button>
        </div>
      </form>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
        {data?.users?.map((user) => (
          <SuperUser
            key={user._id}
            user={user}
            handelFn={handleSuperUsers}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default IamUsers;
