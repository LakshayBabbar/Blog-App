"use client";
import { TbEdit } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AlertWrapper from "../ui/AlertWrapper";
import useSend from "@/hooks/useSend";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { CornerUpLeft } from "lucide-react";

const BlogCustomization = ({ slug, blogId, userId }) => {
  const { status, data } = useSession();
  const { fetchData, loading } = useSend();
  const { toast } = useToast();
  const router = useRouter();

  const deleteBlogHandler = async () => {
    const response = await fetchData(`/api/blogs/${blogId}/edit`, "DELETE");
    if (!response?.error) {
      router.push(`/users/${data?.user?.username}`);
    }
    toast({
      title: response?.message || response?.error,
      description: new Date().toString(),
    });
  };
  if (status === "unauthenticated" || userId !== data?.user?.id) {
    return (
      <div>
        <button
          onClick={() => router.back()}
          className="flex flex-row-reverse items-center gap-1 underline underline-offset-4"
        >
          Go Back <CornerUpLeft className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex justify-between">
      <button
        onClick={() => router.back()}
        className="flex flex-row-reverse items-center gap-1 underline underline-offset-4"
      >
        Go Back <CornerUpLeft className="size-4" />
      </button>
      <div className="flex items-center gap-4">
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
    </div>
  );
};

export default BlogCustomization;
