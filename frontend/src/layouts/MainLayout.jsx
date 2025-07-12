import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import SearchBar from "../components/navigation/SearchBar";

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <div className="">
          <SearchBar />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
