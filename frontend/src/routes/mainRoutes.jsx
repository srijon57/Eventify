import { Route } from "react-router-dom";
import Homepage from "../pages/home/homepage";

const mainRoutes = [
  <Route key="home" path="/" element={<Homepage />} />,
];

export default mainRoutes;