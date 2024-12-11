import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import DocumentPage from './pages/DocumentPage';
import AddDocumentPage from './pages/AddDocumentPage';
import { DarkModeProvider } from './contexts/DarkModeContext';

const App: React.FC = () => {
    return (
        <DarkModeProvider>
            <Router>
                <div className="flex  flex-col min-h-screen relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="absolute top-0 left-0 w-64 h-64  opacity-10 rounded-full filter blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-10 rounded-full filter blur-3xl"></div>
                    </motion.div>
                    <main className="flex-grow relative z-10">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/results" element={<ResultsPage />} />
                            <Route path="/document/:id" element={<DocumentPage />} />
                            <Route path="/add" element={<AddDocumentPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </DarkModeProvider>
    );
}

export default App;

