import { useState } from "react";
import { Routes } from "react-router-dom";
import { MessageCircle } from "lucide-react";

import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import mainRoutes from "./routes/mainRoutes";
import DarkModeToggle from "./context/DarkModeToggle/DarkModeToggle";
import Chatbot from "./components/chatbot/Chatbot";

function App() {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <div className="relative min-h-screen">
            <Navbar />
            <Routes>{mainRoutes}</Routes>
            <Footer />

            <div className="fixed  bottom-4 left-4">
                <DarkModeToggle />
            </div>

            <div className="fixed bottom-2 right-2 flex flex-col items-end space-y-2">
                {chatOpen && (
                    <div className="w-100 h-130 bg-white border-2 rounded-2xl shadow-xl overflow-hidden border-black dark:border-red-500 dark:bg-black">
                        <Chatbot />
                    </div>
                )}
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className="p-3 bottom-2 right-2 rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-400"
                >
                    <MessageCircle size={24} />
                </button>
            </div>
        </div>
    );
}

export default App;
