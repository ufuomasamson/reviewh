import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Briefcase } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Select } from '../ui/Select';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'business' | 'reviewer';
}

export const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [showError, setShowError] = useState<boolean>(!!error);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setShowError(false);
    try {
      await registerUser(
        {
          name: data.name,
          email: data.email,
          role: data.role,
          isVerified: false,
        },
        data.password
      );
      
      setRegistrationSuccess(true);
      // Redirect immediately to dashboard
      navigate('/dashboard');
    } catch (err) {
      setShowError(true);
    }
  };
  
  if (registrationSuccess) {
    return (
      <div className="text-center">
        <Alert variant="success">
          Registration successful! Redirecting to dashboard...
        </Alert>
      </div>
    );
  }
  
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
            label="Full name"
            type="text"
            id="name"
            autoComplete="name"
            icon={<User className="h-5 w-5" />}
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
        </div>
        
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
          <Select
            label="I am a..."
            id="role"
            options={[
              { value: 'business', label: 'Business Owner' },
              { value: 'reviewer', label: 'Reviewer' },
            ]}
            error={errors.role?.message}
            {...register('role', {
              required: 'Please select your role',
            })}
            onChange={(value) => {
              const event = { target: { value } };
              register('role').onChange(event);
            }}
          />
        </div>
        
        <div>
          <Input
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
        </div>
        
        <div>
          <Input
            label="Confirm password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            icon={<Lock className="h-5 w-5" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => 
                value === password || 'The passwords do not match',
            })}
          />
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Create account
          </Button>
        </div>
        
        <p className="mt-2 text-center text-sm text-gray-600">
          By signing up, you agree to our{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
};