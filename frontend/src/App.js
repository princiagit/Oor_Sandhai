import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerHome from "./pages/BuyerHome";
import SellerDashboard from "./pages/SellerDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buyer" element={<BuyerHome />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;