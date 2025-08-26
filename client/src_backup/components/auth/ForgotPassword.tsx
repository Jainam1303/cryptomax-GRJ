import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { isValidEmail } from '../../utils/validators';
import Card from '../ui/Card';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API to send a password reset email
      // For demo purposes, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Check your email</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We've sent a password reset link to {email}
          </p>
        </div>
        
        <Card>
          <div className="text-center">
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              If you don't see the email, please check your spam folder or request another reset link.
            </p>
            
            <Button
              variant="primary"
              onClick={() => setIsSubmitted(false)}
            >
              Request another link
            </Button>
            
            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset your password</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>
      
      <Card>
        {error && (
          <Alert
            variant="danger"
            message={error}
            className="mb-4"
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={error}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Send reset link
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;