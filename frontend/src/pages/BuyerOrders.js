import { useEffect, useState } from "react";
import API from "../services/api";
import "./Buyer.css";

function BuyerOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const buyerId = localStorage.getItem("userId");

      const response = await API.get(`/orders/buyer/${buyerId}`);
      setOrders(response.data);

    } catch (error) {
      console.log("Error fetching orders");
    }
  };
  const handleCancel = async (orderId) => {
  try {
    await API.put(`/orders/${orderId}/cancel`);
    alert("Order cancelled successfully");
    fetchOrders(); // refresh list
  } catch (error) {
    alert(error.response?.data?.message || "Cancel failed");
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="buyer-container">
      <h2 className="buyer-title">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h4>Order ID: {order._id}</h4>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.totalAmount}</p>

            <div>
              {order.items.map((item, index) => (
                <div key={index}>
                  <p>
                    {item.name} × {item.quantity}
                  </p>
                </div>
              ))}
            </div>
            {order.status === "Pending" && (
            <button
              onClick={() => handleCancel(order._id)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Cancel Order
            </button>
          )}

          </div>
        ))
      )}
    </div>
  );
}

export default BuyerOrders;
