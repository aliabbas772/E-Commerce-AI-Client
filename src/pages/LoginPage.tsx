import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Mail, Lock, Loader2, ShieldCheck } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { LOGIN_WITH_PASSWORD, LOGIN_WITH_OTP, VERIFY_LOGIN_OTP } from '../features/auth/queries'
import { login } from '../store/slices/authSlice'
import { getRecaptchaToken } from '../lib/loadRecaptcha'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { GOOGLE_AUTH } from '../features/auth/queries'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

type Mode = 'password' | 'otp-form' | 'otp-verify'

export default function LoginPage() {
    const [mode, setMode] = useState<Mode>('password')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [formError, setFormError] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loginWithPassword, { loading: passwordLoading }] = useMutation(LOGIN_WITH_PASSWORD, {
        onCompleted: (data) => {
            dispatch(
                login({
                    user: data.loginWithPassword.user,
                    token: data.loginWithPassword.accessToken,
                })
            )
            navigate('/')
        },
        onError: (error) => {
            setFormError(error.message)
        },
    })

    const [googleAuth] = useMutation(GOOGLE_AUTH, {
        onCompleted: (data) => {
            dispatch(
                login({
                    user: data.googleAuth.user,
                    token: data.googleAuth.accessToken,
                })
            )
            navigate('/')
        },
        onError: (error) => {
            setFormError(error.message)
        },
    })

    const handleGoogleCredential = (credential: string) => {
        setFormError('')
        googleAuth({ variables: { googleToken: credential } })
    }

    const [loginWithOTP, { loading: otpSendLoading }] = useMutation(LOGIN_WITH_OTP, {
        onCompleted: () => {
            setMode('otp-verify')
        },
        onError: (error) => {
            setFormError(error.message)
        },
    })

    const [verifyLoginOTP, { loading: otpVerifyLoading }] = useMutation(VERIFY_LOGIN_OTP, {
        onCompleted: (data) => {
            dispatch(
                login({
                    user: data.verifyLoginOTP.user,
                    token: data.verifyLoginOTP.accessToken,
                })
            )
            navigate('/')
        },
        onError: (error) => {
            setFormError(error.message)
        },
    })

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!email || !password) {
            setFormError('Please fill in both fields.')
            return
        }

        loginWithPassword({ variables: { email, password } })
    }

    const handleSendLoginOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!email) {
            setFormError('Please enter your email.')
            return
        }

        try {
            const captchaToken = await getRecaptchaToken(RECAPTCHA_SITE_KEY, 'login')
            loginWithOTP({ variables: { email, captchaToken } })
        } catch (err) {
            setFormError('Captcha verification failed. Please try again.')
        }
    }

    const handleVerifyLoginOTP = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!otp) {
            setFormError('Please enter the OTP sent to your email.')
            return
        }

        verifyLoginOTP({ variables: { email, otp } })
    }

    const switchMode = (newMode: Mode) => {
        setFormError('')
        setOtp('')
        setMode(newMode)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        {mode === 'otp-verify' ? 'Verify your email' : 'Welcome back'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {mode === 'otp-verify'
                            ? `Enter the code sent to ${email}`
                            : 'Sign in to continue to EcommerceAI'}
                    </p>
                </div>

                {mode === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <Mail size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gray-900"
                            />
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
                        <Link
                            to="/forgot-password"
                            className="-mt-2 text-right text-xs text-gray-500 hover:text-gray-900"
                        >
                            Forgot password?
                        </Link>

                        {formError && <p className="text-sm text-red-600">{formError}</p>}

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                            {passwordLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => switchMode('otp-form')}
                            className="text-center text-xs text-gray-500 hover:text-gray-900"
                        >
                            Sign in with OTP instead
                        </button>
                    </form>
                )}
                {mode === 'password' && (
                    <div className="mt-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                )}

                {mode === 'password' && (
                    <div className="mt-4">
                        <GoogleSignInButton onCredential={handleGoogleCredential} />
                    </div>
                )}

                {mode === 'otp-form' && (
                    <form onSubmit={handleSendLoginOTP} className="flex flex-col gap-4">
                        <div className="relative">
                            <Mail size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gray-900"
                            />
                        </div>

                        {formError && <p className="text-sm text-red-600">{formError}</p>}

                        <button
                            type="submit"
                            disabled={otpSendLoading}
                            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                            {otpSendLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending code...
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </button>

                        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                            <ShieldCheck size={13} strokeWidth={1.5} />
                            Protected by reCAPTCHA
                        </p>

                        <button
                            type="button"
                            onClick={() => switchMode('password')}
                            className="text-center text-xs text-gray-500 hover:text-gray-900"
                        >
                            ← Sign in with password instead
                        </button>
                    </form>
                )}

                {mode === 'otp-verify' && (
                    <form onSubmit={handleVerifyLoginOTP} className="flex flex-col gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-3 px-4 text-center text-lg tracking-[0.5em] outline-none transition-colors focus:border-gray-900"
                                maxLength={6}
                            />
                        </div>

                        {formError && <p className="text-sm text-red-600">{formError}</p>}

                        <button
                            type="submit"
                            disabled={otpVerifyLoading}
                            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                            {otpVerifyLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Sign in'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => switchMode('otp-form')}
                            className="text-center text-xs text-gray-400 hover:text-gray-600"
                        >
                            ← Use a different email
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-gray-900 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}