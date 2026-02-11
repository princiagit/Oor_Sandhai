import { useState } from "react";

function BuyerHome() {
  const productsData = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: 30,
      category: "Vegetables",
    },
    {
      id: 2,
      name: "Organic Rice",
      price: 60,
      category: "Grains",
    },
    {
      id: 3,
      name: "Milk",
      price: 25,
      category: "Dairy",
    },
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
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
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
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
    <div style={{ padding: "30px" }}>
      <h2>Buyer Home – Oor Sandhai</h2>

      <h3>Available Products</h3>
      <ul>
        {productsData.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> – ₹{product.price} (
            {product.category})
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>My Cart</h3>
      {cart.length === 0 && <p>Your cart is empty.</p>}

      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} – ₹{item.price} × {item.quantity}
            <button onClick={() => increaseQty(item.id)}> + </button>
            <button onClick={() => decreaseQty(item.id)}> − </button>
          </li>
        ))}
      </ul>

      <h4>Total Amount: ₹{totalAmount}</h4>

      {cart.length > 0 && <button>Place Order</button>}
    </div>
  );
}

export default BuyerHome;
