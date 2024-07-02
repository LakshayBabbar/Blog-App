import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
    </>
  );
};

export default App;
