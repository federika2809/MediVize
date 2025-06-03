import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ClassificationPage from './pages/ClassificationPage'; // Pastikan ini mengarah ke file yang sudah di-rename
import DrugDetailPage from './pages/DrugDetailPage';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import DisclaimerModal from './components/modal/DisclaimerModal';

function App() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
        if (!hasSeenDisclaimer) {
            setShowDisclaimer(true);
        }
    }, []);

    const handleCloseDisclaimer = () => {
        localStorage.setItem('hasSeenDisclaimer', 'true');
        setShowDisclaimer(false);
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container py-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/classify" element={<ClassificationPage />} />
                        <Route path="/drug/:id" element={<DrugDetailPage />} />
                        <Route path="/guide" element={<GuidePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
            {showDisclaimer && <DisclaimerModal onClose={handleCloseDisclaimer} />}
        </Router>
    );
}

export default App;