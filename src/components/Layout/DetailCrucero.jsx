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
  Card,
  CardMedia,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { format } from "date-fns";
import CrucerosService from "../../services/CrucerosService";

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
          {/* Imagen del crucero */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={data.foto}
                alt="Imagen del crucero"
                sx={{ height: "100%", objectFit: "cover" }}
              />
            </Card>
          </Grid>

          {/* Detalles */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#00304E" }}
            >
              {data.nombre}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              <b>Días de viaje:</b> {data.cantDias}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <b>Barco asociado:</b> {data.barco.nombre}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
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
                            <StarIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${format(new Date(fechaGroup.fechaSalida), "dd/MM/yyyy")}`}
                          />
                        </ListItemButton>
                        <List component="div" disablePadding>
                          {fechaGroup.precios.map((precio) => {
                            const habitacion = data.habitaciones.find(
                              (h) => h.idHabitacion === precio.idHabitacion
                            );
                            return (
                              <ListItemButton key={precio.idHabitacion} sx={{ pl: 10 }}>
                                <ListItemIcon>
                                  <ArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={habitacion ? habitacion.nombre : "No disponible"}
                                  secondary={`$${precio.precio}`}
                                />
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </React.Fragment>
                    ))
                ) : (
                  <Typography variant="body2">No hay fechas disponibles</Typography>
                )}
              </List>
            </Box>
          </Grid>
        </Grid>

        <Box mt={6}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Itinerario
          </Typography>

          <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#e0f7fa" }}>
            {data.puertosItinerario && data.puertosItinerario.length > 0 ? (
              <Swiper
                navigation
                modules={[Navigation]}
                className="mySwiper"
                style={{ width: "100%", height: "350px" }}
              >
                {data.puertosItinerario.map((actividad, index) => (
                  <SwiperSlide key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CardMedia
                          component="img"
                          image={actividad.puerto.foto}
                          alt={`Puerto ${actividad.nombre}`}
                          sx={{ width: "100%", height: 300, borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          Día {actividad.dia}: {actividad.puerto.nombre}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {actividad.descripcion}
                        </Typography>
                      </Grid>
                    </Grid>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Typography variant="body2">No hay puertos disponibles</Typography>
            )}
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
}
