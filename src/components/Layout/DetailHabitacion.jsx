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
import HabitacionService from "../../services/HabitacionService";
import { CircularProgress } from "@mui/material";


export function DetailHabitacion() {
  const routeParams = useParams();

  console.log("parametro", routeParams);

  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //Llamar al API y obtener una Habitacion
    HabitacionService.getHabitacionById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log("datoshab detail", response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log("error", error);
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);

  if (!loaded) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh", 
        }}
      >
        <CircularProgress />
        <Typography variant="h5" gutterBottom>
          <b>Cargando</b>
        </Typography>
      </Box>
    );
  }
  
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
              alt="Imagen de la habitacion"
              src={data.foto}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data.nombre}
            </Typography>
            <Typography
              variant="subtitle2"
              component="h2"
              gutterBottom
            ></Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Descripción:
              </Box>{" "}
              {data.descripcion}
              <br></br>
              <br></br>
            </Typography>
            <Typography component="span" variant="subtitle1">
              <Box fontWeight="bold">Capacidad de la habitación:</Box>
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
                    primary={`Mínimo de huéspedes: ${data.minHuesped}`}
                  />
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Máximo de huéspedes: ${data.maxHuesped}`}
                  />
                </ListItemButton>
              </List>
            </Typography>
            <ListItemButton>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    Tamaño de habitación: {data.tamanno} m<sup>2</sup>
                  </>
                }
              />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText
                primary={`Categoría de habitación: ${data.cathabitacion.nombre}`}
              />
            </ListItemButton>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
