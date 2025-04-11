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
  const [huespedesContador, setHuespedesContador] = useState(0); // Estado para contar huéspedes añadidos
  
  // Estado para un array de longitud "maxHuespedes" que gestiona 
  // cada huesped que se gestione en el modal

  const [huespedes, setHuespedes] = useState(
    Array.from({ length: maxHuespedes }, () => ({ nombre: null, gestionado: false })) // Estado inicial con 'null' para nombre y 'false' para gestionado
  );

  const [selectedHuespedIndex, setSelectedHuespedIndex] = useState(null); // Para seleccionar un huésped dentro del array 

  useEffect(() => {
    if (open && maxHuespedes > 0) {
      console.log ("Cant. Huéspedes máxima recibida: ", maxHuespedes);
      console.log ("ID de habitación recibida: ", idHabitacion);
    }
  }, [open, maxHuespedes, infoHuesped]);


  const handleModalClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleClose();  // Solo cerrar si no es un clic en el backdrop
    }
  };

  const handleGestionHuesped = (index) => {

    setSelectedHuespedIndex(index); // Guardar el índice del huésped a gestionar
    setOpenModalInfoHuesped(true); // Abrir el modal de gestión de huésped
  }

  // Callback para actualizar un huésped específico
  const actualizarHuesped = (index, nuevoHuesped) => {
    const updatedHuespedes = [...huespedes];
    // Actualizar el huésped solo en el índice correspondiente
    updatedHuespedes[index] = { ...updatedHuespedes[index], ...nuevoHuesped }; 
    setHuespedes (updatedHuespedes);
  }

  const confirmarCerrarYEliminar = () => {
    setOpenConfirmDialog(false);
    //Llamar a la función para eliminar la habitación seleccionada
    //del listbox "Habitaciones seleccionadas"
    eliminarHabitacionSeleccionada(idHabitacion);
    handleClose();
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      slotProps={{
        backdrop: {
          onClick: (e) => e.stopPropagation(), // Evitar que el fondo cierre el modal
        },
      }}
    >
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
                        {huespedes[index]?.nombre ||
                          "Información no disponible"}
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
                      disabled={!!huespedes[index]?.nombre} // Deshabilita el botón si la información del huesped está disponible
                      onClick={() => handleGestionHuesped(index)}
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
          idHabitacion={idHabitacion}
          infoHuesped={huespedes[selectedHuespedIndex]} // Pasar el huésped seleccionado al modal
          setInfoHuesped={(nuevoHuesped) =>
            actualizarHuesped(selectedHuespedIndex, nuevoHuesped)
          } // Actualiza solo el huésped gestionado        />
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
  idHabitacion: PropTypes.number.isRequired,
  eliminarHabitacionSeleccionada: PropTypes.func.isRequired,
};
