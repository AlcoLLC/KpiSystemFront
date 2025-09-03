import { Outlet, Link } from "react-router-dom";
import { BsSun, BsMoon, BsBell } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";

export default function MainLayout() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const notifications = 3;

  return (
    <div className="flex h-screen">
      {/* Aside */}
      <aside
        className={`w-80 p-6 shadow-md border-gray-200 ${
          isDark ? "bg-[#1B232D] text-white" : "bg-white text-black"
        }`}
      >
        <div className="mb-6 flex justify-center">
          <h1 className="text-xl font-bold">ALCO KPI</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li className="mt-5 w-full">
              <Link
                className={`block w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                  isDark
                    ? "bg-[#1B232D] hover:bg-[#2A3442] text-white"
                    : "bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]"
                }`}
                to="/home"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 p-6 ${
          isDark ? "bg-[#131920]" : "bg-[#EFF3F9]"
        } transition duration-500`}
      >
        {/* Navbar */}
        <nav
          className={`p-4 shadow-md border-gray-200 mb-6 rounded-lg ${
            isDark ? "bg-[#1B232D] text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex justify-end items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-gray-400 transition"
            >
              {isDark ? (
                <BsSun className="w-6 h-6 text-yellow-400" />
              ) : (
                <BsMoon className="w-6 h-6 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-400 transition">
                <BsBell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 hover:bg-blue-700  transition  duration-500 rounded-full flex items-center justify-center cursor-pointer">
                <FiUser className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
