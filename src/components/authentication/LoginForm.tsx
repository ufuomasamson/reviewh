import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [showError, setShowError] = useState<boolean>(!!error);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setShowError(false);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setShowError(true);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && showError && (
          <Alert 
            variant="error" 
            onClose={() => setShowError(false)}
          >
            {error}
          </Alert>
        )}
        
        <div>
          <Input
            label="Email address"
            type="email"
            id="email"
            autoComplete="email"
            icon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </div>
        
        <div>
          <Input
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
};