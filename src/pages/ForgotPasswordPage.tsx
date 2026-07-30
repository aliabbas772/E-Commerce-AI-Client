import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Mail, Lock, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import {
    SEND_FORGOT_PASSWORD_OTP,
    VERIFY_FORGOT_PASSWORD_OTP,
    UPDATE_PASSWORD,
} from '../features/auth/queries'
import { getRecaptchaToken } from '../lib/loadRecaptcha'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

type Step = 'email' | 'reset' | 'done'

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email')

    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState('')

    const navigate = useNavigate()

    const [sendOTP, { loading: sendLoading }] = useMutation(SEND_FORGOT_PASSWORD_OTP, {
        onCompleted: () => setStep('reset'),
        onError: (error) => setFormError(error.message),
    })

    const [verifyOTP, { loading: verifyLoading }] = useMutation(VERIFY_FORGOT_PASSWORD_OTP)
    const [updatePassword, { loading: updateLoading }] = useMutation(UPDATE_PASSWORD, {
        onCompleted: () => setStep('done'),
        onError: (error) => setFormError(error.message),
    })

    const isResetting = verifyLoading || updateLoading

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!email) {
            setFormError('Please enter your email.')
            return
        }

        try {
            const captchaToken = await getRecaptchaToken(RECAPTCHA_SITE_KEY, 'forgot_password')
            sendOTP({ variables: { email, captchaToken } })
        } catch (err) {
            setFormError('Captcha verification failed. Please try again.')
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!otp) {
            setFormError('Please enter the OTP sent to your email.')
            return
        }
        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.')
            return
        }
        if (password !== confirmPassword) {
            setFormError('Passwords do not match.')
            return
        }

        try {
            await verifyOTP({ variables: { email, otp } })
            await updatePassword({ variables: { email, password, confirmPassword } })
        } catch (error: any) {
            setFormError(error.message)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        {step === 'email' && 'Reset your password'}
                        {step === 'reset' && 'Set a new password'}
                        {step === 'done' && 'Password updated'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {step === 'email' && "We'll send a code to your email"}
                        {step === 'reset' && `Enter the code sent to ${email}`}
                        {step === 'done' && 'You can now sign in with your new password'}
                    </p>
                </div>

                {step === 'email' && (
                    <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
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
                            disabled={sendLoading}
                            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                            {sendLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending code...
                                </>
                            ) : (
                                'Send Reset Code'
                            )}
                        </button>

                        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                            <ShieldCheck size={13} strokeWidth={1.5} />
                            Protected by reCAPTCHA
                        </p>
                    </form>
                )}

                {step === 'reset' && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 py-3 px-4 text-center text-lg tracking-[0.5em] outline-none transition-colors focus:border-gray-900"
                            maxLength={6}
                        />

                        <div className="relative">
                            <Lock size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gray-900"
                            />
                        </div>

                        <div className="relative">
                            <Lock size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gray-900"
                            />
                        </div>

                        {formError && <p className="text-sm text-red-600">{formError}</p>}

                        <button
                            type="submit"
                            disabled={isResetting}
                            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isResetting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}

                {step === 'done' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 size={40} strokeWidth={1.5} className="text-emerald-600" />
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                            Go to Sign In
                        </button>
                    </div>
                )}

                {step !== 'done' && (
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-gray-900 hover:underline">
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}