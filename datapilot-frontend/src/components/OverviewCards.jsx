function OverviewCards({ data }) {

  return (

    <div className="cards">

      <div className="card">
        <h3>Rows</h3>
        <p>{data.rows}</p>
      </div>

      <div className="card">
        <h3>Columns</h3>
        <p>{data.columns}</p>
      </div>

      <div className="card">
        <h3>Health Score</h3>
        <p>{data.health_score}</p>
      </div>

    </div>

  );
}

export default OverviewCards;