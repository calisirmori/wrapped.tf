import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TextParser from './pages/TextParser';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Home route */}
                <Route path="/" element={<Home />} />

                {/* New route for TextParser */}
                <Route path="/text-parser" element={<TextParser />} />
            </Routes>
        </Router>
    );
};

export default App;
