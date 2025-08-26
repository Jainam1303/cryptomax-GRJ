import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-primary text-background">
      <div className="container mx-auto px-6">
        {/* Contact + Social */}
        <div id="contact" className="py-10 border-b border-background/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Contact</h3>
              <p className="text-background/80 flex items-center gap-2"><Mail className="h-4 w-4" /> support@cryptomax.com</p>
              <p className="text-background/80 flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (415) 555-0199</p>
              <p className="text-background/80 flex items-center gap-2"><MapPin className="h-4 w-4" /> San Francisco, CA</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Quick Links</h3>
              <ul className="space-y-2 text-background/80">
                <li><a href="#features" className="hover:text-background/90">Features</a></li>
                <li><a href="#returns" className="hover:text-background/90">Returns</a></li>
                <li><a href="#contact" className="hover:text-background/90">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Follow</h3>
              <div className="flex gap-4 text-background/90">
                <a aria-label="Twitter" href="#"><Twitter className="h-5 w-5" /></a>
                <a aria-label="LinkedIn" href="#"><Linkedin className="h-5 w-5" /></a>
                <a aria-label="GitHub" href="#"><Github className="h-5 w-5" /></a>
              </div>
              <p className="text-xs text-background/70">
                CryptoMax provides educational materials and tools. Investing involves risk, including loss of principal.
              </p>
            </div>
          </div>
        </div>

        {/* Minimal About/Disclaimer */}
        <div className="py-10">
          <p className="text-sm text-background/80 max-w-3xl">
            CryptoMax is a modern crypto investment brand focused on transparent performance and user-friendly tools. Nothing on this site constitutes financial advice. Always do your own research.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-background/20 rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold">CryptoMax</span>
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