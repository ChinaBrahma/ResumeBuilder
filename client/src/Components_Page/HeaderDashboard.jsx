import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import Logout from "./Logout";
import useAuthStore from "../store/authStore";

const HeaderDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            ACES
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* User Greeting */}
          <div className="flex items-center space-x-2 bg-gray-100/50 dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:shadow-md">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Hello, {user?.username || "Guest"}
            </span>
          </div>

          <ThemeToggle />
          <Logout />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-800/50 animate-slide-in">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center space-x-2 bg-gray-100/50 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Hello, {user?.username || "Guest"}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <ThemeToggle />
              <Logout />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderDashboard;