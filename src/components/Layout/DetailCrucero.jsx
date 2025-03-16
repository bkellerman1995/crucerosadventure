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
import CrucerosService from "../../services/CrucerosService";

export function DetailCrucero() {
  const routeParams = useParams();

  console.log(routeParams);

  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //Llamar al API y obtener una pelicula
    CrucerosService.getCrucerobyId(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log("detalle crucero", response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("datos del crucero", data);

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
              alt="Detalle del crucero"
              src={data.foto}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data.nombre}
            </Typography>
            <Typography
              variant="subtitle1"
              component="h1"
              gutterBottom
            ></Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Cantidad de días:
              </Box>{" "}
              {data.cantDias}
            </Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Nombre del barco:
              </Box>{" "}
              {data.barco.nombre}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h4" gutterBottom>
              <Box fontWeight="bold">Itinerario:</Box>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                Puertos
                {data.puertos.map((item) => (
                  <ListItemButton key={item.puerto}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${item.puerto.nombre} - ${item.puerto.pais.descripcion}`}
                      secondary={item.puerto.descripcion}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Typography>
            <Typography component="span" variant="subtitle1">
              <Box fontWeight="bold">Fechas de salida:</Box>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {data.fechasPreciosHabitaciones.map((item) => (
                  <React.Fragment key={item.id}>
                    {/* Elemento principal: Fecha de salida */}
                    <ListItemButton>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Fecha de salida: ${item.fechaSalida}`}
                      />
                    </ListItemButton>

                    {/* Sublista de habitaciones con su precio correspondiente */}
                    <List component="div" disablePadding>
                      {data.habitaciones.map((habitacion) => {
                        // Buscar el precio correspondiente en fechasPreciosHabitaciones
                        const precioHabitacion = item.precioHabitacion;

                        return (
                          <ListItemButton key={habitacion.id} sx={{ pl: 10 }}>
                            <ListItemIcon>
                              <ArrowRightIcon />
                            </ListItemIcon>
                            <ListItemText
                              secondary={`${habitacion.nombre} - Precio: $${precioHabitacion}`}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </React.Fragment>
                ))}
              </List>
            </Typography>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
