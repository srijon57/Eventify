import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import mainRoutes from "./routes/mainRoutes"; 
import "./App.css";
import { Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>{mainRoutes}</Routes>
      <Footer />
    </>
  );
}

export default App;