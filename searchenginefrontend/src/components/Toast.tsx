import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string;
    type: 'success' | 'warning';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-yellow-500';
    const Icon = type === 'success' ? CheckCircle : AlertTriangle;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.4 } }}
                className={`fixed z-50 top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between`}
            >
                <div className="flex items-center">
                    <Icon size={24} className="mr-3" />
                    <p>{message}</p>
                </div>
                <button onClick={onClose} className="outline-none ml-4 focus:outline-none">
                    <X size={20} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;

