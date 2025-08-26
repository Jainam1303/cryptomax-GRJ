import React from 'react';
import ForgotPassword from '../components/auth/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-neutral-100">
      <div className="w-full max-w-md">
        <ForgotPassword />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;