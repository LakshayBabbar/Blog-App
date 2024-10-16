import React from "react";
import { useToast } from "../ui/use-toast";
import useSend from "@/hooks/useSend";
import Button from "../ui/Button";

const RequestCard = ({ req, refetch }) => {
  const { fetchData, loading } = useSend();
  const { toast } = useToast();
  const [expanded, setExpanded] = React.useState(false);

  const handleReqDelete = async () => {
    const res = await fetchData("/api/admin/support", "DELETE", {
      id: req._id,
    });
    if (!res?.error) {
      refetch();
      toast({ description: "Request deleted successfully" });
    } else {
      toast({ description: res?.error, title: "An Error Occured" });
    }
  };
  return (
    <div className="p-4 flex flex-col gap-2 rounded-md bg-gradient-to-r from-indigo-900 to-indigo-950 w-full md:w-96 min-h-56 max-h-fit">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{req.subject}</h1>
        <Button
          onClick={handleReqDelete}
          variant="destructive"
          size="sm"
          disabled={loading}
        >
          Delete
        </Button>
      </div>
      <div>
        <p className={`${!expanded ? "line-clamp-4" : "line-clamp-none"}`}>
          {req.message}
        </p>
        {req.message.length > 175 && (
          <button className="font-bold" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      <p className="text-sm">~&nbsp;{req.email}</p>
    </div>
  );
};

export default RequestCard;
