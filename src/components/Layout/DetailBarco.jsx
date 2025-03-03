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
import Grid from "@mui/material/Grid2";
import BarcoService from "../../services/BarcoService";

export function DetailBarco() {
  const routeParams = useParams();

  console.log("parametro", routeParams);

  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //Llamar al API y obtener una Barco
    BarcoService.getBarcobyId(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log("datosbarco detail", response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log("error", error);
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <Grid container spacing={2}>
          <Grid size={5}>
            <Box
              component="img"
              sx={{
                borderRadius: "4%",
                maxWidth: "100%",
                height: "auto",
              }}
              alt="Imagen de la Barco"
              src={"../../uploads/habitacion1.jpg"}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data.Nombre}
            </Typography>
            <Typography
              variant="subtitle2"
              component="h2"
              gutterBottom
            ></Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Descripcion:
              </Box>{" "}
              {data.Descripcion}
            </Typography>
            <Typography component="span" variant="subtitle1">
              <Box fontWeight="bold">Informacion del Barco:</Box>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "#e5e5e5",
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Cantidad habitacion: ${data.cantHabitaciones}`}
                  />
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Máximo de huespedes: ${data.capacidadHuesped}`}
                  />
                </ListItemButton>
              </List>
            </Typography>
            <ListItemButton>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary={`Tamaño de habitación: ${data.descripcion}`} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
          
            </ListItemButton>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
