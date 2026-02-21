import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Seller.css";

function SellerDashboard() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);

  //Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products/my-products");
      setProducts(response.data);
    } catch (error) {
      console.log("Error fetching products");
    }
  };

  //Handle text input
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  //Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("description", product.description);
    formData.append("image", image);

    try {
      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully");

      setProduct({
        name: "",
        price: "",
        category: "",
        description: "",
      });

      setImage(null);
      fetchProducts();

    } catch (error) {
      alert(error.response?.data?.message || "Error adding product");
    }
  };

  //Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="seller-container">

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Seller Dashboard</h2>
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

      {/* Add Product */}
      <div className="seller-card">
        <h3>Add Product</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
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

          <button type="submit" className="primary-btn">
            Submit
          </button>
        </form>

        <button
          className="primary-btn"
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/seller/orders")}
        >
          View Orders
        </button>
      </div>

      {/* Product List */}
      <div className="seller-card">
        <h3>My Products</h3>

        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div className="seller-product-list">
            {products.map((p) => (
              <div key={p._id} className="seller-product-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{p.name}</strong>
                    <p>₹{p.price}</p>
                    <p>{p.category}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default SellerDashboard;