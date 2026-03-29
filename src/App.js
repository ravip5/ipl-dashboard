import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function App() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const sheetId = "YOUR_SHEET_ID"; 
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    axios.get(url).then((res) => {
      const data = JSON.parse(res.data.substr(47).slice(0, -2));
      const rows = data.table.rows.map((row) => ({
        team: row.c[0].v,
        points: row.c[1].v,
      }));
      setTeams(rows);
    });
  }, []);

  const chartData = {
    labels: teams.map((t) => t.team),
    datasets: [
      {
        label: "Total Points",
        data: teams.map((t) => t.points),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div style={{ width: "70%", margin: "auto", textAlign: "center" }}>
      <h2>IPL Fantasy League Dashboard</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default App;