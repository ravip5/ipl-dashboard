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
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Grid
} from "@mui/material";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function App() {
  const [teams, setTeams] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const sheetId = "1UhmfBxypgfOXuJ-nR7B12eYrjzLL9umVOBIY1AeY-48";
  const sheetName = "Scoring Sheet";
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
    sheetName
  )}`;

  const allowedTeams = [
    "lavin","avi","raj","hunny","dinu","punjabi",
    "rk","nicky","jitin","soham","ashi","kishu","roshan"
  ];

  const fetchData = () => {
    fetch(sheetUrl)
      .then((res) => res.text())
      .then((text) => {
        try {
          const jsonStr = text.substring(47, text.length - 2);
          const json = JSON.parse(jsonStr);

          const rows = json.table.rows.map((row) => ({
            team: row.c[0]?.v ? row.c[0].v.trim() : null,
            points: Number(row.c[1]?.v) || 0
          }));

          const filtered = rows.filter(
            (r) =>
              r.team &&
              allowedTeams.includes(r.team.trim().toLowerCase())
          );

          const teamMap = {};
          filtered.forEach((r) => {
            const normalized = r.team.trim();
            teamMap[normalized] = (teamMap[normalized] || 0) + r.points;
          });

          const cleanRows = Object.entries(teamMap).map(([team, points]) => ({
            team,
            points
          }));

          setTeams(cleanRows);

          setLastUpdated(
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          );
        } catch (err) {
          console.error("Error parsing sheet data:", err);
        }
      })
      .catch((err) => console.error("Error fetching sheet:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    labels: teams.map((t) => t.team),
    datasets: [
      {
        label: "Points",
        data: teams.map((t) => t.points),
        backgroundColor: teams.map((t, i) =>
          i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "rgba(75,192,192,0.6)"
        ),
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "IPL Fantasy League Team Totals" },
      legend: { display: false },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#000",
        font: { weight: "bold" },
        formatter: (value) => value
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,   // ✅ rotate labels diagonally
          minRotation: 45,
          font: { size: 12 }
        }
      },
      y: { beginAtZero: true }
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            IPL Fantasy League Dashboard
          </Typography>
          {lastUpdated && (
            <Typography
              variant="subtitle2"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Last updated: {lastUpdated}
            </Typography>
          )}

          <Grid container spacing={3}>
            {/* Chart Section */}
            <Grid item xs={12} md={6}>
              <div style={{ width: "100%", height: "350px" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={fetchData}
              >
                Refresh Scores
              </Button>
            </Grid>

            {/* Leaderboard Section */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                align="center"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                Leaderboard
              </Typography>
              <div style={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teams
                      .sort((a, b) => b.points - a.points)
                      .map((t, index) => (
                        <TableRow key={t.team}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{t.team}</TableCell>
                          <TableCell>{t.points}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;