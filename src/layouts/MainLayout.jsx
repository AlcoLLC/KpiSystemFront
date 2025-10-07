import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { BsSun, BsMoon, BsBell } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { AiFillHome, AiOutlineCalendar } from 'react-icons/ai';
import { FaTasks } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineAnalytics, MdSpeed, MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import useAuth from '../hooks/useAuth';

export default function MainLayout() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const { user, logout } = useAuth();
  const notifications = 3;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const body = window.document.body;
    if (isDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const navLinkClasses = ({ isActive }) =>
    `nav-link flex items-center gap-3 w-full p-3 rounded-md transition-colors duration-300 ease-in-out cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
      isActive ? 'active bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : ''
    }`;

  return (
    <div className="flex">
      <aside className="main-layout-aside w-80 min-h-screen shadow-md bg-white text-black dark:bg-[#1B232D] dark:text-white dark:border-r dark:border-gray-700">
        <div className="fixed w-80 p-6">
          <div className="my-5 flex justify-center">
            <h1 className="text-xl font-bold">ALCO KPI</h1>
          </div>
          <nav className="flex flex-col justify-between h-[85vh]">
            <ul className="space-y-2 text-lg">
              <li className="mt-5 w-full">
                <NavLink to="/" className={navLinkClasses}>
                  <AiFillHome size={24} /> Ana səhifə
                </NavLink>
              </li>
              <li className="mt-5 w-full">
                <NavLink to="/tasks" className={navLinkClasses}>
                  <FaTasks size={24} /> Tapşırıqlar
                </NavLink>
              </li>
              <li className="mt-5 w-full">
                <NavLink to="/kpi_system" className={navLinkClasses}>
                  <MdOutlineAnalytics size={24} /> Kpi Sistem
                </NavLink>
              </li>
              <li className="mt-5 w-full">
                <NavLink to="/performance" className={navLinkClasses}>
                  <MdSpeed size={24} /> Performans
                </NavLink>
              </li>
              <li className="mt-5 w-full">
                <NavLink to="//" className={navLinkClasses}>
                  <FaTasks size={24} /> Dolum Sexi
                </NavLink>
              </li>
              <li className="mt-5 w-full">
                <NavLink to="//" className={navLinkClasses}>
                  <AiOutlineCalendar size={24} /> Təqvim
                </NavLink>
              </li>
              <li className="mt-5 w-full">
                <NavLink to="//" className={navLinkClasses}>
                  <HiOutlineDocumentReport size={24} /> Tarixçə
                </NavLink>
              </li>
              <li className="mt-5 w-full">
                <NavLink to="/userperformance/" className={navLinkClasses}>
                  <HiOutlineDocumentReport size={24} /> İstifadəçi qiymətləndirməsi
                </NavLink>
              </li>
            </ul>
             <button onClick={logout} className={navLinkClasses({ isActive: false })}>
              <div className="flex items-center gap-2"> <MdLogout size={24} /> Çıxış </div>
            </button>
          </nav>
        </div>
      </aside>
       <main className="main-layout-main-content flex-1 p-6 transition-colors duration-500 bg-[#EFF3F9] dark:bg-[#131920]">
        <nav className="main-layout-navbar p-4 shadow-md mb-6 rounded-lg bg-white text-black dark:bg-[#1B232D] dark:text-white dark:border dark:border-gray-700">
          <div className="flex justify-end items-center space-x-4">
            <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {isDark ? <BsSun className="w-6 h-6 text-yellow-400" /> : <BsMoon className="w-6 h-6 text-gray-600" />}
            </button>
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer overflow-hidden bg-gray-200"
              >
                {user && user.profile_photo ? (
                  <img
                    src={user.profile_photo}
                    alt="Profil şəkli"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-500 hover:bg-blue-700 transition duration-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
              {dropdownOpen && (
                 <div className="main-layout-dropdown absolute right-0 mt-2 w-72 rounded-lg shadow-lg p-3 z-50 bg-white text-black dark:bg-[#1B232D] dark:text-white dark:border dark:border-gray-700">
                  <div className="flex mb-3 gap-3 items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {user && user.profile_photo ? (
                        <img
                          className="w-full h-full object-cover"
                          src={user.profile_photo}
                          alt="Profil şəkli"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-500 flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {user
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : 'İstifadəçi Adı'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user ? user.role_display : 'Vəzifə'}</p> {/* Mətn rəngi dəyişdirildi */}
                    </div>
                  </div>
                  <Link to="/profile" className={navLinkClasses({ isActive: false })}>
                    <div className="flex items-center gap-2">
                      <FiUser className="w-5 h-5" /> Profilim
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className={`${navLinkClasses({ isActive: false })} w-full`}
                  >
                    <div className="flex items-center gap-2">
                      <MdLogout className="w-5 h-5" /> Çıxış
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
