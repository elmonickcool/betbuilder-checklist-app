import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

export default function BetForm() {
  const [gameName, setGameName] = React.useState("");
  const [text, setText] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (!gameName.trim()) {
      alert("Please enter a game name.");
      return;
    }

    const stored = localStorage.getItem("betItems");
    const items = stored ? JSON.parse(stored) : [];

    const newItems = lines
      .filter(
        (line) =>
          !items.some(
            (item) => item.text === line && item.game === gameName.trim()
          )
      )
      .map((line) => ({ game: gameName.trim(), text: line, status: "pending" }));

    localStorage.setItem("betItems", JSON.stringify([...items, ...newItems]));
    setText("");
    setGameName("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto" }}>
      <TextField
        label="Game Name"
        fullWidth
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Enter bets (one per line)"
        multiline
        rows={3}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit Bet
        </Button>
      </Stack>
    </Box>
  );
}
