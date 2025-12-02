import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box, Typography, IconButton, Stack,
  Snackbar, Alert, TextField, MenuItem, Button
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import API from "../api";
import EditDialog from "../components/EditDialog";
import ConfirmDelete from "../components/ConfirmDelete";
import categoryIcons from "../utils/categoryIcons";

function History() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Edit Dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Delete Dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Toast
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success",
  });

  // ⭐ FETCH TRANSACTIONS USING DEVICE ID
  const fetchTx = async () => {
    try {
      setLoading(true);
      const deviceId = localStorage.getItem("deviceId");

      const res = await API.get(`/?deviceId=${deviceId}`);

      const data = res.data.map((tx) => ({
        id: tx._id,
        title: tx.title,
        amount: tx.amount,
        category: tx.category,
        type: tx.type,
        date: new Date(tx.date).toLocaleString(),
      }));

      setRows(data);
      setFilteredRows(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTx();
  }, []);

  // ⭐ FILTER FUNCTION
  useEffect(() => {
    let result = [...rows];

    if (search.trim() !== "") {
      result = result.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory !== "All") {
      result = result.filter((r) => r.category === filterCategory);
    }

    if (filterType !== "All") {
      result = result.filter((r) => r.type === filterType);
    }

    setFilteredRows(result);
  }, [search, filterCategory, filterType, rows]);

  // ⭐ Edit
  const handleEditOpen = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };
  const handleEditClose = () => setOpenEdit(false);

  // ⭐ Delete
  const handleDeleteOpen = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const deviceId = localStorage.getItem("deviceId");

      await API.delete(`/${deleteId}?deviceId=${deviceId}`);

      setRows((prev) => prev.filter((row) => row.id !== deleteId));

      setToast({ open: true, msg: "Deleted Successfully!", type: "success" });
      setOpenDelete(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ⭐ CSV Export
  const exportCSV = () => {
    if (filteredRows.length === 0) {
      setToast({ open: true, msg: "No data to export!", type: "warning" });
      return;
    }

    let csv = "Title,Amount,Category,Type,Date\n";

    filteredRows.forEach((row) => {
      csv += `${row.title},${row.amount},${row.category},${row.type},${row.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();

    setToast({ open: true, msg: "CSV Exported!", type: "success" });
  };

  // ⭐ PDF Export
  const exportPDF = () => {
    if (filteredRows.length === 0) {
      setToast({ open: true, msg: "No data to export!", type: "warning" });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Transaction Report", 14, 20);

    const tableColumn = ["Title", "Amount", "Category", "Type", "Date"];
    const tableRows = filteredRows.map((row) => [
      row.title,
      row.amount,
      row.category,
      row.type,
      row.date,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("transactions.pdf");

    setToast({ open: true, msg: "PDF Exported Successfully!", type: "success" });
  };

  // ⭐ Table Columns (WITH ICONS)
  const columns = [
    { field: "title", headerName: "Title", width: 150 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "category",
      headerName: "Category",
      width: 170,
      renderCell: (params) => (
        <span style={{ fontSize: "18px" }}>
          {categoryIcons[params.row.category] || "📦"} {params.row.category}
        </span>
      ),
    },
    { field: "type", headerName: "Type", width: 130 },
    { field: "date", headerName: "Date", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDeleteOpen(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: "90%", mx: "auto", mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Transaction History
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Search Title"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          label="Category"
          select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Food">🍔 Food</MenuItem>
          <MenuItem value="Travel">✈️ Travel</MenuItem>
          <MenuItem value="Bills">💡 Bills</MenuItem>
          <MenuItem value="Shopping">🛍️ Shopping</MenuItem>
          <MenuItem value="Salary">💰 Salary</MenuItem>
          <MenuItem value="Rent">🏠 Rent</MenuItem>
        </TextField>

        <TextField
          label="Type"
          select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>

        <Button variant="contained" sx={{ height: 55 }} onClick={exportCSV}>
          Export CSV
        </Button>

        <Button variant="contained" color="error" sx={{ height: 55 }} onClick={exportPDF}>
          Export PDF
        </Button>
      </Stack>

      {/* TABLE */}
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        pageSize={8}
        rowsPerPageOptions={[8]}
        sx={{ border: "none" }}
      />

      {/* EDIT + DELETE */}
      <EditDialog
        open={openEdit}
        handleClose={handleEditClose}
        transaction={selectedRow}
        refresh={fetchTx}
      />

      <ConfirmDelete
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        handleConfirm={handleDeleteConfirm}
      />

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

export default History;
