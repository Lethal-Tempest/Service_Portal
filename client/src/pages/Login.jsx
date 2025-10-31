import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, User, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'customer';
  const [selectedRole, setSelectedRole] = useState(roleFromUrl);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Keep selectedRole synchronized with the URL query
  useEffect(() => {
    if (selectedRole !== roleFromUrl) {
      setSelectedRole(roleFromUrl);
    }
  }, [roleFromUrl, selectedRole]); // React to query changes so UI updates immediately [web:117]

  const switchRole = (role) => {
    // Update both local state and URL search params
    setSelectedRole(role);
    const next = new URLSearchParams(searchParams);
    next.set('role', role);
    setSearchParams(next, { replace: true }); // avoid history spam on toggles [web:116]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password, selectedRole);
      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Login failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
            <span className="text-2xl font-bold gradient-text">WorkerConnect</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="p-6 card-gradient shadow-xl">
          {/* Compact Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => switchRole('customer')}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  selectedRole === 'customer'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                aria-pressed={selectedRole === 'customer'}
              >
                <User className="w-6 h-6" />
                <span className="text-sm font-medium">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('worker')}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  selectedRole === 'worker'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                aria-pressed={selectedRole === 'worker'}
              >
                <Briefcase className="w-6 h-6" />
                <span className="text-sm font-medium">Worker</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Username/Email
              </label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username or email"
                required
                className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white border border-black-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to={`/register?role=${selectedRole}`}
                className="text-primary font-medium hover:text-primary-dark"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
