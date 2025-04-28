import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Grid,
  Paper,
  CardMedia,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoCalendarNumber } from "react-icons/io5";
import { MdBedroomParent } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import { format, addDays } from "date-fns";
import CrucerosService from "../../services/CrucerosService";
import { CircularProgress } from "@mui/material";


export function DetailCrucero() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    CrucerosService.getCrucerobyId(id)
      .then((response) => {
        setData(response.data);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error);
        setLoaded(true);
      });
  }, [id]);

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
  
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 2,
          background: "linear-gradient(to right, #f0f8ff, #e6f7ff)",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#00304E" }}
            >
              {data.nombre}
            </Typography>

            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#e0f7fa",
                width: "auto",
                height: "auto",
              }}
            >
              <Box sx={{ backgroundColor: "white", borderRadius: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                >
                  Itinerario
                </Typography>
              </Box>
              {data.puertosItinerario && data.puertosItinerario.length > 0 ? (
                <Swiper
                  navigation
                  modules={[Navigation]}
                  className="mySwiper"
                  style={{ width: "100%", height: "450px" }}
                >
                  {data.puertosItinerario.map((actividad, index) => (
                    <SwiperSlide key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body5"
                            sx={{ fontWeight: "bold", fontSize: 18 }}
                          >
                            Día {actividad.dia} - {actividad.puerto.nombre}
                          </Typography>

                          <Box sx ={{backgroundColor:"#5E5E5E", borderRadius: 2, paddingLeft: 1, justifyContent:"center",marginTop: 1}}>
                            <Typography variant="body1" sx={{ mt: 1, color: "white" }}>
                              {actividad.descripcion}
                            </Typography>
                          </Box>

                          <br />
                          <CardMedia
                            component="img"
                            image={actividad.puerto.foto}
                            alt={`Puerto ${actividad.nombre}`}
                            sx={{
                              width: "auto",
                              height: 250,
                              borderRadius: 2,
                              marginLeft: 8,
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        ></Grid>
                      </Grid>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Typography variant="body2">
                  No hay puertos disponibles
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Detalles */}
          <Grid item xs={12} md={7} sx={{ ml: 0 }}>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              <b>Cantidad de días:</b> {data.cantDias}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <b>Barco:</b> {data.barco.nombre}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Fechas y precios:
              </Typography>
              <List>
                {data.fechasPreciosHabitaciones &&
                data.fechasPreciosHabitaciones.length > 0 ? (
                  data.fechasPreciosHabitaciones
                    .reduce((acc, fecha) => {
                      const fechaExistente = acc.find(
                        (item) => item.fechaSalida === fecha.fechaSalida
                      );
                      if (fechaExistente) {
                        fechaExistente.precios.push(fecha);
                      } else {
                        acc.push({
                          fechaSalida: fecha.fechaSalida,
                          precios: [fecha],
                        });
                      }
                      return acc;
                    }, [])
                    .map((fechaGroup, index) => (
                      <React.Fragment key={index}>
                        <ListItemButton>
                          <ListItemIcon>
                            <IoCalendarNumber color="black" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${format(addDays(new Date(fechaGroup.fechaSalida), 1), "dd/MM/yyyy")}`}
                          />
                        </ListItemButton>
                        <List component="div" disablePadding>
                          {fechaGroup.precios.map((precio) => {
                            const habitacion = data.habitaciones.find(
                              (h) => h.idHabitacion === precio.idHabitacion
                            );
                            return (
                              <ListItemButton
                                key={precio.idHabitacion}
                                sx={{ pl: 10 }}
                              >
                                <ListItemIcon>
                                  <MdBedroomParent color="black" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    habitacion
                                      ? habitacion.nombre
                                      : "No disponible"
                                  }
                                  secondary={`$${precio.precio}`}
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
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
