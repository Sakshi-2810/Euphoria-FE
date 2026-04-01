function CategoryCard({ category, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-image-wrapper">
        <img src={category.image} alt={category.name} />
      </div>
      <p className="category-name">{category.name}</p>
    </div>
  );
}

export default CategoryCard;