"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InputTextbox from '@repo/ui/inputtextbox';
import { registerSchema } from '@repo/schemas/auth';
import { useRegisterMutation, setCredentials, useAppDispatch } from '@repo/store';
import Button from '../../components/Button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  
  const [register] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useAppDispatch(); 

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name) {
      newErrors.name = 'Full Name is required';
    }else if (name.length < 2) {
      newErrors.name = 'Full Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    // Validate with shared Zod schema (client-side UX validation)
    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await register(parsed.data).unwrap();
      if (res && res.user) {
        dispatch(setCredentials({ user: res.user }));
      }
      router.push('/');
    } catch (err: any) {
      console.error('Signup failed:', err);
      setErrors({ email: err?.data?.message || 'Signup failed. Please try again.' });
    }finally {
      setIsLoading(false);
    }
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
            <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
            <p className="text-gray-600">Sign up to get started with your new account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputTextbox
              label="name"
              labelText="Full Name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              errors={errors}
              isLoading={isLoading}
            />
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

            <InputTextbox
              label="password"
              labelText="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              errors={errors}
              isLoading={isLoading}
            />

            <Button
              isLoading={isLoading}
              labelText="Sign up"
              loadingText="Signing up..."
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
            All ready have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Sign in 
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-gray-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}   