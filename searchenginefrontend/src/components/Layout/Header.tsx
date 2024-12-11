import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DarkModeToggle from '../DarkModeToggler';
import {FilePlus2} from "lucide-react";

const Header: React.FC = () => {
    return (
        <motion.header
            className="bg-white dark:bg-neutral-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-2">
                    <Link to="/" className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200">
                        <span className="text-rose-500">C</span>hapronRouge<span className="text-rose-500">.</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link to="/add"
                              className="flex flex-row items-center font-bold gap-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200 px-3 py-2 rounded-md text-sm md:text-base ">
                            <FilePlus2 size={20} />
                            Add
                        </Link>
                        <DarkModeToggle />
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}

export default Header;