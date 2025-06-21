export const renderStaticStars = (numStars: number) => {
    return (
      <div style={{ display: "flex", minWidth: "80px" }}>
        {[...Array(numStars)].map((_, i) => (
          <span
            key={`static-star-${numStars}-${i}`}
            style={{ color: "gold", fontSize: "1rem" }}
          >
            ★
          </span>
        ))}
        {[...Array(5 - numStars)].map((_, i) => (
          <span
            key={i}
            style={{ color: "lightgray", fontSize: "1rem" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  export const renderDynamicStars = (rating: number, size: string = "1rem") => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    return (
      <div style={{ display: "flex",gap: "4px" }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: "#F9D34D", fontSize: size }}>
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span style={{ color: "#F9D34D", fontSize: size }}>★</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span
            key={`empty-${i}`}
            style={{ color: "lightgray", fontSize: size}}
          >
            ★
          </span>
        ))}
      </div>
    );
  };