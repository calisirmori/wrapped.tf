import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recap from "./pages/Recap";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen text-base-content relative bg-cover bg-center bg-topo-light dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7">
        {/* Navbar */}
        <Navbar />

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
