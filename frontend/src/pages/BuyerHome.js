import { useState, useEffect } from "react";
import "./Buyer.css";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function BuyerHome() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  //Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products");
      }
    };

    fetchProducts();
  }, []);

  // Add to cart (use _id)
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
  try {
    const buyerId = localStorage.getItem("userId"); // we will store this soon

    const orderData = {
      buyerId,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
    };

    await API.post("/orders", orderData);

    alert("Order placed successfully!");
    setCart([]);
  } catch (error) {
    alert("Error placing order");
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");

  navigate("/");
};



  return (
    <div className="buyer-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="buyer-title">Welcome to Oor Sandhai</h2>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
      

      {/* Products Section */}
      <h3 className="section-title">Available Products</h3>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-image-placeholder"></div>
            <h4>{product.name}</h4>
            <p className="category">{product.category}</p>
            <p className="price">₹{product.price}</p>
            <button
              className="primary-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="cart-section">
        <button className="primary-btn" onClick={() => navigate("/my-orders")}>
              View My Orders
        </button>
        <h3 className="section-title">My Cart</h3>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div>
                    <h4>{item.name}</h4>
                    <p>₹{item.price}</p>
                  </div>

                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item._id)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <h4>Total: ₹{totalAmount}</h4>
              <button
                  className="primary-btn place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0}
                >
                Place Order
                </button>
              </div>
            </>
        )}
      </div>
    </div>
  );
}

export default BuyerHome;
