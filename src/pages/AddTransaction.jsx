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
import API from "../api"; // 👈 Correct axios instance

function AddTransaction() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  // Colors
  const inputBg = theme.palette.mode === "dark" ? "#2a2a2a" : "#fafafa";
  const cardBg = theme.palette.mode === "dark" ? "#151515" : "#ffffff";
  const inputText = theme.palette.mode === "dark" ? "#eaeaea" : "#111827";
  const labelColor = theme.palette.mode === "dark" ? "#bfc7cf" : "#6b7280";

  // States
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  // ⭐ FIXED: Proper API POST
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

      alert("Transaction Added Successfully!");

      // Reset inputs
      setTitle("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.error("Add Error:", error);
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
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0e0e10 0%, #151515 100%)"
            : "linear-gradient(135deg, #E3F2FD 0%, #F3E8FF 100%)",
      }}
    >
      <Card
        elevation={8}
        sx={{
          width: isSm ? "92%" : 480,
          borderRadius: 3,
          bgcolor: cardBg,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 30px rgba(0,0,0,0.7)"
              : "0 6px 24px rgba(16,24,40,0.08)",
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 3,
              color: inputText,
            }}
          >
            Add Transaction
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* Title */}
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="filled"
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ style: { color: labelColor } }}
                sx={{
                  bgcolor: inputBg,
                  borderRadius: 2,
                  "& .MuiFilledInput-root": {
                    background: inputBg,
                    color: inputText,
                    borderRadius: 8,
                  },
                }}
              />

              {/* Amount */}
              <TextField
                label="Amount (₹)"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="filled"
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ style: { color: labelColor } }}
                sx={{
                  bgcolor: inputBg,
                  borderRadius: 2,
                  "& .MuiFilledInput-root": {
                    background: inputBg,
                    color: inputText,
                    borderRadius: 8,
                  },
                }}
              />

              {/* Type */}
              <TextField
                label="Type"
                select
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
                variant="filled"
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ style: { color: labelColor } }}
                sx={{
                  bgcolor: inputBg,
                  borderRadius: 2,
                  "& .MuiFilledInput-root": {
                    background: inputBg,
                    color: inputText,
                    borderRadius: 8,
                  },
                }}
              >
                <MenuItem value="income">💚 Income</MenuItem>
                <MenuItem value="expense">🔴 Expense</MenuItem>
              </TextField>

              {/* Category */}
              <TextField
                label="Category"
                select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                variant="filled"
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ style: { color: labelColor } }}
                sx={{
                  bgcolor: inputBg,
                  borderRadius: 2,
                  "& .MuiFilledInput-root": {
                    background: inputBg,
                    color: inputText,
                    borderRadius: 8,
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

              {/* Submit Button */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  py: 1.6,
                  fontWeight: 700,
                  borderRadius: 2,
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(90deg,#2563eb,#60a5fa)"
                      : "linear-gradient(90deg,#1976D2,#42A5F5)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 6px 18px rgba(37,99,235,0.25)"
                      : "0 6px 18px rgba(66,165,245,0.18)",
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
