import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ModalInfoHuesped } from "./ModalInfoHuesped";
import ItinerarioService from "../../services/ItinerarioService";
import PropTypes from "prop-types";

export function ModalGestionHuespedes({
  open,
  handleClose,
  maxHuespedes,
  control,
  idHabitacion,
  eliminarHabitacionSeleccionada
}) {
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState("");
  const [openModalInfoHuesped, setOpenModalInfoHuesped] = useState(false);
  const [infoHuesped, setInfoHuesped] = useState (null);

  useEffect(() => {
    if (open && maxHuespedes > 0) {
      console.log ("Cant. Huéspedes máxima recibida: ", maxHuespedes);
      console.log ("ID de habitación recibida: ", idHabitacion);
    }
  }, [open, maxHuespedes]);

  //Abrir confirm Dialog en caso de que
  //se quiera cerrar el modal
  const handleModalClose = () => {
    setOpenConfirmDialog(true);
  };

  const confirmarCerrarYEliminar = () => {
    setOpenConfirmDialog(false);
    //Llamar a la función para eliminar la habitación seleccionada
    //del listbox "Habitaciones seleccionadas"
    eliminarHabitacionSeleccionada(idHabitacion);
    handleClose();
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          maxWidth: "900px",
          maxHeight: "80vh",
          overflowY: "auto",
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
          <b>Gestión de huéspedes</b>
        </Typography>
        <br />

        <Grid container spacing={2}>
          {[...Array(Number(maxHuespedes))].map((_, index) => {
            // Asegurarte de que maxHuespedes sea un número
            console.log("Tipo de maxHuespedes: ", typeof maxHuespedes);
            return (
              <Grid item xs={12} key={index}>
                <Grid
                  container
                  alignItems="center"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "nowrap",
                  }}
                >
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minWidth: "120px",
                      marginRight: "10px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ whiteSpace: "nowrap", marginRight: "-40px" }}
                    >
                      Huésped {index + 1}
                    </Typography>
                  </Grid>

                  {/* Información del huésped */}
                  <Grid
                    item
                    sx={{
                      flexGrow: 1,
                      minwidth: "400px",
                      maxWidth: "450px",
                      paddingLeft: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#D3D3D3", // Fondo gris
                        padding: 1, // Espaciado dentro del Box
                        borderRadius: 1, // Esquinas redondeadas (opcional)
                      }}
                    >
                      <Typography variant="subtitle3">
                        Información del huésped
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item sx={{ flexShrink: 0, ml: 35 }}>
                    <Button
                      type="button"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "blue",
                        color: "white",
                        "&:hover": { backgroundColor: "darkblue" },
                        width: "auto",
                        minWidth: "180px",
                        height: "40px",
                      }}
                      onClick={() => {
                        setOpenModalInfoHuesped(true);

                      }}
                    >
                      Gestionar Huésped
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>

        <ModalInfoHuesped
          open={openModalInfoHuesped}
          handleClose={() => setOpenModalInfoHuesped(false)}
          idHabitacion = {idHabitacion}
          infoHuesped = {infoHuesped}
        />

        <Button
          variant="contained"
          // onClick={handleConfirmar}
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
          fullWidth
        >
          Confirmar
        </Button>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>¿Desea salir sin guardar?</DialogTitle>
          <DialogActions>
            <Button onClick={confirmarCerrarYEliminar} color="error">
              Sí
            </Button>
            <Button onClick={() => setOpenConfirmDialog(false)}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}

ModalGestionHuespedes.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  maxHuespedes: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  setCruceroCreado: PropTypes.func.isRequired,
  setPuertosItinerario: PropTypes.func.isRequired,
  idHabitacion: PropTypes.number.isRequired,
  eliminarHabitacionSeleccionada: PropTypes.func.isRequired,
};
