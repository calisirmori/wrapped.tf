import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TextParser: React.FC = () => {
    const [players, setPlayers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch data from the backend API
        axios
            .get('/api/parse-text') // Adjust the URL if needed
            .then((response) => {
                console.log('API Response:', response.data); // Debug API response
                setPlayers(response.data.players); // Set players from the response
            })
            .catch((error) => {
                console.error('Error fetching player data:', error);
                setError('Failed to load players. Please try again later.');
            });
    }, []);

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Unique Players</h1>
            {error && <p className="text-red-500">{error}</p>}
            {!error && players.length === 0 && (
                <p className="text-gray-500">Loading...</p>
            )}
            <ul className="list-disc ml-5">
                {players.map((player, index) => (
                    <li key={index} className="mb-2 text-lg text-gray-700">
                        {player}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TextParser;
