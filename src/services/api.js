import axios from "axios";

// Create an axios instance with base config
const api = axios.create({
  baseURL: "https://euphoria-be.onrender.com", // Adjust if your backend is hosted elsewhere
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired / unauthorized
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Optional: clear everything
      // localStorage.clear();
    }

    return Promise.reject(error);
  }
);
// Common API methods
export const getCategories = () => api.get("/categories");
export const getCategoriesById = (id) => api.get(`/categories/${id}`)
export const editCategory = (data) => api.post("/categories", data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

export const getProducts = () => api.get("/products");
export const getProductsByCategory = (category) => api.get(`/products/filter?categories=${category}`);
export const getTrendingProducts = () => api.get("/products/filter?categories=TRENDING");
export const getProductById = (id) => api.get(`/products/${id}`);
export const postProduct = (data) => api.post("/products", data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);
export const oauthLogin = (data) => api.post("/auth/oauth-login", data);

export const getAddress = () => api.get("/user/addresses");
export const postAddress = (data) => api.post("/user/address", data);
export const deleteAddress = (id) => api.delete(`/user/address?addressId=${id}`);
export const updateAddress = (id, data) => api.put(`/user/address?addressId=${id}`, data);

// Cart APIs
export const getCart = () => api.get("/cart");
export const postToCart = (product) => {
   const formatted = {
    productId: product.productId,
    name: product.name,
    price: product.price,
    image: product.image,
    qty: product.qty || 1
  };
  return api.post("/cart/add", formatted);
}
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
export const cancelOrder = (orderId) => api.post(`/orders/${orderId}/cancel`);
export default api;