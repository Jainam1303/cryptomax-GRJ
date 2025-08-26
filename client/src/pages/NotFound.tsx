import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-neutral-100 p-6">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-extrabold">404</h1>
        <p className="text-lg text-neutral-400">Oops! Page not found</p>
        <a href="/" className="text-emerald-400 hover:text-emerald-300 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
