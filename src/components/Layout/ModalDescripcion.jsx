import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";


export function ModalDescripcion({ open, handleClose, nombrePuerto, paisPuerto, diaIndex }) {  return (
  <Modal open={open} onClose={handleClose}>
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
        <b>Agregar Descripción</b>
      </Typography>
      <Typography>
        Día: {diaIndex} <br />
        Puerto: {nombrePuerto ?? "No seleccionado"} <br />
        País: {paisPuerto ?? "No seleccionado"}
      </Typography>
      <Button
        onClick={handleClose}
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
    </Box>
  </Modal>
);
}

// Validación de las props con PropTypes
ModalDescripcion.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  nombrePuerto: PropTypes.string,  // Nuevo prop para el nombre del puerto
  paisPuerto: PropTypes.string,    // Nuevo prop para el nombre del país
  diaIndex: PropTypes.number.isRequired,
};
