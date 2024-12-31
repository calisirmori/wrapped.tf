import React, { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface User {
  id: string;
  steamId: string;
  displayName: string;
  avatar: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  console.log(import.meta.env.VITE_API_URL + "/auth/steam");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Use VITE_API_URL + /auth/user
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
          credentials: "include", // include cookies
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/logout`;
  };

  return (
    <div className="navbar absolute text-warmscale-5 dark:text-lightscale-3 top-0 left-0 w-full bg-opacity-50 px-5 z-50 flex items-center">
      <div className="flex-1">
        <a
          href="/"
          className="font-semibold text-xl max-md:text-base hover:text-white dark:hover:text-tf-orange hover:cursor-pointer"
        >
          wrapped.tf
        </a>
      </div>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Section */}
        {user ? (
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={`${user.displayName}'s avatar`}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-sm">{user.displayName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <a
            // Use VITE_API_URL + /auth/steam
            href={`${import.meta.env.VITE_API_URL}/auth/steam`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Login with Steam
          </a>
        )}
      </div>
    </div>
  );
};

export default Navbar;