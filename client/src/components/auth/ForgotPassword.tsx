import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { isValidEmail } from '../../utils/validators';
import { Card } from '../ui/card';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/Alert';

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
          <h1 className="text-3xl font-bold text-neutral-100">Check your email</h1>
          <p className="mt-2 text-gray-400">
            We've sent a password reset link to {email}
          </p>
        </div>

        <Card className="p-6 border border-neutral-800 bg-neutral-900/80 text-neutral-100 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:shadow-[0_0_40px_rgba(132,204,22,0.18)] transition-shadow">
          <div className="text-center">
            <p className="mb-4 text-gray-300">
              If you don't see the email, please check your spam folder or request another reset link.
            </p>

            <Button onClick={() => setIsSubmitted(false)} className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_20px_rgba(34,197,94,0.6)]">
              Request another link
            </Button>

            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
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
        <h1 className="text-3xl font-bold text-neutral-100">Reset your password</h1>
        <p className="mt-2 text-gray-400">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <Card className="p-6 border border-neutral-800 bg-neutral-900/80 text-neutral-100 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:shadow-[0_0_40px_rgba(132,204,22,0.18)] transition-shadow">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-200">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_20px_rgba(34,197,94,0.6)]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
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