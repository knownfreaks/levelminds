import { Menu, Bell } from "lucide-react";

const SearchBar = ({ collapsed, setCollapsed }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
      <div className="flex items-center gap-4">
        {/* Collapse Toggle */}
        {/* <button onClick={() => setCollapsed(!collapsed)}>
          <Menu className="w-6 h-6 text-gray-600" />
        </button> */}
        {/* Search bar */}
        <div className="relative bg-gray-100 px-3 py-2 rounded-full text-sm flex items-center w-96">
          <span className="mr-2 text-gray-500">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="relative">
        <Bell className="w-5 h-5 text-gray-800" />
        <span className="absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full translate-x-1 -translate-y-1" />
      </div>
    </header>
  );
};

export default SearchBar;
