import { Route } from "react-router-dom";
import Homepage from "../pages/home/homepage";
import LoginPage from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AboutUs from "../components/About/AboutUs";
import PrivacyPolicy from "../pages/Privaacy/Privaacy.jsx";
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard.jsx";
import Contact from "../components/Contact/Contact.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import VerifyOTP from "../pages/Register/Verifyotp.jsx";

const mainRoutes = [
  <Route key="home" path="/" element={<Homepage />} />,
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="about" path="/about" element={<AboutUs />} />,
  <Route key="privacy" path="/privacy" element={<PrivacyPolicy />} />,
  <Route key="contact" path="/contact" element={<Contact />} />,
  <Route key="profile" path="/profile" element={<Profile />} />,
  <Route key="verify-otp" path="/verify-otp" element={<VerifyOTP />} />,
  <Route key="studentdashboard" path="/studentdashboard" element={<StudentDashboard />} />,
];

export default mainRoutes;