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

const BottomNav = ({ onNavigate }) => {
  const [authType, setAuthType] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const { session, signOutUser } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  }
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
    interval = setInterval(fetchUnreadNotifications, 1000); // auto-refresh every 30s
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
 
  { name: 'Jobs', path: '/jobs' },
  { name: 'Internships', path: '/internships' },
 
  { name: 'FAQ', path: '/faq' },
];

const authLinks =
  role === 'employer'
    ? [
        { name: 'Home', path: '/home' },
        { name: 'Dashboard', path: '/employer-dashboard' },
        { name: 'Post Job', path: '/post-job' },
      ]
    : role === 'student'
    ? [
        { name: 'Home', path: '/home' },
         { name: 'Jobs', path: '/jobs' },
        { name: 'Interns', path: '/internships' },
        { name: 'Notification', path: '/notifications' },
      ]
    : [];

const navLinks = session ? authLinks : publicLinks;



  const profilePath = role ? `/${role}-profile` : '/';

  return (
    <>
      <nav className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow fixed bottom-0 left-0 right-0 border-t z-50 flex justify-around items-center h-14 md:hidden">
        {navLinks.map((link) => (
                  <Link
                  
                    key={link.name}
                    to={link.path}
                    className= {`block px-4 py-2 rounded text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-80 hover:text-blue-500 transition ${
                    location.pathname === link.path ? 'text-yellow-400' : ''
                  }`}
                    
                  >
                    {link.name}
                  </Link>
                ))}

                {session && ( 
                  <Link  to="/notifications" className="px-4 py-2 rounded text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 flex justify-between items-center">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="bg-blue-700 text-white hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                
      </nav>

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

export default BottomNav;
