import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../theme/ThemeContext";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link } from "react-router-dom";

function Navbar() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar position="static" sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <Toolbar>

        {/* LOGO */}
        <AccountBalanceWalletIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Expense Tracker
        </Typography>

        {/* NAV LINKS */}
        <Button color="inherit" component={Link} to="/">
          Dashboard
        </Button>

        <Button color="inherit" component={Link} to="/add">
          Add
        </Button>

        <Button color="inherit" component={Link} to="/history">
          History
        </Button>

        {/* DARK / LIGHT MODE TOGGLE */}
        <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ ml: 2 }}>
          {theme.palette.mode === "dark" ? (
            <LightModeIcon sx={{ fontSize: 28 }} />
          ) : (
            <DarkModeIcon sx={{ fontSize: 28 }} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
