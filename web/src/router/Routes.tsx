import { Routes, Route } from "react-router-dom";
import InstructionOne from "../pages/introductions/InstructionsOne";
import InstructionTwo from "../pages/introductions/InstructionsTwo";
import InstructionThree from "../pages/introductions/InstructionsThree";
import InstructionFour from "../pages/introductions/InstructionsFour";
import LoginOrGuest from "../pages/login/LoginOrGuest";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InstructionOne />} />
      <Route path="/2" element={<InstructionTwo />} />
      <Route path="/3" element={<InstructionThree />} />
      <Route path="/4" element={<InstructionFour />} />
      <Route path="/loginorguest" element={<LoginOrGuest />} />
    </Routes>
  );
}

export default AppRoutes;
