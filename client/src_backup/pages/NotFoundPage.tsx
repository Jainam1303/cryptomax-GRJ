import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-description">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;