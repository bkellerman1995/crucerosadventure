import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import BarcoService from "../../services/BarcoService";

export function DetailBarco() {
  const { id } = useParams();

  // Estado para el API
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    BarcoService.getBarcobyId(id)
      .then((response) => {
        setData(response.data);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error);
        setLoaded(true);
      });
  }, [id]);

  if (!loaded) return <Typography>Cargando...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(to right, #f0f8ff, #e6f7ff)",
        }}
      >
        <Grid container spacing={4}>
          {/* Sección de imagen */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={data.foto}
                alt="Imagen del barco"
                sx={{ height: "100%", objectFit: "cover" }}
              />
            </Card>
          </Grid>

          {/* Sección de detalles */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#00304E" }}
            >
              {data.Nombre}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {data.descripcion}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Información del Barco:
              </Typography>
              <List>
                <ListItemButton>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`Nombre: ${data.nombre}`} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`Capacidad de Huéspedes: ${data.capacidadHuesped}`} />
                </ListItemButton>
              </List>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Habitaciones:
              </Typography>
              <List>
                {data.habitaciones.map((item) => (
                  <ListItemButton key={item.idHabitacion}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.nombre} />
                  </ListItemButton>
                ))}
              </List>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Cantidad de Habitaciones Disponibles: {data.cantHabitaciones}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
