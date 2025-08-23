import { Route } from "react-router-dom";
import Homepage from "../pages/home/homepage";
import LoginPage from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile.jsx";
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard.jsx";
import PrivacyPolicy from "../pages/Privaacy/Privaacy.jsx";
import AboutUs from "../components/About/AboutUs";
import Contact from "../components/Contact/Contact.jsx";




const mainRoutes = [
  <Route key="home" path="/" element={<Homepage />} />,
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="about" path="/about" element={<AboutUs />} />,
  <Route key="privacy" path="/privacy" element={<PrivacyPolicy />} />,
  <Route key="contact" path="/contact" element={<Contact />} />,
  <Route key="profile" path="/profile" element={<Profile />} />,
  <Route key="studentdashboard" path="/studentdashboard" element={<StudentDashboard/>} />,


];

export default mainRoutes;