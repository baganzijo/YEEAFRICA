// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars, FaTimes, FaSearch, FaMoon, FaSun, FaUserCircle, FaBell
} from 'react-icons/fa';
import logo from '../assets/Internsavvy.png';
import AuthModal from './AuthModal';
import { UserAuth } from '../Context/AuthContext';
import { supabase } from '../supabaseClient';

const Navbar = ({ menuOpen, setMenuOpen }) => {
  const [authType, setAuthType] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const { session, signOutUser } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();
  const overlayRef = useRef();

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (!error && data?.role) {
          setRole(data.role);
        }
      }
    };
    fetchRole();
  }, [session]);

 useEffect(() => {
  let interval;

  const fetchUnreadNotifications = async () => {
    if (session?.user?.id) {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('is_read', false);

      if (!error) setUnreadCount(count || 0);
    }
  };

  if (session?.user?.id) {
    fetchUnreadNotifications();
    interval = setInterval(fetchUnreadNotifications, 30000); // auto-refresh every 30s
  }

  return () => clearInterval(interval);
}, [session]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        overlayRef.current &&
        overlayRef.current.contains(e.target)
      ) {
        closeMenu();
      }
      if (dropdownOpen && !e.target.closest('#userDropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await signOutUser();
    setDropdownOpen(false);
     setRole(null); // 👈 Reset role
    navigate('/');
  };


  const publicLinks = [
  { name: 'YEE Africa', path: '/' },
   { name: 'Jobs', path: '/jobs' },
    { name: 'Internships', path: '/internships' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
 
 
];

const authLinks =
  role === 'employer'
    ? [
       
        { name: 'Dashboard', path: '/employer-dashboard' },
       
      ]
    : role === 'student'
    ? [
      
        { name: 'Dashboard', path: '/student-dashboard' },
       
       
      ]
    : [];

const navLinks = session ? authLinks : publicLinks;



  const profilePath = role ? `/${role}-profile` : '/';

  return (
    <>
      <header className="bg-white dark:bg-gray-950 shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and nav */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain bg-white rounded-full" />
            <nav className="hidden lg:flex gap-6 items-center text-black dark:text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`hover:text-blue-500 transition ${
                    location.pathname === link.path ? 'text-yellow-400' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search */}
          {['/internships', '/jobs'].includes(location.pathname) && (
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full w-60 md:w-80">
              <FaSearch className="text-gray-600 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="bg-transparent outline-none w-full px-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Right side desktop */}
          <div className="hidden lg:flex items-center gap-4 text-black dark:text-white">
            <button onClick={toggleTheme} className="text-xl ml-2">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {session && (
              <Link to="/notifications" className="relative">
                <FaBell className="text-xl hover:text-blue-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {session ? (
              <div className="relative" id="userDropdown">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 hover:text-blue-500">
                  <FaUserCircle className="text-xl" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow rounded w-48 py-2 z-50">
                    <Link to={profilePath} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      My Profile
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthType('login')}
                  className="px-4 py-1 border rounded-full border-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthType('register')}
                  className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile menu icon */}
          <div className="lg:hidden flex items-center gap-4 text-black dark:text-white">

            
           
            <button onClick={() => setMenuOpen(true)}><FaBars /></button>
          </div>
        </div>

        {/* Mobile sidebar menu */}
        {menuOpen && (
          <div ref={overlayRef} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40">
            <div ref={menuRef} className="fixed right-0 top-0 w-3/5 h-full bg-white dark:bg-gray-950 p-6 z-50 flex flex-col">
              <div className="flex justify-end  dark:text-white mb-6">
                <button onClick={closeMenu}><FaTimes size={24} /></button>
              </div>
              <nav className="flex flex-col gap-4 dark:text-white">


                



                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path} 
                    onClick={closeMenu}
                    className= {`block px-4 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-80 hover:text-blue-500 transition ${
                    location.pathname === link.path ? 'text-yellow-400' : ''
                  }`}
                  >
                    {link.name}
                  </Link>
                ))}

                

                {!session ? (
                  <>
                    <button
                      onClick={() => {
                        closeMenu();
                        setAuthType("login");
                      }}
                      
                      className="w-full text-left px-4 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        closeMenu();
                        setAuthType("register");
                      }}
                      className="w-full text-left px-4 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={profilePath}
                      onClick={closeMenu}
                      className="block px-4 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      My Account
                    </Link>
                     <div className="flex justify-between px-4 py-2 dark:text-white hover:bg- dark:hover:bg-slate-800 mb-6"> Theme
                <button onClick={toggleTheme}>{darkMode ? <FaSun /> : <FaMoon />}</button>
              </div>


              {session && (
                
                                <Link  onClick={closeMenu} to="/notifications" className="px-4 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 flex justify-between items-center">
                                  Notifications
                                  {unreadCount > 0 && (
                                    <span className="bg-blue-700 text-white hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                      {unreadCount}
                                    </span>
                                  )}
                                </Link>
                              )}
                     
                    <button
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                      className="w-full text-left px-4 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      

      {/* Auth modal */}
      {authType && (
        <AuthModal
          authType={authType}
          onClose={() => setAuthType(null)}
          switchAuth={(type) => setAuthType(type)}
        />
      )}
    </>
  );
};

export default Navbar;
