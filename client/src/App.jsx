import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./context/Authentication";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Authentication>
        <Navbar />
        <Outlet />
      </Authentication>
    </QueryClientProvider>
  );
};

export default App;
