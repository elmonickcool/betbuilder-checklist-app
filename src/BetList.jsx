import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";

export default function BetList() {
  const [items, setItems] = React.useState(() => {
    const stored = localStorage.getItem("betItems");
    return stored ? JSON.parse(stored) : [];
  });

  const updateItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem("betItems", JSON.stringify(newItems));
  };

  const toggleChecked = (index) => {
    const updated = [...items];
    const currentStatus = updated[index].status;
    updated[index].status = currentStatus === "win" ? "pending" : "win";
    updateItems(updated);
  };

  const handleLose = (index) => {
    const updated = [...items];
    updated[index].status = "lose";
    updateItems(updated);
  };

  const handleClearAll = () => {
    updateItems([]);
  };

  const total = items.length;
  const winCount = items.filter((item) => item.status === "win").length;
  const winRate = total > 0 ? ((winCount / total) * 100).toFixed(0) : 0;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Grid container spacing={1}>
        {items.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Paper
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor:
                  item.status === "win"
                    ? "rgba(0, 230, 118, 0.1)"
                    : item.status === "lose"
                    ? "rgba(255, 23, 68, 0.1)"
                    : "inherit",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.status === "win"}
                    onChange={() => toggleChecked(index)}
                    disabled={item.status === "lose"}
                  />
                }
                label={
                  <Box>
                    <Typography variant="caption">{item.game}</Typography>
                    <Typography
                      sx={{
                        textDecoration:
                          item.status !== "pending" ? "line-through" : "none",
                        color:
                          item.status === "win"
                            ? "green"
                            : item.status === "lose"
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                }
              />
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => handleLose(index)}
                disabled={item.status === "lose"}
              >
                Lose
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="h6"
        sx={{ mt: 3, textAlign: "center", fontWeight: "bold", color: "#00e676" }}
      >
        Win Rate: {winRate}%
      </Typography>
      {total > 0 && winCount === total && (
        <Typography sx={{ color: "#00e676", textAlign: "center" }}>
          ✅ All bets won! Great job!
        </Typography>
      )}

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button variant="outlined" color="secondary" onClick={handleClearAll}>
          Clear All
        </Button>
      </Box>
    </Box>
  );
}
