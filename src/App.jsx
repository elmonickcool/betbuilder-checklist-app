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
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function App() {
  const [text, setText] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [darkMode, setDarkMode] = React.useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
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
        minHeight="100vh"
        padding={2}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width={{ xs: "100%", sm: "500px" }}
        >
          <Typography variant="h3" textAlign="center" flexGrow={1}>
            BetBuilder
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ marginTop: 1, textAlign: "center" }}>
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
            width: { xs: "100%", sm: "500px" },
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
            <Button type="submit" variant="contained">
              Submit
            </Button>
            <Button variant="outlined" color="error" onClick={handleClearAll}>
              Clear All
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            marginTop: 4,
            width: { xs: "100%", sm: "500px" },
          }}
        >
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

        <Typography variant="h6" sx={{ marginTop: 3 }}>
          Win Rate: {winRate}%
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
