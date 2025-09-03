import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { BsSun, BsMoon, BsBell } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';

export default function MainLayout() {
  const [isDark, setIsDark] = useState(false);
  const [notifications] = useState(3); // Bildiriş sayı

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`flex h-screen ${isDark ? "bg-[#131920]" : "bg-[#EFF3F9]"}`}>
      {/* ASIDE */}
      <aside
        className={`w-80 p-6 shadow-md border-gray-200 transition-colors duration-500 ${
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
                    ? "bg-[#1B232D] hover:bg-[#2A3440] text-white hover:text-[#3379F5]"
                    : "bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]"
                }`}
                to="/home"
              >
                Dashboard
              </Link>
            </li>
            <li className="mt-5 w-full">
              <Link
                className={`block w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                  isDark
                    ? "bg-[#1B232D] hover:bg-[#2A3440] text-white hover:text-[#3379F5]"
                    : "bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]"
                }`}
                to="/home"
              >
                Dashboard
              </Link>
            </li>
            <li className="mt-5 w-full">
              <Link
                className={`block w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                  isDark
                    ? "bg-[#1B232D] hover:bg-[#2A3440] text-white hover:text-[#3379F5]"
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

      {/* MAIN */}
      <main
        className={`flex-1 p-6 transition-colors duration-500 ${
          isDark ? "bg-[#131920]" : "bg-[#EFF3F9]"
        }`}
      >
        <nav
          className={`p-4 shadow-md border-gray-200 mb-6 rounded-lg transition-colors duration-500 ${
            isDark ? "bg-[#1B232D] text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex justify-end items-center space-x-4">
            {/* Toggle Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? (
                <BsSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <BsMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors duration-200">
                <BsBell className="w-5 h-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </nav>

        <Outlet />
      </main>
    </div>
  );
}
