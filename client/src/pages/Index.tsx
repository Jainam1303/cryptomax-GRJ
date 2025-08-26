import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AIAssistantSection from "@/components/AIAssistantSection";
import MobileAppSection from "@/components/MobileAppSection";
import ReturnsSection from "@/components/ReturnsSection";
import TradeOnYourTermsSection from "@/components/TradeOnYourTermsSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // wait a tick to ensure sections are mounted
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  }, [location.hash]);

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-hidden pt-16">
      <Navbar />
      <Hero />
      {/* Show Returns first when scrolling */}
      <div id="returns" className="scroll-mt-24">
        <ReturnsSection />
      </div>
      <div id="features" className="scroll-mt-24">
        <Features />
      </div>
      <AIAssistantSection />
      <MobileAppSection />
      <TradeOnYourTermsSection />
      <Footer />
    </div>
  );
};

export default Index;
