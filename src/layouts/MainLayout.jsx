import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { BsSun, BsMoon, BsBell } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { AiFillHome, AiOutlineCalendar } from 'react-icons/ai';
import { FaTasks } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineAnalytics, MdSpeed } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import { MdLogout } from 'react-icons/md';
import useAuth from '../hooks/useAuth';
import profile from '../assets/images/login-bg.jpg';

export default function MainLayout() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const notifications = 3;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  const { logout } = useAuth();
  return (
    <div className="flex">
      {/* Aside */}
      <aside
        className={`w-80 min-h-screen shadow-md border-gray-200 ${
          isDark ? 'bg-[#1B232D] text-white' : 'bg-white text-black'
        }`}
      >
        <div className="fixed w-80 p-6">
          <div className="my-5  flex justify-center">
            <h1 className="text-xl font-bold">ALCO KPI</h1>
          </div>
          <nav className='flex flex-col justify-between h-[85vh]'>
            <ul className="space-y-2 text-lg">
              <li className="mt-5 w-full">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? isActive
                          ? 'bg-[#2A3442] text-[#3379F5]'
                          : 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : isActive
                        ? 'bg-[#ECF0FF] text-[#3379F5]'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`
                  }
                >
                  <AiFillHome size={24} /> Ana səhifə
                </NavLink>
              </li>

              <li className="mt-5 w-full">
                <NavLink
                  to="/task"
                  className={({ isActive }) =>
                    `flex items-center gap-3  w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? isActive
                          ? 'bg-[#2A3442] text-[#3379F5]'
                          : 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : isActive
                        ? 'bg-[#ECF0FF] text-[#3379F5]'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`
                  }
                >
                  <FaTasks size={24} />
                  Tapşırıqlar
                </NavLink>
              </li>

              <li className="mt-5 w-full">
                <NavLink
                  to="/kpi_system"
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? isActive
                          ? 'bg-[#2A3442] text-[#3379F5]'
                          : 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : isActive
                        ? 'bg-[#ECF0FF] text-[#3379F5]'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`
                  }
                >
                  <MdOutlineAnalytics size={24} />
                  Kpi Sistem
                </NavLink>
              </li>

              <li className="mt-5 w-full">
                <NavLink
                  to="/performans"
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? isActive
                          ? 'bg-[#2A3442] text-[#3379F5]'
                          : 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : isActive
                        ? 'bg-[#ECF0FF] text-[#3379F5]'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`
                  }
                >
                  <MdSpeed size={24} />
                  Performans
                </NavLink>
              </li>

              <li className="mt-5 w-full">
                <NavLink
                  to="/dolum_sexi"
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? isActive
                          ? 'bg-[#2A3442] text-[#3379F5]'
                          : 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : isActive
                        ? 'bg-[#ECF0FF] text-[#3379F5]'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`
                  }
                >
                  <FaTasks size={24} />
                  Dolum Sexi
                </NavLink>
              </li>

              <li className="mt-5 w-full">
                <NavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? isActive
                          ? 'bg-[#2A3442] text-[#3379F5]'
                          : 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : isActive
                        ? 'bg-[#ECF0FF] text-[#3379F5]'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`
                  }
                >
                  <AiOutlineCalendar size={24} />
                  Təqvim
                </NavLink>
              </li>

              <li className="mt-5 w-full">
                <NavLink
                  to="/report"
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? isActive
                          ? 'bg-[#2A3442] text-[#3379F5]'
                          : 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : isActive
                        ? 'bg-[#ECF0FF] text-[#3379F5]'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`
                  }
                >
                  <HiOutlineDocumentReport size={24} />
                  Hesabat
                </NavLink>
              </li>
            </ul>
            <button
              onClick={logout}
              className={`block w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                isDark
                  ? 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                  : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <MdLogout size={24} />
                Çıxış
              </div>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 p-6 ${isDark ? 'bg-[#131920]' : 'bg-[#EFF3F9]'} transition duration-500`}
      >
        {/* Navbar */}
        <nav
          className={`p-4 shadow-md border-gray-200 mb-6 rounded-lg ${
            isDark ? 'bg-[#1B232D] text-white' : 'bg-white text-black'
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
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-700 transition duration-500 rounded-full flex items-center justify-center cursor-pointer"
              >
                <FiUser className="w-5 h-5 text-white" />
              </div>

              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg p-3 z-50 ${
                    isDark ? 'bg-[#1B232D] text-white' : 'bg-white text-black'
                  }`}
                >
                  <div className="flex mb-3 gap-2 items-center">
                    <img className="w-10 h-10 rounded-full object-cover" src={profile} alt="" />
                    <div>
                      <p>Ad soyaaad</p>
                      <p>Rol</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className={`block w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FiUser className="w-5 h-5 text-[#3379F5]" />
                      Profilim
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className={`block w-full p-3 rounded-md transition duration-500 ease-in-out cursor-pointer ${
                      isDark
                        ? 'bg-[#1B232D] hover:bg-[#2A3442] text-white'
                        : 'bg-white hover:bg-[#ECF0FF] hover:text-[#3379F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MdLogout className="w-5 h-5 text-[#3379F5]" />
                      Çıxış
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
