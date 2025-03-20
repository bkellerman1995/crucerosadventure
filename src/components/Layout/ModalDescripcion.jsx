import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";

export function ModalDescripcion({ open, handleClose, nombrePuerto, paisPuerto, diaIndex, resetSelect }) {
  
  // Función para cerrar el modal y resetear valores del select
  const handleModalClose = () => {
    if (resetSelect && diaIndex !== null) {
      resetSelect(diaIndex - 1); // Llama a la función para resetear el select
    }
    handleClose(); // Cierra el modal
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
        <Typography variant="h5">
          <b>Gestionar Descripción</b>
        </Typography>
        <Typography>
          Día: {diaIndex} <br />
          Puerto: {nombrePuerto ?? "No seleccionado"} <br />
          País: {paisPuerto ?? "No seleccionado"}
        </Typography>
        <Button
          onClick={handleModalClose}
          sx={{
            mt: 3,
            backgroundColor: "#16537e",
            color: "white",
            "&:hover": { backgroundColor: "#133d5a" },
            width: "200px",
            height: "40px",
            fontSize: "0.9rem",
            mx: "auto",
            display: "block",
          }}
        >
          Cerrar
        </Button>

        {/* Botón de Cerrar en la Esquina Superior Derecha */}
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
      </Box>
    </Modal>
  );
}

// Validación de las props con PropTypes
ModalDescripcion.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  resetSelect: PropTypes.func,
  nombrePuerto: PropTypes.string, 
  paisPuerto: PropTypes.string,
  diaIndex: PropTypes.number.isRequired,
};
