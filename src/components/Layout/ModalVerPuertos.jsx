import React from 'react';
import { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, } from '@mui/material';
import PuertoService from "../../services/PuertoService";
import PropTypes from 'prop-types';

// Importaciones de Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export function ModalVerPuertos({ open, handleClose}) {
  //Hooks Lista de puertos
  const [dataPuerto, setDataPuerto] = useState({});
  const [loadedPuerto, setLoadedPuerto] = useState(false);

  //Hooks de control de errores
  const [error, setError] = useState("");

  useEffect(() => {
    PuertoService.getPuertos()
      .then((response) => {
        console.log("datos puerto", response);
        setDataPuerto(response.data);
        setLoadedPuerto(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedPuerto(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw", // Expandir modal
          maxWidth: "900px",
          maxHeight: "80vh", //Limitar la altura del modal
          overflowY: "auto", //
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Botón de Cerrar en la Esquina Superior Derecha */}
        <Button
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "5px",
            right: "5px",
            minWidth: "30px",
            height: "30px",
            backgroundColor: "blue",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "darkred" },
            zIndex: 1000, // Asegura que el botón esté por encima de otros elementos
          }}
        >
          ✕
        </Button>

        {/* Título */}
        <Typography variant="h4" component="h2">
          <b>Puertos</b>
        </Typography>
        <br></br>

        {/* Carrusel con imágenes de los puertos */}
        {loadedPuerto == true ? (
          <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
            {dataPuerto.map((puerto, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={puerto.foto}
                    alt={`Puerto ${puerto.nombre}`}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    <b>
                      {puerto.nombre} - {puerto.pais.descripcion}
                    </b>
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Typography color="error">
            <b>No hay puertos registrados disponibles.</b>
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

// Validación de las props con PropTypes
ModalVerPuertos.propTypes = {
  open: PropTypes.bool.isRequired, // 'open' debe ser un booleano obligatorio
  handleClose: PropTypes.func.isRequired

};

