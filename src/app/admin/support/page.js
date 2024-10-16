"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import RequestCard from "@/components/support/RequestCard";
import useFetch from "@/hooks/useFetch";
import React from "react";

const SupportReq = () => {
  const { data, isError, error, isLoading, refetch } = useFetch(
    "/api/admin/support",
    "support-requests"
  );

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="w-full text-center mt-32">
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <div className="p-5 my-24 md:mt-32 space-y-10">
      <h1 className="text-3xl font-bold">Support Requests</h1>
      <div className="flex flex-wrap gap-5">
        {data?.requests.map((req) => {
          return <RequestCard key={data._id} req={req} refetch={refetch} />;
        })}
        {data?.requests.length === 0 && <p>No requests found.</p>}
      </div>
    </div>
  );
};

export default SupportReq;
