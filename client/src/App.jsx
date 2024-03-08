import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./context/Authentication";

const App = () => {
  console.log("App Call");
  return (
    <Authentication>
      <Navbar />
      <Outlet />
    </Authentication>
  );
};

export default App;
