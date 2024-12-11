import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

type Theme = 'light' | 'dark' | 'system';

const DarkModeToggle: React.FC = () => {
    const { theme, setTheme } = useDarkMode();

    const toggleTheme = () => {
        let newTheme: Theme;
        if (theme === 'light') newTheme = 'dark';
        else if (theme === 'dark') newTheme = 'system';
        else newTheme = 'light';

        setTheme(newTheme);
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className="p-2 outline-none border-none rounded-full"
            whileTap={{ scale: 0.95 }}
        >
            {theme === 'light' && <Sun size={24} />}
            {theme === 'dark' && <Moon size={24} />}
            {theme === 'system' && <Laptop size={24} />}
        </motion.button>
    );
};

export default DarkModeToggle;
