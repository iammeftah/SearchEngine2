import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import SearchForm from '../components/SearchForm';
import Loader from '../components/Loader';
import {api} from "../api";

interface Document {
    id: number;
    title: string;
    text: string;
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const documents = await api.searchDocuments(query);
                setResults(documents);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setResults([]);
            }
            setIsLoading(false);
        };
        fetchResults();
    }, [query]);

    const highlightMatch = (text: string, query: string) => {
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
        );
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-neutral-950 text-black dark:text-white">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-start py-24 px-4 relative">
                <div className="w-full max-w-7xl z-10 bg-white dark:bg-neutral-950 rounded-lg mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 max-w-md">
                        <SearchForm />
                    </div>
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center items-center h-[calc(100vh-300px)]"
                        >
                            <Loader />
                        </motion.div>
                    ) : results.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold mb-4">No results found for "{query}"</h2>
                            <p className="text-lg opacity-75">Try adjusting your search terms or browse our documents.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ staggerChildren: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Search Results for "{query}"</h2>
                            <ul className="space-y-6">
                                {results.map((doc) => (
                                    <motion.li
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6 transition-transform duration-200 hover:scale-105"
                                    >
                                        <Link to={`/document/${doc.id}`} className="block">
                                            <h3 className="text-xl font-semibold mb-2 text-primary hover:underline">
                                                {highlightMatch(doc.title, query)}
                                            </h3>
                                            <p className="opacity-75">
                                                {highlightMatch(doc.text.slice(0, 150) + '...', query)}
                                            </p>
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResultsPage;

