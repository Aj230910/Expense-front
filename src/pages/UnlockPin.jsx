import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function UnlockPin({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    const saved = localStorage.getItem("pin");
    if (!saved) {
      setErr("No PIN set. Please set a new PIN.");
      navigate("/set-pin", { replace: true });
      return;
    }

    if (btoa(pin) === saved) {
      localStorage.setItem("pinUnlocked", "true");
      if (onUnlock) onUnlock();
      navigate("/", { replace: true });
    } else {
      setErr("Incorrect PIN");
    }
  };

  const handleForgot = () => {
    // reset PIN — warn user that device data might be lost
    const ok = window.confirm("Resetting PIN will remove PIN and may clear protected data. Proceed?");
    if (ok) {
      localStorage.removeItem("pin");
      localStorage.removeItem("pinUnlocked");
      // option: also remove device-specific data — do not auto-delete; let user decide
      navigate("/set-pin", { replace: true });
    }
  };

  return (
    <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
      <Card sx={{ width: 420, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Enter PIN to Unlock</Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0,4))}
                inputProps={{ maxLength: 4 }}
                type="password"
              />

              {err && <Alert severity="error">{err}</Alert>}

              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">Unlock</Button>
                <Button variant="outlined" color="error" onClick={handleForgot}>Reset PIN</Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UnlockPin;
