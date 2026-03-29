import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // <-- import plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // <-- register plugin
);

function App() {
  const [teams, setTeams] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbzYpZhP7L26y7KSGKjDDWNBw-rZUzX_-o1MLrFh1yQZHTFUDfM74Cib4xRE94RgRtpS4A/exec";
    const sheetId = "1onVLj0PGGKlnKuv4lRO-0ovh0YdELqa86zzSS-4-vMw";
    const sheetName = "Scoring Sheet"; // dashboard data comes from Scoring Sheet
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
      sheetName
    )}`;

    // Step 1: Trigger Apps Script to refresh IPL Website Score
    fetch(scriptUrl)
      .then((res) => res.json())
      .then((data) => {
        setLastUpdated(
          new Date(data.updatedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })
        );
        // Step 2: Fetch updated Scoring Sheet totals
        return fetch(sheetUrl);
      })
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.map((row) => ({
          team: row.c[0]?.v,
          points: row.c[1]?.v
        }));

        const allowedTeams = [
          "Lavin",
          "Avi",
          "Raj",
          "Hunny",
          "Dinu",
          "Punjabi",
          "RK",
          "Nicky",
          "Jitin",
          "Soham",
          "Ashi",
          "Kishu",
          "Roshan"
        ];

        const cleanRows = rows.filter(
          (r) => r.team && allowedTeams.includes(r.team)
        );
        setTeams(cleanRows);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const chartData = {
    labels: teams.map((t) => t.team),
    datasets: [
      {
        label: "Total Points",
        data: teams.map((t) => t.points),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "IPL Fantasy League Team Totals (Scoring Sheet)"
      },
      legend: { display: false },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#000",
        font: {
          weight: "bold"
        },
        formatter: (value) => value // show points directly
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h2>IPL Fantasy League Dashboard</h2>
      {lastUpdated && (
        <p style={{ fontStyle: "italic", marginBottom: "10px" }}>
          Last points updated on: {lastUpdated}
        </p>
      )}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default App;