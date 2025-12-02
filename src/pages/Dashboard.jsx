import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import API from "../api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const COLORS = ["#D32F2F", "#1976D2", "#43A047", "#FB8C00", "#9C27B0", "#00ACC1"];

  // ⭐ FETCH ALL TRANSACTIONS WITH DEVICE ID
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

  // ⭐ CALCULATE INCOME, EXPENSE, PIE & LINE CHART
  useEffect(() => {
    if (transactions.length === 0) return;

    // Income
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // Expense
    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    setIncome(totalIncome);
    setExpense(totalExpense);

    // ⭐ Pie Chart
    const catMap = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

    setPieData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

    // ⭐ Monthly Line Chart
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
    <div style={{ padding: "20px 30px" }}>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3}>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: "18px", padding: 2 }}>
            <CardContent>
              <Typography variant="h6">Income</Typography>
              <Typography variant="h4" sx={{ color: "#2E7D32" }}>
                ₹ {income}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: "18px", padding: 2 }}>
            <CardContent>
              <Typography variant="h6">Expense</Typography>
              <Typography variant="h4" sx={{ color: "#D32F2F" }}>
                ₹ {expense}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: "18px", padding: 2 }}>
            <CardContent>
              <Typography variant="h6">Balance</Typography>
              <Typography variant="h4" sx={{ color: "#1976D2" }}>
                ₹ {balance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* PIE CHART */}
      <Card sx={{ padding: 3, mt: 4, borderRadius: "20px" }}>
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
      <Card sx={{ padding: 3, mt: 4, borderRadius: "20px" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Monthly Income & Expense Trend
        </Typography>

        <LineChart width={700} height={300} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />

          <Line type="monotone" dataKey="income" stroke="#2E7D32" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" stroke="#D32F2F" strokeWidth={3} />
        </LineChart>
      </Card>

    </div>
  );
}

export default Dashboard;
