import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import SearchForm from '../components/SearchForm';
import {Link} from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggler";
import {Edit, FilePlus2} from 'lucide-react';

const AnimatedCircle: React.FC<{
    className: string;
    duration: number;
    initialPosition: { x: string; y: string };
}> = ({ className, duration, initialPosition }) => {
    return (
        <motion.div
            className={`rounded-full blur-[100px] opacity-50 absolute ${className}`}
            animate={{
                rotate: 360,
                x: [
                    `calc(${initialPosition.x} + 50px)`,
                    `calc(${initialPosition.x} - 50px)`,
                    `calc(${initialPosition.x} + 50px)`
                ],
                y: [
                    `calc(${initialPosition.y} + 50px)`,
                    `calc(${initialPosition.y} - 50px)`,
                    `calc(${initialPosition.y} + 50px)`
                ]
            }}
            transition={{
                rotate: {
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear"
                },
                x: {
                    duration: duration * 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                },
                y: {
                    duration: duration * 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }
            }}
        />
    );
};

const HomePage: React.FC = () => {
    return (
        <div
            className="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-gray-950 text-black dark:text-white">


            <motion.header
                className="bg-transparent backdrop-blur-lg fixed top-0 left-0 right-0 z-50"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-2">
                        <Link to="/"
                              className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200">
                            <span className="text-rose-500">C</span>hapronRouge<span className="text-rose-500">.</span>
                        </Link>

                        <div className="flex items-center space-x-4">

                            <Link to="/add"
                                  className="flex flex-row items-center font-bold gap-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200 px-3 py-2 rounded-md text-sm md:text-base ">
                                <FilePlus2 size={20} />
                                Add
                            </Link>
                            <DarkModeToggle/>
                        </div>
                    </div>
                </nav>
            </motion.header>


            <div className="flex-grow flex flex-col items-center justify-center py-8 px-4 relative">
                <motion.div
                    className="absolute inset-0 z-0"
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <AnimatedCircle
                        className="w-[300px] h-[300px] bg-red-300 dark:bg-red-700 top-1/4 right-1/4"
                        duration={30}
                        initialPosition={{x: "25%", y: "25%"}}
                    />
                    <AnimatedCircle
                        className="w-[250px] h-[250px] bg-blue-300 dark:bg-blue-700 bottom-1/4 left-1/4"
                        duration={35}
                        initialPosition={{x: "-25%", y: "-25%"}}
                    />
                    <AnimatedCircle
                        className="w-[200px] h-[200px] bg-cyan-300 dark:bg-cyan-700 top-1/3 left-1/3"
                        duration={40}
                        initialPosition={{x: "33%", y: "33%"}}
                    />
                    <AnimatedCircle
                        className="w-[350px] h-[350px] bg-purple-300 dark:bg-purple-700 bottom-1/3 right-1/3"
                        duration={45}
                        initialPosition={{x: "-33%", y: "-33%"}}
                    />
                </motion.div>
                <div className="w-full z-10 flex justify-center items-center flex-col rounded-lg p-8">
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        <span className="text-rose-500">C</span>hapronRouge<span className="text-rose-500">.</span>
                    </motion.h1>
                    <motion.div
                        className="w-full max-w-3xl border-none outline-none"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                    >
                        <SearchForm/>
                    </motion.div>
                    <motion.p
                        className="mt-8 text-center text-lg opacity-75"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5, delay: 0.4}}
                    >
                        Discover knowledge with our powerful search engine
                    </motion.p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;