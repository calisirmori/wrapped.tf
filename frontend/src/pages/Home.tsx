import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Home Page</h1>
            <Link
                to="/text-parser"
                className="text-lg text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
                Go to Text Parser
            </Link>
        </div>
    );
};

export default Home;