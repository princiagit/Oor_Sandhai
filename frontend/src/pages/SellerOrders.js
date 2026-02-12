import { useEffect, useState } from "react";
import API from "../services/api";
import "./Seller.css";

function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.log("Error fetching orders");
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      fetchOrders();
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
    <div className="seller-container">
      <h2>Incoming Orders 📦</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="seller-card">
            <h4>Order ID: {order._id.slice(-6)}</h4>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Total: ₹{order.totalAmount}</p>

            <div>
              {order.items.map((item, index) => (
                <p key={index}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            {order.status === "Pending" && (
              <button
                className="primary-btn"
                onClick={() => updateStatus(order._id, "Confirmed")}
              >
                Confirm Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default SellerOrders;
