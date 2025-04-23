import React from "react";
import { Container, Typography, Box, Link } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

export function Footer() {
  return (
    <footer>
      <Toolbar
        sx={{
          px: 2,
          position: "relative", 
          bottom: 0,
          width: "100%",
          backgroundColor: "primary.main",
          py: 1,
          // height: "auto",
        }}
      >
        <Container>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            {/* Información del negocio */}
            <Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                CRuceros Adventure
              </Typography>
              <Typography sx={{ color: "white" }}>
                Dirección: Puntarenas, puerto central
              </Typography>
              <Typography sx={{ color: "white" }}>
                Teléfono:{" "}
                <Link
                  href="tel:+50624420002"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  +506 24420002
                </Link>
              </Typography>
            </Box>

            {/* Redes sociales */}
            <Box>
              <Typography variant="subtitle1" sx={{ color: "white", mb: 0.5 }}>
                Síguenos
              </Typography>
              <Box display="flex" alignItems="center">
                <Link
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "white",
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FacebookIcon sx={{ mr: 0.5 }} /> Facebook
                </Link>
                <Link
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  sx={{ color: "white", display: "flex", alignItems: "center" }}
                >
                  <InstagramIcon sx={{ mr: 0.5 }} /> Instagram
                </Link>
              </Box>
            </Box>

            {/* Enlaces y créditos */}
            <Box textAlign="right">
              <Typography variant="body2" sx={{ color: "white" }}>
                © 2025, CRuceros Adventure. Todos los derechos reservados.
              </Typography>
              <Typography sx={{ color: "white" }}>
                <Link href="" sx={{ color: "white" }}>
                  Contacto
                </Link>{" "}
                |{" "}
                <Link href="" sx={{ color: "white" }}>
                  Política de Reservas y Devoluciones
                </Link>
              </Typography>
              <Typography sx={{ color: "white" }}>
                Alejandro Rodríguez - Brian Kellerman - Daniel Carballo
              </Typography>
            </Box>
          </Box>
        </Container>
      </Toolbar>
    </footer>
  );
}
