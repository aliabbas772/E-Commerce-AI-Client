import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { User as UserIcon, Mail, Lock, Phone, Loader2, ShieldCheck } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { SEND_REGISTER_OTP, VERIFY_REGISTER_OTP } from '../features/auth/queries'
import { login } from '../store/slices/authSlice'
import { getRecaptchaToken } from '../lib/loadRecaptcha'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function RegisterPage() {
    const [step, setStep] = useState<'form' | 'otp'>('form')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [formError, setFormError] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [sendRegisterOTP, { loading: sendLoading }] = useMutation(SEND_REGISTER_OTP, {
        onCompleted: () => {
            setStep('otp')
        },
        onError: (error) => {
            setFormError(error.message)
        },
    })

    const [verifyRegisterOTP, { loading: verifyLoading }] = useMutation(VERIFY_REGISTER_OTP, {
        onCompleted: (data) => {
            dispatch(
                login({
                    user: data.verifyRegisterOTP.user,
                    token: data.verifyRegisterOTP.accessToken,
                })
            )
            navigate('/')
        },
        onError: (error) => {
            setFormError(error.message)
        },
    })

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!name || !email || !password) {
            setFormError('Please fill in all required fields.')
            return
        }

        console.log(name, email, password)

        try {
            const captchaToken = await getRecaptchaToken(RECAPTCHA_SITE_KEY, 'register')
            sendRegisterOTP({
                variables: { name, email, password, phone: phone || undefined, captchaToken },
            })
        } catch (err) {
            setFormError('Captcha verification failed. Please try again.')
        }
    }

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!otp) {
            setFormError('Please enter the OTP sent to your email.')
            return
        }

        verifyRegisterOTP({ variables: { email, otp } })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        {step === 'form' ? 'Create an account' : 'Verify your email'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {step === 'form'
                            ? 'Join EcommerceAI to start shopping'
                            : `Enter the code sent to ${email}`}
                    </p>
                </div>

                {step === 'form' ? (
                    <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                        <div className="relative">
                            <UserIcon size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gray-900"
                            />
                        </div>

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
                            <Phone size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="Phone (optional)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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
                                'Continue'
                            )}
                        </button>

                        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                            <ShieldCheck size={13} strokeWidth={1.5} />
                            Protected by reCAPTCHA
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
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
                            disabled={verifyLoading}
                            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                            {verifyLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Create Account'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('form')}
                            className="text-center text-xs text-gray-400 hover:text-gray-600"
                        >
                            ← Go back and edit details
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-gray-900 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}