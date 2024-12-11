import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import AddDocumentForm from '../components/AddDocumentForm';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { api } from '../api';

const AddDocumentPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'warning'>('success');

    useEffect(() => {
        // Simulate a delay to show the loader
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const showToastMessage = (message: string, type: 'success' | 'warning') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const closeToast = () => {
        setShowToast(false);
    };

    const handleAddDocument = async (title: string, content: string) => {
        try {
            await api.addDocument({ title, text: content });
            showToastMessage('Document added successfully!', 'success');
        } catch (error) {
            console.error('Error adding document:', error);
            showToastMessage('Error adding document. Please try again.', 'warning');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            <Header />
            {isLoading ? (
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <Loader />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 lg:px-8 "
                >
                    <AddDocumentForm addDocument={handleAddDocument} />
                </motion.div>
            )}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={closeToast}
                />
            )}
        </div>
    );
};

export default AddDocumentPage;
