"use client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React, { useCallback } from "react";
import SuperUser from "@/components/ui/SuperUser";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import useSend from "@/hooks/useSend";

const IamUsers = () => {
  const { data, isError, error, isLoading, refetch } = useFetch(
    "/api/admin/super-users",
    "super_users"
  );
  const [email, setEmail] = React.useState("");
  const { toast } = useToast();
  const { fetchData } = useSend();

  const handleSuperUsers = useCallback(
    async (status, userEmail) => {
      const targetEmail = status === "add" ? email : userEmail;
      const res = await fetchData("/api/admin/super-users", "PUT", {
        email: targetEmail || userEmail,
        status,
      });
      if (!res.error) refetch();
      toast({
        title: res.error ? "Error" : "Success",
        description: res.message || res.error,
      });
    },
    [refetch, toast, fetchData]
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
