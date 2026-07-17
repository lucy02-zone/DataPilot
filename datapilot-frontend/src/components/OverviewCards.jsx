function OverviewCards({ data }) {
  const overview = data || {};

  const cards = [
    { label: "Rows", value: overview.rows ?? 0 },
    { label: "Columns", value: overview.columns ?? 0 },
    { label: "Numeric Columns", value: overview.numeric_columns ?? 0 },
    { label: "Categorical Columns", value: overview.categorical_columns ?? 0 },
    { label: "Health Score", value: overview.health_score ?? 0 }
  ];

  return (
    <div className="cards">
      {cards.map((card) => (
        <div className="card" key={card.label}>
          <h3>{card.label}</h3>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default OverviewCards;