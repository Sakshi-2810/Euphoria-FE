import axios from "axios";

// Create an axios instance with base config
const api = axios.create({
  baseURL: "http://localhost:8001", // Adjust if your backend is hosted elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // assuming you store JWT in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Common API methods
export const getCategories = () => api.get("/categories");
export const getCategoriesById = (id) => api.get(`/categories/${id}`)
export const editCategory = (data) => api.post("/categories", data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

export const getProducts = (params = {}) => api.get("/products", { params });

// Fetch "trending" products by picking first N products
export const getTrendingProducts = async (limit = 6) => {
  const res = await getProducts(); // fetch all products
  const products = res.data.data || [];
  return { ...res, data: products.slice(0, limit) }; // pick first N
};

export const getProductById = (id) => api.get(`/products/${id}`);


export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);

// Cart APIs
export const getCart = () => api.get("/cart");
export const addToCart = (item) => api.post("/cart/add", item);
export const updateCartItem = (productId, qty) => api.put("/cart/update", null, { params: { productId, qty } });
export const removeCartItem = (productId) => api.delete("/cart/remove", { params: { productId } });
export const clearCart = () => api.delete("/cart/clear");

// Wishlist APIs
export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (item) => api.post("/wishlist/add", item);
export const removeFromWishlist = (productId) => api.delete("/wishlist/remove", { params: { productId } });
export const clearWishlist = () => api.delete("/wishlist/clear");

//Orders apis
export const placeOrder = (orderData) => api.post("/orders/place", orderData);
export const getUserOrders = () => api.get("/orders");
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const getAllOrders = () => api.get("/orders/all");
export const updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}/status`, null, { params: { status } });
export default api;