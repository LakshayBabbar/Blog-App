import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authentication";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuth) {
      toast("You need to login to access this page", "error");
      navigate("/", { replace: true });
    }
  }, [isAuth, navigate, toast]);

  return isAuth && children;
};

export default ProtectedRoute;
