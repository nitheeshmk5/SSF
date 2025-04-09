import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/person.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem("user");
  const isLoginPage = location.pathname === "/login";

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Redirect to homepage after logout
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-dark-900 to-dark-800 text-text-100 shadow-lg">
      <Link
        to="/"
        className="text-2xl font-bold flex items-center hover:text-accent-300 transition-colors duration-300"
        onClick={handleLinkClick}
      >
        <img src={logo} alt="Logo" className="w-10 h-10 mr-3" />
        Smart Self Finance
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 items-center">
        {user && (
          <>
            <Link
              to="/budget"
              className="px-4 py-2 hover:bg-dark-700 rounded-lg transition-all duration-300 text-accent-400 hover:text-accent-300"
              onClick={handleLinkClick}
            >
              Budgets
            </Link>
            <Link
              to="/monthly-report"
              className="px-4 py-2 hover:bg-dark-700 rounded-lg transition-all duration-300 text-accent-400 hover:text-accent-300"
              onClick={handleLinkClick}
            >
              Monthly Report
            </Link>
            <Link
              to="/goals"
              className="px-4 py-2 hover:bg-dark-700 rounded-lg transition-all duration-300 text-accent-400 hover:text-accent-300"
              onClick={handleLinkClick}
            >
              Goals
            </Link>
          </>
        )}
        {user ? (
          <button
            onClick={logout}
            className="bg-danger-600 px-4 py-2 rounded-lg hover:bg-danger-700 text-text-100 transition-all duration-300"
          >
            Logout
          </button>
        ) : (
          !isLoginPage && (
            <Link
              to="/login"
              className="bg-accent-600 px-4 py-2 rounded-lg hover:bg-accent-700 text-text-100 transition-all duration-300"
              onClick={handleLinkClick}
            >
              Login
            </Link>
          )
        )}
      </div>

      {/* Mobile Hamburger - Show only if logged in */}
      {user && (
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-8 h-8 transition-transform duration-300 ease-in-out text-text-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      )}

      {/* Mobile Menu - Show only if logged in */}
      {user && (
        <div
          className={`md:hidden absolute top-16 left-0 w-full bg-gradient-to-b from-dark-900 to-dark-800 text-text-100 shadow-lg transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="p-6 space-y-4">
            <Link
              to="/budget"
              className="block py-2 px-4 hover:bg-dark-700 rounded-lg transition-all duration-300 text-accent-400 hover:text-accent-300"
              onClick={handleLinkClick}
            >
              Budgets
            </Link>
            <Link
              to="/monthly-report"
              className="block py-2 px-4 hover:bg-dark-700 rounded-lg transition-all duration-300 text-accent-400 hover:text-accent-300"
              onClick={handleLinkClick}
            >
              Monthly Report
            </Link>
            <Link
              to="/goals"
              className="block py-2 px-4 hover:bg-dark-700 rounded-lg transition-all duration-300 text-accent-400 hover:text-accent-300"
              onClick={handleLinkClick}
            >
              Goals
            </Link>
            <button
              onClick={logout}
              className="block w-full py-2 bg-danger-600 rounded-lg hover:bg-danger-700 text-text-100 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
