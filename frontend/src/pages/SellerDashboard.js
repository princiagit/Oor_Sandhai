import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


import "./Seller.css";

function SellerDashboard() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  //Fetch products from DB
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log("Error fetching products");
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", product);
      alert("Product added successfully");
      setProduct({
        name: "",
        price: "",
        category: "",
        description: "",
      });
      fetchProducts(); //refresh product list
    } catch (error) {
      alert("Error adding product");
    }
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");

  navigate("/");
};

  return (
    <div className="seller-container">
      <div className = "row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className = "col-6">
          <h2>Seller Dashboard</h2>
        </div>
        <div className="col-6">
          <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer"
              }}>Logout
          </button>
        </div>
      </div>
      <div className="seller-card">
        <h3>Add Product</h3>
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
          />
          <button
            className="primary-btn"
            onClick={() => navigate("/seller")} 
          >Submit</button>

          <button
            className="primary-btn"
            onClick={() => navigate("/seller/orders")}
          >
            View Orders
          </button>

        </form>
      </div>

      <div className="seller-card">
        <h3>My Products</h3>

        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div className="seller-product-list">
            {products.map((p) => (
              <div key={p._id} className="seller-product-item">
                <strong>{p.name}</strong> – ₹{p.price} ({p.category})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
