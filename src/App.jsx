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
import { Brightness4, Brightness7 } from "@mui/icons-material";
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
      .map((line) => ({ text: line, status: "pending" }));

    setItems((prev) => [...prev, ...newItems]);
    setText("");
  };

  const toggleChecked = (index) => {
    setItems((prev) => {
      const updated = [...prev];
      const currentStatus = updated[index].status;
      updated[index] = {
        ...updated[index],
        status: currentStatus === "win" ? "pending" : "win",
      };
      return updated;
    });
  };

  const handleLose = (index) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: "lose",
      };
      return updated;
    });
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const total = items.length;
  const winCount = items.filter((item) => item.status === "win").length;
  const winRate = total > 0 ? ((winCount / total) * 100).toFixed(0) : 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          p: isSmallScreen ? 2 : 4,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            maxWidth: 800,
            width: "100%",
            mx: "auto",
            p: isSmallScreen ? 2 : 4,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: darkMode ? 8 : 4,
            border: darkMode
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h3">Bet Builder Checklist</Typography>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              aria-label="toggle dark mode"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Stack>

          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Did you hit your bet?
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Enter bets (one per line)"
              placeholder="e.g., LeBron to score 25+"
              multiline
              rows={3}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
              <Button type="submit" variant="contained" color="primary">
                Submit Bet
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              mt: 3,
              flex: "1 1 auto",
              
            }}
          >
            <Grid container spacing={1}>
              {items.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    elevation={darkMode ? 0 : 1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 0.5,
                      px: 1,
                      backgroundColor:
                        item.status === "win"
                          ? "rgba(0, 230, 118, 0.1)"
                          : item.status === "lose"
                          ? "rgba(255, 23, 68, 0.1)"
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
                          checked={item.status === "win"}
                          onChange={() => toggleChecked(index)}
                          disabled={item.status === "lose"}
                          sx={{ p: 0.5 }}
                          inputProps={{
                            "aria-label": `Mark bet "${item.text}" as won`,
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            textDecoration:
                              item.status !== "pending"
                                ? "line-through"
                                : "none",
                            color:
                              item.status === "win"
                                ? "green"
                                : item.status === "lose"
                                ? "red"
                                : "inherit",
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                      sx={{
                        m: 0,
                        p: 0,
                        flexGrow: 1,
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleLose(index)}
                      disabled={item.status === "lose"}
                      sx={{ minWidth: 32 }}
                      aria-label={`Mark bet "${item.text}" as lost`}
                    >
                      Lose
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mt: 3,
              color: "#00e676",
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "0 0 6px rgba(0, 230, 118, 0.7)",
            }}
          >
            Win Rate: {winRate}%
          </Typography>

          {total > 0 && winCount === total && (
            <Typography
              sx={{ color: "#00e676", mt: 1, textAlign: "center" }}
              aria-live="polite"
            >
              ✅ All bets won! Great job!
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
