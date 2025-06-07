import * as React from "react";
import "@fontsource/roboto/400.css";
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
  useMediaQuery,
  Grid,
  Paper,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Brightness4, Brightness7, Delete } from "@mui/icons-material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export default function App() {
  const [text, setText] = React.useState("");
  const [items, setItems] = React.useState(() => {
    const stored = localStorage.getItem("betItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [darkMode, setDarkMode] = React.useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#00e676" },
      secondary: { main: "#ff1744" },
      background: {
        default: darkMode ? "#121212" : "#f4f4f4",
        paper: darkMode ? "rgba(255,255,255,0.05)" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      h3: {
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: "2rem",
        "@media (min-width:900px)": {
          fontSize: "3rem",
        },
      },
    },
  });

  const muiTheme = useMuiTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down("sm"));

  React.useEffect(() => {
    localStorage.setItem("betItems", JSON.stringify(items));
  }, [items]);

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

  const handleDelete = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
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
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          backgroundColor: theme.palette.background.default,
          fontSize: isSmallScreen ? "1.5rem" : "3rem"
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            padding: 4,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: darkMode ? 8 : 4,
            border: darkMode
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h3">Bet Builder Checklist</Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Stack>

          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Check your bets before placing them!
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Enter bets (one per line)"
              placeholder="e.g., LeBron to score 25+"
              multiline
              rows={4}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
              <Button type="submit" variant="contained" color="primary">
                Submit Bet
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClearAll}>
                Clear All
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              {items.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    elevation={darkMode ? 0 : 1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 1.5,
                      backgroundColor: item.checked
                        ? "rgba(0, 230, 118, 0.1)"
                        : "inherit",
                      transition: "background 0.3s",
                      "&:hover": {
                        backgroundColor: darkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.checked}
                          onChange={() => toggleChecked(index)}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            textDecoration: item.checked ? "line-through" : "none",
                            color: item.checked ? "gray" : "inherit",
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                    <IconButton onClick={() => handleDelete(index)} size="small">
                      <Delete />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mt: 4,
              color: "#00e676",
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "0 0 6px rgba(0, 230, 118, 0.7)",
            }}
          >
            Win Rate: {winRate}%
          </Typography>

          {total > 0 && checkedCount === total && (
            <Typography sx={{ color: "#00e676", mt: 2, textAlign: "center" }}>
              ✅ All bets reviewed. Good luck!
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
