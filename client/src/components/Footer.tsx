import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-neutral-900/60 border-t border-neutral-800 text-neutral-400">
      <div className="container mx-auto px-6">
        {/* Contact + Social */}
        <div id="contact" className="py-10 border-b border-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-white">Contact</h3>
              <p className="text-neutral-400 flex items-center gap-2"><Mail className="h-4 w-4" /> support@cryptomax.com</p>
              <p className="text-neutral-400 flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (415) 555-0199</p>
              <p className="text-neutral-400 flex items-center gap-2"><MapPin className="h-4 w-4" /> San Francisco, CA</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-white">Quick Links</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/#returns" className="hover:text-white transition-colors">Returns</a></li>
                <li><Link to="/affiliate" className="hover:text-white transition-colors">Affiliate</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            
          </div>
        </div>

        {/* Licensing */}
        <div className="pb-8 border-t border-neutral-800">
          <div className="pt-8">
            <h3 className="font-semibold text-lg text-white">Regulatory Status & Licensing</h3>
            <div className="mt-2 text-sm text-neutral-400">
              <p>
                Licensing in progress — targeting EU VASP registrations, US MSB (FinCEN), and UK FCA cryptoasset firm registration where applicable; until approvals are finalized, CryptoMax provides technology and educational tools only (no brokerage, advisory, or custody).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img src="/logos/CMlogo.svg" alt="CryptoMax" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold gradient-text">CryptoMax</span>
            </div>
            <div className="text-sm">
              © 2024 CryptoMax. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;