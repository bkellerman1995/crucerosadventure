import React from "react";
import Container from "@mui/material/Container";
// Importaciones de Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { format } from 'date-fns';
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
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


  //Estado para cargar el crucero por medio de su id
  useEffect(() => {
    //Llamar al API y obtener una crucero
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
    <Container component="main" sx={{ mt: 8, mb: 2, paddingRight: 40 }}>
      {data && (
        <>
          <Grid container spacing={0} direction="row" sx={{ mb: 2 }}>
            <Grid size={5}>
              <Box
                component="img"
                sx={{
                  borderRadius: "4%",
                  maxWidth: "100%",
                  height: "300px",
                }}
                alt="Detalle del crucero"
                src={data.foto}
              />
            </Grid>
            <Grid item xs={12} md={7}>
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

              <Typography component="span" variant="subtitle1">
                <Box fontWeight="bold">Fechas de salida:</Box>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  {data.fechasPreciosHabitaciones &&
                  data.fechasPreciosHabitaciones.length > 0 ? (
                    data.fechasPreciosHabitaciones.map((item) => (
                      <React.Fragment key={item.id}>
                        {/* Elemento principal: Fecha de salida */}
                        <ListItemButton>
                          <ListItemIcon>
                            <StarIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${format(new Date(item.fechaSalida), 'dd/MM/yyyy')}`}
                          />
                        </ListItemButton>

                        {/* Sublista de habitaciones con su precio correspondiente */}
                        <List component="div" disablePadding>
                          {data.habitaciones.map((habitacion) => {
                            // Buscar el precio correspondiente en fechasPreciosHabitaciones
                            const precioHabitacion = item.precioHabitacion;

                            return (
                              <ListItemButton
                                key={habitacion.id}
                                sx={{ pl: 10 }}
                              >
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
                    ))
                  ) : (
                    <Typography variant="body2">
                      No hay fechas disponibles
                    </Typography>
                  )}
                </List>
              </Typography>
            </Grid>
          </Grid>
          <br></br>

          <Grid
            container
            spacing={2}
            sx={{ backgroundColor: "#d4f1f4", borderRadius: "10px" }}
          >
            {/* Título de Itinerario */}
            <Typography variant="h6" component="h4" gutterBottom>
              <Box fontWeight="bold">Itinerario</Box>
            </Typography>

            {/* Contenedor del Swiper */}
            <Grid container spacing={2} sx={{ ml: 0 }}>
              {data.puertosItinerario && data.puertosItinerario.length > 0 ? (
                <Swiper
                  navigation={true} // Activa los controles de navegación
                  modules={[Navigation]}
                  className="mySwiper"
                  style={{
                    width: "100%",
                    height: "250px",
                    position: "relative",
                  }} // Ajusta el tamaño del Swiper
                >
                  {data.puertosItinerario.map((actividad, index) => (
                    <SwiperSlide key={index}>
                      <Grid
                        container
                        sx={{ position: "relative", width: "100%" }}
                      >
                        {/* Imagen de la actividad a la izquierda */}
                        <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            sx={{
                              width: "100%",
                              height: "300px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginLeft: "150px",
                              paddingBottom: "60px",
                            }}
                            alt={`Puerto ${actividad.nombre}`}
                            src={actividad.puerto.foto}
                          />
                          {/* Botones de navegación dentro de la imagen */}

                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "10px",
                              zIndex: 2,
                              transform: "translateY(-50%)",
                            }}
                          >
                            {/* Botón de navegación izquierdo*/}
                          </Box>

                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              right: "10px",
                              zIndex: 2,
                              transform: "translateY(-50%)",
                            }}
                          >
                            {/* Botón de navegación derecho */}
                          </Box>
                        </Grid>

                        {/* Información del puerto a la derecha */}
                        <Grid
                          item
                          xs={12}
                          md={3}
                          sx={{ paddingLeft: 30, position: "relative" }}
                        >
                          <Box
                            sx={{
                              padding: "10px",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              borderRadius: "8px",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold" }}
                            >
                              Día {actividad.dia}: {actividad.puerto.nombre}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {actividad.descripcion}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Typography variant="body2">
                  No hay puertos disponibles
                </Typography>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
