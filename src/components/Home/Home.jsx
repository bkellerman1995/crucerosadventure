import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
export function Home() {
  return (
    <Container sx={{ p: 2 }} maxWidth="sm">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        CRuceros Adventure
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary">
        Reserva un viaje en crucero.
      </Typography>
      <img src="../uploads/LogoCrucerosAdventure.png" />
    </Container>
  );
}
