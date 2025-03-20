
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X,
  Home,
  Wallet,
  LineChart,
  PiggyBank,
  DollarSign,
  Settings,
  HelpCircle,
  LogIn,
  UserPlus
} from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-walletwise-purple">WalletWise</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-gray-600 hover:text-walletwise-purple px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/features" className="text-gray-600 hover:text-walletwise-purple px-3 py-2 rounded-md text-sm font-medium">
              Features
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-walletwise-purple px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-walletwise-purple px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
            <div className="flex items-center gap-2 ml-4">
              <Link to="/signup">
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-walletwise-purple focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute z-50 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/"
              className="text-gray-700 hover:text-walletwise-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/features"
              className="text-gray-700 hover:text-walletwise-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link 
              to="/about"
              className="text-gray-700 hover:text-walletwise-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link 
              to="/contact"
              className="text-gray-700 hover:text-walletwise-purple block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link 
              to="/signup"
              className="text-walletwise-purple hover:bg-walletwise-purple hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Sign Up
            </Link>
            <Link 
              to="/login"
              className="text-walletwise-purple hover:bg-walletwise-purple hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
