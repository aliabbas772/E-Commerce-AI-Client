import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client/react'
import { Search, X } from 'lucide-react'
import { GET_SEARCH_SUGGESTIONS } from '../features/search/queries'
import { useDebounce } from '../hooks/useDebounce'

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 350)
    const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [fetchSuggestions, { data }] = useLazyQuery<any>(GET_SEARCH_SUGGESTIONS)

    useEffect(() => {
        if (debouncedQuery.trim().length >= 2) {
            fetchSuggestions({ variables: { query: debouncedQuery } })
        }
    }, [debouncedQuery, fetchSuggestions])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const suggestions: string[] = data?.getSearchSuggestions ?? []

    const runSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        setIsOpen(false)
        setQuery('')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        runSearch(query)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => {
                    setIsOpen(true)
                    setTimeout(() => inputRef.current?.focus(), 0)
                }}
                aria-label="Search"
                className="text-gray-500 transition-colors hover:text-gray-900"
            >
                <Search size={19} strokeWidth={1.5} />
            </button>
        )
    }

    return (
        <div ref={containerRef} className="relative">
            <form onSubmit={handleSubmit} className="flex items-center">
                <Search size={16} strokeWidth={1.5} className="absolute left-3 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-56 rounded-full border border-gray-200 py-1.5 pl-9 pr-8 text-sm outline-none focus:border-gray-900"
                />
                <button
                    type="button"
                    onClick={() => {
                        setQuery('')
                        setIsOpen(false)
                    }}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                >
                    <X size={14} strokeWidth={1.5} />
                </button>
            </form>

            {suggestions.length > 0 && query.trim().length >= 2 && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => runSearch(suggestion)}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}