import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import API from "../api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4"];

  // Fetch all transactions
  const fetchAll = async () => {
    try {
      const deviceId = localStorage.getItem("deviceId");
      const res = await API.get(`/?deviceId=${deviceId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Calculate all charts + totals
  useEffect(() => {
    if (transactions.length === 0) return;

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    setIncome(totalIncome);
    setExpense(totalExpense);

    // Pie chart
    const catMap = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

    setPieData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

    // Line chart (monthly)
    const monthMap = {};
    transactions.forEach(t => {
      const dt = new Date(t.date);
      const key = dt.toLocaleString("default", { month: "short", year: "numeric" });

      if (!monthMap[key]) {
        monthMap[key] = { month: key, income: 0, expense: 0 };
      }

      if (t.type === "income") monthMap[key].income += t.amount;
      else monthMap[key].expense += t.amount;
    });

    setLineData(Object.values(monthMap));
  }, [transactions]);

  const balance = income - expense;

  return (
    <Box sx={{ padding: "25px", color: "#f1f5f9" }} className="fade-in">

      {/* SUMMARY CARDS */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Card className="glass-card" sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6">Income</Typography>
              <Typography variant="h4" sx={{ color: "#22c55e", fontWeight: 700 }}>
                ₹ {income}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="glass-card" sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6">Expense</Typography>
              <Typography variant="h4" sx={{ color: "#ef4444", fontWeight: 700 }}>
                ₹ {expense}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="glass-card" sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6">Balance</Typography>
              <Typography variant="h4" sx={{ color: "#3b82f6", fontWeight: 700 }}>
                ₹ {balance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PIE CHART */}
      <Card className="glass-card" sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Category-wise Expense
        </Typography>

        <PieChart width={450} height={330}>
          <Pie data={pieData} cx={200} cy={150} outerRadius={110} dataKey="value" label>
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Card>

      {/* LINE CHART */}
      <Card className="glass-card" sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Monthly Income & Expense Trend
        </Typography>

        <LineChart width={700} height={300} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="month" stroke="#e2e8f0" />
          <YAxis stroke="#e2e8f0" />

          <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
        </LineChart>
      </Card>

    </Box>
  );
}

export default Dashboard;
