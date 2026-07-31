import { useEffect, useRef } from 'react'
import { initializeGoogleAuth, loadGoogleScript } from '../lib/loadGoogleAuth'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

interface GoogleSignInButtonProps {
    onCredential: (credential: string) => void
}

export default function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let cancelled = false

        initializeGoogleAuth(GOOGLE_CLIENT_ID, (response) => {
            onCredential(response.credential)
        }).then(async () => {
            await loadGoogleScript()
            if (cancelled || !buttonRef.current) return

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