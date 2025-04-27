import React from "react";
import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import HabitacionDisponibleFechaService from "../../services/HabitacionDisponibleFechaService";

export function ModalDisponibilidadHabitaciones({ open, handleClose,idCrucero,fechaSeleccionada}) {
  
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);

  //Use Effect para renderizar las habitaciones disponibles
  useEffect(() => {
    if (idCrucero && fechaSeleccionada) {
      console.log("idCrucero recibido en el modal:", idCrucero);
      console.log("fechaSeleccionada recibida en el modal:", fechaSeleccionada.value);
      HabitacionDisponibleFechaService.getDisponibilidadHabitacionPorFechaByCrucero(
        idCrucero,
        fechaSeleccionada.value
      )
        .then((response) => {
          // Forzar el manejo de código de estado dentro de .then() para no entrar en el catch
          // console.log("Respuesta del servidor:", response);

          if (response.status >= 200 && response.status < 300) {
            // Si la respuesta es correcta
            setData(response.data);
            console.log("Habitaciones disponibles:", data);
          }
        })
        .catch((error) => {
          // Manejar el error si ocurre fuera de los casos normales
          console.error(
            "Error al obtener las habitaciones disponibles:",
            error
          );
          toast.error("Hubo un error al obtener las habitaciones disponibles.");
        });
    }
  }, [idCrucero, fechaSeleccionada]);

  // Función para cerrar el modal
  const handleModalClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleClose(); // Solo cerrar si no es un clic en el backdrop
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          maxWidth: "600px",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Button
          onClick={handleModalClose}
          sx={{
            position: "absolute",
            top: "5px",
            right: "5px",
            minWidth: "30px",
            height: "30px",
            backgroundColor: "#16537e",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "darkred" },
            zIndex: 1000,
          }}
        >
          ✕
        </Button>

        <Typography variant="h4" component="h2">
          <b>Disponibilidad de habitaciones</b>
        </Typography>

        <Grid container sx={{ p: 2 }} spacing={3}>
          {/* ()=>{} */}
          {data &&
            data.map((item) => (
              <Grid size={5} key={item.idCrucero}>
                <Card className="tarjetaCrucero">
                  <CardHeader
                    className="cardHeader"
                    sx={{ p: 0 }}
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      padding: 8,
                    }}
                    title={item.nombre}
                  />
                  <Typography variant="body2" color="text.secondary">
                    <span></span>
                  </Typography>

                  <CardMedia
                    // className="card"
                    sx={{ height: 100 }}
                    component="img"
                    image={item.foto}
                    alt="Foto de la habitación"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      <span>
                        <b>Precio: </b> ${item.precio}
                      </span>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <span>
                        <b>Mínimo de huéspedes: </b>
                        {item.minHuesped}
                      </span>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <span>
                        <b>Máximo de huéspedes: </b>
                        {item.maxHuesped}
                      </span>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <span>
                        <b>Categoría: </b>
                        {item.nombreCategoria}
                      </span>
                    </Typography>
                  </CardContent>

                  <CardActions
                    disableSpacing
                    sx={{
                      backgroundColor:
                        item.disponible === "1" ? "#4caf50" : "#f44336",
                      color: "white",
                    }}
                  >
                    <Typography
                      textAlign="center"
                      variant="body2"
                      color="white"
                    >
                      <span>
                        <b>
                          {item.disponible === "1"
                            ? "Disponible"
                            : "No disponible"}{" "}
                        </b>
                      </span>
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Modal>
  );
}

// Validación de las props con PropTypes
ModalDisponibilidadHabitaciones.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  idCrucero: PropTypes.number.isRequired,
  fechaSeleccionada: PropTypes.object.isRequired,
};
