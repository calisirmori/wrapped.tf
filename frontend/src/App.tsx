import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recap from "./pages/Recap";
import ThemeToggle from "./components/ThemeToggle";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen text-base-content relative">
        {/* Navbar */}
        <div className="navbar absolute text-warmscale-5 dark:text-lightscale-3 top-0 left-0 w-full bg-opacity-50 px-5 z-50 ">
          <div className="flex-1">
            <a href="/" className="font-semibold text-xl max-md:text-base hover:text-white dark:hover:text-tf-orange hover:cursor-pointer">wrapped.tf</a>
          </div>
          <div className="flex-none mr-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recap/:id64" element={<Recap />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
