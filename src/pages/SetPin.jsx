import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SetPin({ onSet }) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const savePin = (p) => {
    // mild obfuscation — frontend only (not secure)
    localStorage.setItem("pin", btoa(p));
    localStorage.setItem("pinUnlocked", "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!/^\d{4}$/.test(pin)) {
      setErr("PIN must be exactly 4 digits");
      return;
    }
    if (pin !== confirm) {
      setErr("PIN and Confirm PIN do not match");
      return;
    }

    savePin(pin);
    if (onSet) onSet();
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
      <Card sx={{ width: 420, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Set 4-digit PIN</Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0,4))}
                inputProps={{ maxLength: 4 }}
                helperText="Only digits allowed"
              />
              <TextField
                label="Confirm PIN"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value.replace(/\D/g, "").slice(0,4))}
                inputProps={{ maxLength: 4 }}
              />

              {err && <Alert severity="error">{err}</Alert>}

              <Button type="submit" variant="contained">Set PIN</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SetPin;
