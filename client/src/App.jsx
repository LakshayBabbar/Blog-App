import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./context/Authentication";

const App = () => {
  return (
    <Authentication>
      <div className="mt-28"/>
      <Navbar />
      <div className="bg-bak w-full h-[60%] top-80 blur-[200px] z-[-1] absolute" />
      <Outlet />
    </Authentication>
  );
};

export default App;
