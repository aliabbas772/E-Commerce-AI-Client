import { Loader2, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react'

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, SetIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('All Fields are required.');
            return;
        }

        SetIsLoading(true);

        setTimeout(() => {
            console.log(email, password);
            SetIsLoading(false);
        }, 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-gray-500">Sign in to continue to EcommerceAI</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className='relative'>
                        <Mail size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email"
                            placeholder='Email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gray-900' />
                    </div>

                    <div className="relative">
                        <Lock size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gray-900"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a href="#" className="font-medium text-gray-900 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
