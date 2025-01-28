import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recap from "./pages/Recap";
import RecapPreview from "./pages/RecapPreview";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen text-base-content relative bg-cover bg-center bg-lightscale-3 dark:bg-warmscale-7">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recap/:id64" element={<Recap />} />
          <Route path="/recap/preview" element={<RecapPreview />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
