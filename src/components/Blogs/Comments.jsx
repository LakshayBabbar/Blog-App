"use client";
import Link from "next/link";
import { GradientButton } from "../ui/GradientButton";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import useSend from "@/hooks/useSend";

const Comments = ({ blogId }) => {
  const { status } = useSession();
  const { data, isError, error, refetch } = useFetch(
    `/api/comments/${blogId}`,
    blogId
  );
  const [comment, setComment] = useState("");
  const { fetchData, loading } = useSend();
  const { toast } = useToast();

  const handleComment = async (e) => {
    e.preventDefault();
    if (status === "authenticated") {
      const res = await fetchData(`/api/comments/create`, "POST", {
        blogId,
        description: comment,
      });
      toast({
        title: res.message,
        description: new Date().toString(),
      });
      refetch();
      setComment("");
    } else {
      toast({
        title: "Please login to add a comment.",
        description: "You need to be logged in to add a comment.",
      });
    }
  };

  const deleteComment = async (id) => {
    const res = await fetchData(`/api/comments/delete`, "DELETE", {
      commentId: id,
    });
    res.success && refetch();
    toast({
      title: res.message,
      description: new Date().toString(),
    });
  };

  return (
    <div className="space-y-4" id="comments">
      <form onSubmit={handleComment} className="flex relative">
        <input
          type="text"
          required
          className="w-full bg-transparent border-b h-10 px-2 focus:outline-0"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="absolute right-0">
          <GradientButton type="submit" disabled={loading}>
            Add
          </GradientButton>
        </div>
      </form>
      {data?.length > 0 ? (
        data.map((item) => (
          <div key={item._id} className="text-slate-300">
            <div className="flex justify-between">
              <Link
                href={`/users/${item.username}`}
                className="hover:underline"
              >
                @{item.username}
              </Link>
              <div className="flex items-center gap-1 ">
                <span>{item.createdAt.substring(0, 10)}</span>
                {item.isUser && (
                  <button disabled={loading} className="disabled:brightness-50">
                    <MdDelete
                      onClick={() => deleteComment(item._id)}
                      className="cursor-pointer text-red-600"
                    />
                  </button>
                )}
              </div>
            </div>
            <p className="text-slate-100">{item.description}</p>
          </div>
        ))
      ) : (
        <p className="text-slate-100">No comments yet.</p>
      )}
      {isError && <h3>{error.message}</h3>}
    </div>
  );
};

export default Comments;
