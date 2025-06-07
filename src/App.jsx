import * as React from "react";
import "@fontsource/roboto/400.css";
import "@fontsource/orbitron/400.css";
import {
  Typography,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function App() {
  const [text, setText] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [darkMode, setDarkMode] = React.useState(true); // Start with dark mode

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#00e676", // neon green
      },
      secondary: {
        main: "#ff1744", // vibrant red
      },
      background: {
        default: darkMode ? "#121212" : "#f4f4f4",
        paper: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      },
    },
    typography: {
      fontFamily: "'Orbitron', 'Roboto', sans-serif",
      h3: {
        fontWeight: 700,
        textTransform: "uppercase",
      },
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newItems = lines
      .filter((line) => !items.some((item) => item.text === line))
      .map((line) => ({ text: line, checked: false }));

    setItems((prev) => [...prev, ...newItems]);
    setText("");
  };

  const toggleChecked = (index) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        checked: !updated[index].checked,
      };
      return updated;
    });
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const total = items.length;
  const checkedCount = items.filter((item) => item.checked).length;
  const winRate = total > 0 ? ((checkedCount / total) * 100).toFixed(0) : 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          padding: 2,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "500px" },
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            padding: 4,
            boxShadow: darkMode ? 8 : 3,
            backdropFilter: "blur(5px)",
            border: darkMode
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3" textAlign="center" flexGrow={1}>
              BetBuilder
            </Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          <Typography
            variant="body1"
            sx={{ marginTop: 1, textAlign: "center" }}
          >
            Check your bet!
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 2,
            }}
          >
            <TextField
              placeholder="Enter your bet (one per line)"
              required
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit Bet
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClearAll}>
                Clear All
              </Button>
            </Stack>
          </Box>

          <Box sx={{ marginTop: 4 }}>
            {items.map((item, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={item.checked}
                    onChange={() => toggleChecked(index)}
                  />
                }
                label={
                  <span
                    style={{
                      textDecoration: item.checked ? "line-through" : "none",
                      color: item.checked ? "gray" : "inherit",
                    }}
                  >
                    {item.text}
                  </span>
                }
              />
            ))}
          </Box>

          <Typography
            variant="h6"
            sx={{
              marginTop: 3,
              color: checkedCount > 0 ? "#00e676" : "gray",
              textShadow:
                checkedCount > 0
                  ? "0 0 6px rgba(0, 230, 118, 0.7)"
                  : "none",
              textAlign: "center",
            }}
          >
            Win Rate: {winRate}%
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
