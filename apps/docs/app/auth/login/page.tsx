'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InputTextbox from '@repo/ui/inputtextbox';
import { useLoginMutation, setCredentials, useAppDispatch } from '@repo/store';
import { loginSchema } from '@repo/schemas/auth';
import Button from '../../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  // Validation handled by Zod schema (loginSchema)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      
      // Store user in Redux (token is in HTTP-only cookie)
      dispatch(setCredentials({
        user: result.user,
      }));
      
      router.push('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      setErrors({
        email: err?.data?.message || 'Login failed. Please check your credentials.',
      });
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
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
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

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              isLoading={isLoading}
              labelText="Sign in"
              loadingText="Signing in..."
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
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
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