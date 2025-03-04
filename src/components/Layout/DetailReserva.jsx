import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Grid from "@mui/material/Grid2";
import ReservaService from "../../services/ReservaService";

export function DetailReserva() {
  const routeParams = useParams();

  console.log(routeParams);

  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    //Llamar al API y obtener una reserva por su id
    ReservaService.getReservaById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log("datosReserva detail", response.data);
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
        <Grid size={7}>
          <Typography variant="h4" component="h1" gutterBottom>
            Detalles de la reserva
          </Typography>
          <Typography variant="h5" component="h1" gutterBottom>
            {data.nombreCrucero}
          </Typography>
          <Typography component="span" variant="h6">
            <Box>Puertos (salida y regreso):</Box>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {data.itinerarioPuertos.map((item) => (
                <ListItemButton key={item.idItinerario}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.puerto.Nombre} - ${item.puerto.pais.descripcion}`}
                    secondary={item.puerto.descripcion}
                  />
                </ListItemButton>
              ))}
            </List>
          </Typography>
          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Fecha de salida:</b> {data.fechaInicio} <br></br>
          </Typography>
          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Fecha de llegada:</b> {data.fechaFinal.date} <br></br>
          </Typography>
          <br></br>

          <Typography component="span" variant="h6">
            <Box>Habitaciones reservadas:</Box>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {data.habitaciones.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItemButton key={item.idHabitacion}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.Descripcion} />
                    <ListItemText secondary={`Cantidad de huéspedes: ${item.cantHuespedes}`} />
                  </ListItemButton>

                </React.Fragment>
              ))}
            </List>
          </Typography>
          <br></br>
          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Total a pagar:</b> {`Total por habitaciones: $${data.totalHabitaciones}`} <br></br>
          </Typography>

          {/* <Typography component="span" variant="subtitle1">
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
          {/* <ListItemButton>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Fecha de salida: ${item.fechaSalida}`}
                      />
                    </ListItemButton> */}

          {/* Sublista de habitaciones con su precio correspondiente
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
                              secondary={`${habitacion.Nombre} - Precio: $${precioHabitacion}`}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </React.Fragment> */}
          {/* ))}
              </List>
            </Typography> */}
        </Grid>
        // </Grid>
      )}
    </Container>
  );
}
