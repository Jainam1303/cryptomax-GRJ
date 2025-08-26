import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logos/CMlogo.svg" alt="CryptoMax" className="w-12 h-12 rounded-lg mr-3" />
            <span className="text-xl font-bold gradient-text">CryptoMax</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="/#returns" className="text-muted-foreground hover:text-primary transition-colors">
              Returns
            </a>
            <a href="/affiliate" className="text-muted-foreground hover:text-primary transition-colors">
              Affiliate
            </a>
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About Us
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login"><Button variant="ghost" className="text-white hover:text-neutral-300">Log In</Button></Link>
            <Link to="/login"><Button className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold">Get Started</Button></Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 p-6">
            <div className="flex flex-col space-y-4">
              <a href="/#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="/#returns" className="text-muted-foreground hover:text-primary transition-colors">
                Returns
              </a>
              <a href="/affiliate" className="text-muted-foreground hover:text-primary transition-colors">
                Affiliate
              </a>
              <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/login"><Button variant="ghost" className="text-white hover:text-neutral-300">Log In</Button></Link>
                <Link to="/login"><Button className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold">Get Started</Button></Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;