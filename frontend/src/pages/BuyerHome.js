import { useState, useEffect } from "react";
import "./Buyer.css";
import API from "../services/api";

function BuyerHome() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // 🔥 Fetch products from backend
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

  // 🔥 Add to cart (use _id)
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

  return (
    <div className="buyer-container">
      <h2 className="buyer-title">Welcome to Oor Sandhai</h2>

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
              <button className="primary-btn place-order-btn">
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
