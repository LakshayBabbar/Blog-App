"use client";
import { TbEdit } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AlertWrapper from "../ui/AlertWrapper";
import useSend from "@/hooks/useSend";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const BlogCustomization = ({ slug, blogId, userId }) => {
  const { status, data } = useSession();
  const { fetchData, loading } = useSend();
  const { toast } = useToast();
  const router = useRouter();
  const deleteBlogHandler = async () => {
    const response = await fetchData(`/api/blogs/${blogId}/edit`, "DELETE");
    if (response?.success) {
      router.push(`/blogs/${slug}`);
    } else {
      toast({
        title: response?.message,
        description: new Date().toString(),
      });
    }
  };
  if (status === "unauthenticated" || userId !== data?.user?.id) {
    return null;
  }
  return (
    <div className="flex gap-4 items-center justify-end">
      <Link
        href={`/blogs/${slug}/edit`}
        aria-label="edit blog"
        className="text-2xl"
      >
        <TbEdit />
      </Link>
      <AlertWrapper
        className="text-xl w-fit p-0 h-fit"
        onClick={deleteBlogHandler}
        aria-label="delete blog"
        disabled={loading}
      >
        <BsFillTrashFill />
      </AlertWrapper>
    </div>
  );
};

export default BlogCustomization;
