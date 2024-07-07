"use client";
import Button from "../ui/Button";
import { Input } from "../ui/input";
import { GradientButton } from "../ui/GradientButton";
import { useState } from "react";
import useSend from "@/hooks/useSend";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const EditUserModal = ({ isOpen, setIsOpen, data, slug }) => {
  const [formData, setFormData] = useState(data);
  const { fetchData, isErr, err, loading } = useSend();
  const { toast } = useToast();
  const router = useRouter();

  const handleFormValue = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetchData(`/api/users/${slug}/edit`, "PUT", formData);
    if (res?.success) {
      toast({
        title: res.message,
        description: new Date().toString(),
      });
      setIsOpen(false);
    }
  };

  const accountCloseHandler = async () => {
    const res = await fetchData(`/api/users/${slug}/edit`, "DELETE");
    if (res?.success) {
      toast({
        title: res.message,
        description: new Date().toString(),
      });
      setIsOpen(false);
      await signOut();
      router.push("/");
    }
  };
  return isOpen ? (
    <div className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.46)] backdrop-blur-lg flex items-center justify-center z-[10]">
      <div className="w-4/5 sm:w-[30rem] bg-black border rounded-xl p-10 space-y-5">
        <h1 className="text-xl font-semibold">Edit Details</h1>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <Input
            name="name"
            value={formData.name}
            onChange={handleFormValue}
            placeholder="Full Name"
          />
          <Input
            name="bio"
            value={formData.bio}
            onChange={handleFormValue}
            placeholder="Bio"
          />
          <div className="flex justify-end gap-4">
            <Button
              type="reset"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Update
            </Button>
          </div>
        </form>
        {isErr && <p className="text-red-500 text-sm text-center">{err}</p>}
        <div className="text-center flex items-center justify-between">
          <hr className="flex-grow" /> <span>Or</span>{" "}
          <hr className="flex-grow" />
        </div>
        <div className="flex w-full flex-col items-center gap-4">
          <Button
            variant="destructive"
            className="w-fit"
            onClick={accountCloseHandler}
            disabled={loading}
          >
            Close Account
          </Button>
          <p className="text-amber-400 text-sm text-center">
            Note: Clicking this button will permanently close your account and
            delete all associated data.
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

const EditUser = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { status, data: sessionData } = useSession();

  if (
    status === "unauthenticated" ||
    sessionData?.user?.username !== data?.username
  )
    return null;

  return (
    <>
      <div className="h-[fit-content]">
        <GradientButton onClick={() => setIsOpen(true)}>Edit</GradientButton>
      </div>
      {isOpen && (
        <EditUserModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={{
            name: data?.displayName,
            bio: data?.bio,
          }}
          slug={data?.username}
        />
      )}
    </>
  );
};

export default EditUser;
