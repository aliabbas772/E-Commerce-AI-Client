import { useState, useRef, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { useSelector } from 'react-redux'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import type { RootState } from '../store/store'
import { ASK_SUPPORT_CHAT } from '../features/ai/queries'

interface ChatMessage {
    role: 'user' | 'assistant'
    text: string
}

export default function SupportChatWidget() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)

    const [askSupportChat, { loading }] = useLazyQuery(ASK_SUPPORT_CHAT, {
        onCompleted: (data) => {
            setMessages((prev) => [...prev, { role: 'assistant', text: data.askSupportChat.reply }])
        },
        onError: (err) => {
            const friendly = err.message.includes('RATE_LIMITED') || err.message.includes('Too many')
                ? "You've reached the limit for support messages right now — try again shortly."
                : "Sorry, something went wrong. Please try again."
            setMessages((prev) => [...prev, { role: 'assistant', text: friendly }])
        },
    })

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (!isAuthenticated) return null

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const query = input.trim()
        setMessages((prev) => [...prev, { role: 'user', text: query }])
        setInput('')
        askSupportChat({ variables: { query } })
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="flex h-96 w-80 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">Support Chat</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={18} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-3">
                        {messages.length === 0 && (
                            <p className="text-center text-xs text-gray-400">
                                Ask about your orders, shipping, or returns.
                            </p>
                        )}
                        <div className="flex flex-col gap-3">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === 'user'
                                        ? 'ml-auto bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {m.text}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Loader2 size={12} className="animate-spin" />
                                    Thinking...
                                </div>
                            )}
                        </div>
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 p-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="rounded-lg bg-gray-900 p-2 text-white disabled:opacity-40"
                        >
                            <Send size={15} strokeWidth={1.5} />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800"
                >
                    <MessageCircle size={20} strokeWidth={1.5} />
                </button>
            )}
        </div>
    )
}