import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerHome from "./pages/BuyerHome";
import SellerDashboard from "./pages/SellerDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import SellerOrders from "./pages/SellerOrders";
import BuyerOrders from "./pages/BuyerOrders";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buyer" element={<BuyerHome />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/my-orders" element={<BuyerOrders />} />
      </Routes>
    </Router>
  );
}

export default App;