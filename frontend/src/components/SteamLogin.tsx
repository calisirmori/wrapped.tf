import React from "react";

const SteamLogin: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/steam`;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
    >
      <img
        src="https://community.cloudflare.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
        alt="Sign in through Steam"
        className="h-8"
      />
      <span className="ml-2">Login with Steam</span>
    </button>
  );
};

export default SteamLogin;
