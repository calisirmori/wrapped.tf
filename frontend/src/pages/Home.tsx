import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="h-screen snap-start flex items-center justify-center bg-base-100">
            <h1 className="text-4xl font-bold">Welcome to the Modern Website</h1>
        </div>
    );
};

export default Home;