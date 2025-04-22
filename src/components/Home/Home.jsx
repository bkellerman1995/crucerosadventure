import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
export function Home() {
  return (
    <Container
      maxWidth="100%"
      style={{ position: "relative", padding:0, margin: 0 }}
    >
      {/* Video de fondo o en la parte superior */}
      <div
        style={{
          position: "absolute",
          width: "105%",
          marginLeft: -30,
          height: "100vh", // Hace que el video cubra toda la altura de la pantalla
          top: 0,
          left: 0,
          zIndex: -1, // Para poner el video en el fondo
        }}
      >
        <video
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          loop
          muted
        >
          <source src="../uploads/videoCrucero3.mp4" type="video/mp4" />
          Tu navegador no soporta el formato de video.
        </video>
      </div>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        gutterBottom
        style={{ color: "white" }}
      >
        CRuceros Adventure
      </Typography>
      <Typography style={{ color: "white" }} variant="h5" align="center">
        Reserva un viaje en crucero.
      </Typography>
    </Container>
  );
}
