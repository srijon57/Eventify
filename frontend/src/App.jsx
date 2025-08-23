// src/App.jsx

import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import mainRoutes from "./routes/mainRoutes";
import { Routes } from "react-router-dom";
import DarkModeToggle from "./context/DarkModeToggle/DarkModeToggle";

function App() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Routes>{mainRoutes}</Routes>
      <Footer />
      <div className="fixed bottom-4 left-4">
        <DarkModeToggle />
      </div>
    </div>
  );
}

export default App;