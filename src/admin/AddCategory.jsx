import { useState } from "react";
import { LayoutGrid } from "lucide-react";

function AddCategory() {
  const [catName, setCatName] = useState("");

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <LayoutGrid size={28} color="#ff3366" />
          <h2>Create Category</h2>
        </div>
        <div className="admin-form">
          <input type="text" placeholder="Category Name (e.g. Anniversary)" 
            onChange={(e) => setCatName(e.target.value)} className="standard-input" />
          <button className="auth-btn" onClick={() => alert(`Category ${catName} Created!`)}>
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}