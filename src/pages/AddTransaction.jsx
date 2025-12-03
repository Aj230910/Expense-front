// src/pages/AddTransaction.jsx

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import API from "../api";

function AddTransaction() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deviceId = localStorage.getItem("deviceId");

    try {
      await API.post("/add", {
        title,
        amount: Number(amount || 0),
        category,
        type,
        deviceId,
      });

      alert("Transaction Added!");
      setTitle("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.error(error);
      alert("Failed to add transaction");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
      className="fade-in"
    >
      <Card className="glass-card" sx={{ width: isSm ? "92%" : 480, p: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: 700, mb: 3 }}
          >
            Add Transaction
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>

              {/* TITLE */}
              <TextField
                label="Title"
                variant="filled"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.1) !important",
                    color: "#f1f5f9 !important",
                    backdropFilter: "blur(6px)",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#94a3b8 !important",
                  },
                }}
              />

              {/* AMOUNT */}
              <TextField
                label="Amount (₹)"
                type="number"
                variant="filled"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.1) !important",
                    color: "#f1f5f9 !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#94a3b8 !important",
                  },
                }}
              />

              {/* TYPE */}
              <TextField
                label="Type"
                select
                variant="filled"
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.1) !important",
                    color: "#f1f5f9 !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#94a3b8 !important",
                  },
                }}
              >
                <MenuItem value="income">💚 Income</MenuItem>
                <MenuItem value="expense">🔴 Expense</MenuItem>
              </TextField>

              {/* CATEGORY */}
              <TextField
                label="Category"
                select
                variant="filled"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.1) !important",
                    color: "#f1f5f9 !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#94a3b8 !important",
                  },
                }}
              >
                <MenuItem value="Food">🍔 Food</MenuItem>
                <MenuItem value="Travel">✈️ Travel</MenuItem>
                <MenuItem value="Bills">💡 Bills</MenuItem>
                <MenuItem value="Shopping">🛍️ Shopping</MenuItem>
                <MenuItem value="Salary">💰 Salary</MenuItem>
                <MenuItem value="Rent">🏠 Rent</MenuItem>
                <MenuItem value="Other">📦 Other</MenuItem>
              </TextField>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.6,
                  mt: 1,
                  fontWeight: 700,
                }}
              >
                Add
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddTransaction;
