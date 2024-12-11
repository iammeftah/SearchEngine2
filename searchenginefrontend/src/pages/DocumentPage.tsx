import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';
import Header from '../components/Layout/Header';
import { ChevronsLeft } from 'lucide-react';
import Loader from '../components/Loader';

interface Document {
    id: number;
    title: string;
    text: string;
}

const DocumentPage: React.FC = () => {
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchDocument = async () => {
            if (id) {
                setIsLoading(true);
                try {
                    const doc = await api.getDocument(parseInt(id));
                    if (doc) {
                        setDocument(doc);
                    } else {
                        console.error('Document not found');
                        // Optionally set an error state here
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
                setIsLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-black dark:text-white">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-start py-24 px-4">
                <motion.div
                    className="w-full max-w-7xl z-10 bg-white/80 dark:bg-neutral-900/80 rounded-lg p-8 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
                            <Loader />
                        </div>
                    ) : document ? (
                        <>
                            <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
                            <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: document.text }}
                            />
                        </>
                    ) : (
                        <p className="text-center text-xl">Document not found</p>
                    )}
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            to="/"
                            className="flex flex-row gap-2 text-primary hover:text-primary-dark transition-colors duration-200"
                        >
                            <ChevronsLeft className="text-sm" /> Back to search
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default DocumentPage;

