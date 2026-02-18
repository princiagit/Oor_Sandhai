import { useState, useEffect } from "react";
import API from "../services/api";
import "./Delivery.css";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders");
      
      // Only show confirmed or out for delivery
      const filtered = response.data.filter(
        (order) =>
          order.status === "Confirmed" ||
          order.status === "Out for Delivery"
      );

      setOrders(filtered);
    } catch (error) {
      console.log("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
  <div className="delivery-container">
    <h2 className="delivery-title">🚚 Delivery Dashboard</h2>

    {orders.length === 0 ? (
      <p className="empty-message">No delivery requests available.</p>
    ) : (
      orders.map((order) => (
        <div key={order._id} className="delivery-card">
          <p className="order-id">Order ID: {order._id}</p>

          <p className={`order-status ${
            order.status === "Confirmed"
              ? "status-confirmed"
              : order.status === "Out for Delivery"
              ? "status-out"
              : order.status === "Delivered"
              ? "status-delivered"
              : "status-pending"
          }`}>
            Status: {order.status}
          </p>

          <p className="order-total">
            Total: ₹{order.totalAmount}
          </p>

          {order.status === "Confirmed" && (
            <button
              className="delivery-btn start-btn"
              onClick={() =>
                updateStatus(order._id, "Out for Delivery")
              }
            >
              Start Delivery
            </button>
          )}

          {order.status === "Out for Delivery" && (
            <button
              className="delivery-btn complete-btn"
              onClick={() =>
                updateStatus(order._id, "Delivered")
              }
            >
              Mark as Delivered
            </button>
          )}
        </div>
      ))
    )}
  </div>
);

}

export default DeliveryDashboard;
