import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, Snackbar, Alert
} from "@mui/material";
import API from "../api";

function EditDialog({ open, handleClose, transaction, refresh }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setType(transaction.type);
    }
  }, [transaction]);

  const handleUpdate = async () => {
    try {
      const deviceId = localStorage.getItem("deviceId");

      await API.put(
        `/${transaction.id}?deviceId=${deviceId}`,
        {
          title,
          amount: Number(amount),
          category,
          type
        }
      );

      setToast({ open: true, msg: "Updated Successfully!", type: "success" });

      refresh();
      setTimeout(() => handleClose(), 600);

    } catch (err) {
      console.error(err);
      setToast({ open: true, msg: "Update Failed", type: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Transaction</DialogTitle>

      <DialogContent sx={{ width: 400 }}>

        <TextField
          fullWidth
          label="Title"
          sx={{ mt: 1 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          fullWidth
          label="Amount"
          type="number"
          sx={{ mt: 2 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <TextField
          fullWidth
          select
          label="Category"
          sx={{ mt: 2 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Travel">Travel</MenuItem>
          <MenuItem value="Shopping">Shopping</MenuItem>
          <MenuItem value="Bills">Bills</MenuItem>
          <MenuItem value="Salary">Salary</MenuItem>
          <MenuItem value="Rent">Rent</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Type"
          sx={{ mt: 2 }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>

      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>Update</Button>
      </DialogActions>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
    </Dialog>
  );
}

export default EditDialog;
