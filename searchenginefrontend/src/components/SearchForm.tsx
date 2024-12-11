import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { api } from '../api';

const SearchForm: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<{ id: number; title: string; snippet: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim()) {
                try {
                    const results = await api.searchDocuments(query, 5);
                    setSuggestions(results.map(doc => ({
                        id: doc.id,
                        title: doc.title,
                        snippet: doc.text.slice(0, 100) + '...'
                    })));
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
            }
        };

        const debounce = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(debounce);
    }, [query]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/results?q=${encodeURIComponent(query)}`);
        }
    };

    const highlightMatch = (text: string, query: string) => {
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
        );
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <motion.div
                    className="flex items-center"
                    initial={false}
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder="Search..."
                        className="caret-neutral-500 dark:caret-white w-full bg-transparent border border-neutral-700 dark:border-neutral-400 hover:border-rose-300 dark:hover:border-rose-500 focus:border-rose-300 dark:focus:border-rose-500 rounded-full px-4 py-2 pl-10 pr-4 outline-none duration-300"
                    />
                    <motion.button
                        type="submit"
                        className="absolute outline-none border-none left-0 top-0 bottom-0 px-3 flex items-center justify-center"
                        whileTap={{ scale: 0.95 }}
                    >
                        <Search size={20} className="text-neutral-500 dark:text-neutral-300" />
                    </motion.button>
                </motion.div>
                <AnimatePresence>
                    {isFocused && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
                        >
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="p-3 hover:bg-neutral-100 dark:hover:bg-black cursor-pointer"
                                    onClick={() => navigate(`/document/${suggestion.id}`)}
                                >
                                    <h4 className="font-semibold text-sm mb-1">{highlightMatch(suggestion.title, query)}</h4>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        {highlightMatch(suggestion.snippet, query)}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}

export default SearchForm;
