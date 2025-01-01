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

  useEffect(() => {
    const fetchUser = async () => {
      const rawCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userid="))
        ?.split("=")[1];

      if (rawCookie) {
        // Decode the URL-encoded string
        const decodedCookie = decodeURIComponent(rawCookie);

        // Parse the JSON
        const user = JSON.parse(decodedCookie.substring(2)); // Remove the 'j:' prefix

        setUser(user); // Set user in state
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
        <div className="dropdown dropdown-end">
          {user ? (
            <>
              {/* Trigger Button */}
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.avatar} alt={`${user.displayName}'s avatar`} />
                </div>
              </label>

              {/* Dropdown Menu */}
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-lightscale-3 dark:bg-warmscale-6 rounded-box w-52"
              >
                <li>
                  <a
                    href={`https://wrapped.tf/recap/${user.id}`}
                    className="flex items-center space-x-2"
                  >
                    <span>🎉</span>
                    <span>View Recap</span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <a
              // Use VITE_API_URL + /auth/steam
              href={`${import.meta.env.VITE_API_URL}/auth/steam`}
              className="btn btn-primary"
            >
              Login with Steam
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
