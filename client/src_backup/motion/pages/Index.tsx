import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AIAssistantSection from "@/components/AIAssistantSection";
import MobileAppSection from "@/components/MobileAppSection";
import ReturnsSection from "@/components/ReturnsSection";
import TradeOnYourTermsSection from "@/components/TradeOnYourTermsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden pt-16">
      <Navbar />
      <Hero />
      {/* Show Returns first when scrolling */}
      <ReturnsSection />
      <Features />
      <AIAssistantSection />
      <MobileAppSection />
      <TradeOnYourTermsSection />
      <Footer />
    </div>
  );
};

export default Index;
