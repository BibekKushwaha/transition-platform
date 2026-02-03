'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import InputTextbox from '@repo/ui/inputtextbox';
import Button from '../../components/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string } = {};       
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      console.log('Forgot password submitted:', { email });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                transition
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
            <p className="text-gray-600">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputTextbox
              label="email"
              labelText="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              errors={errors}
              isLoading={isLoading}
            />
            <Button
              isLoading={isLoading}
              labelText="Send reset link"
              loadingText="Sending..."
            />
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
             Go back to Login page{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}