import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-black text-neutral-100 flex items-center justify-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-6xl font-extrabold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-neutral-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="default">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;