import { useEffect, useRef } from 'react'
import { loadGoogleScript } from '../lib/loadGoogleAuth'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

interface GoogleSignInButtonProps {
    onCredential: (credential: string) => void
}

export default function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let cancelled = false

        loadGoogleScript().then(() => {
            if (cancelled || !buttonRef.current) return

            // @ts-ignore - google is injected globally by Google's script
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response: { credential: string }) => {
                    onCredential(response.credential)
                },
            })

            // @ts-ignore
            window.google.accounts.id.renderButton(buttonRef.current, {
                theme: 'outline',
                size: 'large',
                width: 320,
                text: 'continue_with',
            })
        })

        return () => {
            cancelled = true
        }
    }, [onCredential])

    return <div ref={buttonRef} className="flex justify-center" />
}