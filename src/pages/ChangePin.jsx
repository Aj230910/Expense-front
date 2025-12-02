import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ChangePin() {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setErr("");

    const stored = localStorage.getItem("pin");
    if (!stored || btoa(oldPin) !== stored) {
      setErr("Old PIN incorrect");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      setErr("New PIN must be 4 digits");
      return;
    }
    if (newPin !== confirm) {
      setErr("New PIN and confirm mismatch");
      return;
    }

    localStorage.setItem("pin", btoa(newPin));
    localStorage.setItem("pinUnlocked", "true");
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
      <Card sx={{ width: 420, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Change PIN</Typography>

          <form onSubmit={handleChange}>
            <Stack spacing={2}>
              <TextField label="Old PIN" value={oldPin} onChange={(e)=>setOldPin(e.target.value.replace(/\D/g, "").slice(0,4))} inputProps={{ maxLength:4 }} type="password" />
              <TextField label="New PIN" value={newPin} onChange={(e)=>setNewPin(e.target.value.replace(/\D/g, "").slice(0,4))} inputProps={{ maxLength:4 }} type="password" />
              <TextField label="Confirm New PIN" value={confirm} onChange={(e)=>setConfirm(e.target.value.replace(/\D/g, "").slice(0,4))} inputProps={{ maxLength:4 }} type="password" />

              {err && <Alert severity="error">{err}</Alert>}

              <Button type="submit" variant="contained">Change PIN</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ChangePin;
