import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Tag } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { setReferralCode } from '../lib/referral';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      // Persist referral code if user entered one; AuthContext will pick it up
      const code = formData.referralCode?.trim();
      if (code) setReferralCode(code);
      await register(formData.fullName, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img src="/logos/CMlogo.svg" alt="CryptoMax" className="w-12 h-12 rounded-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
              CryptoMax
            </span>
          </Link>
        </div>

        <Card className="shadow-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm text-neutral-100 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:shadow-[0_0_40px_rgba(132,204,22,0.18)] transition-shadow">
          <div className="space-y-1 text-center px-6 pt-6">
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="text-gray-400">Start your crypto investment journey today</p>
          </div>
          <div className="space-y-4 px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-neutral-200">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode" className="text-neutral-200">Referral Code (optional)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder="Enter referral code if you have one"
                    className="pl-10"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-neutral-200">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                <label className="text-sm text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_20px_rgba(34,197,94,0.6)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            {/* Remove Google registration button and divider */}
            <div className="text-center text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
