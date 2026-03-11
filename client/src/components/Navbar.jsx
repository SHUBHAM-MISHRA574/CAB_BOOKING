import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoPersonCircleOutline, IoPersonOutline, IoLogOutOutline } from 'react-icons/io5';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-uber-black font-bold text-xl tracking-tight hover:opacity-90">
            <span className="w-8 h-8 rounded-lg bg-uber-green flex items-center justify-center text-white font-bold text-sm">C</span>
            CabBook
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link to="/" className="px-3 py-2 rounded-lg text-neutral-600 hover:text-uber-black hover:bg-neutral-100 font-medium text-sm transition-colors">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/book" className="px-4 py-2 rounded-lg bg-uber-black text-white font-semibold text-sm hover:bg-neutral-800 transition-colors">
                  Book a ride
                </Link>
                <Link to="/bookings" className="px-3 py-2 rounded-lg text-neutral-600 hover:text-uber-black hover:bg-neutral-100 font-medium text-sm transition-colors">
                  My Bookings
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                  >
                    <IoPersonCircleOutline className="w-6 h-6 text-neutral-600" aria-hidden />
                    <span className="text-neutral-700 font-medium text-sm max-w-[120px] truncate sm:max-w-[140px]">
                      {user.name}
                    </span>
                    <svg className={`w-4 h-4 text-neutral-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-1 w-56 rounded-xl border border-neutral-200 bg-white shadow-lg py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-neutral-100">
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Signed in as</p>
                        <p className="text-sm font-semibold text-neutral-900 truncate mt-0.5">{user.name}</p>
                        {user.email && (
                          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 text-sm font-medium transition-colors"
                      >
                        <IoPersonOutline className="w-5 h-5 text-neutral-500 shrink-0" aria-hidden />
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                      >
                        <IoLogOutOutline className="w-5 h-5 shrink-0" aria-hidden />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-lg text-neutral-600 hover:text-uber-black hover:bg-neutral-100 font-medium text-sm transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-uber-green text-white font-semibold text-sm hover:bg-uber-green-hover transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
