import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import PuertoService from "../../services/PuertoService";
import { SelectPuerto } from "./SelectPuerto";
import { Controller } from "react-hook-form";
import { ModalDescripcion } from "./ModalDescripcion";
import ItinerarioService from "../../services/ItinerarioService";

import PropTypes from "prop-types";

export function ModalGestionPuertos({ open, handleClose, cantDias, control}) {
  const [dataPuerto, setDataPuerto] = useState({});
  const [loadedPuerto, setLoadedPuerto] = useState(false);
  const [idItinerario, setIdItinerario] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState("");
  const [openModalDesc, setOpenModalDesc] = useState(false);
  const [selectedPuerto, setSelectedPuerto] = useState({});
  const [selectedDiaIndex, setSelectedDiaIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  // Crear itinerario al abrir modal
  useEffect(() => {
    if (open && !idItinerario) {
      const nuevo = { estado: 1 };
      ItinerarioService.createItinerario(nuevo)
        .then((res) => {
          if (res?.data?.idItinerario) {
            setIdItinerario(res.data.idItinerario);
            console.log("Itinerario creado:", res.data.idItinerario);
          }
        })
        .catch((err) => console.error("Error al crear itinerario:", err));
    }
  }, [open]);

  const handleModalClose = () => {
    setOpenConfirmDialog(true);
  };

  const confirmarCerrarYEliminar = () => {
    if (idItinerario) {
      ItinerarioService.deleteItinerario(idItinerario)
        .then(() => console.log("Itinerario eliminado"))
        .catch((err) => console.error("Error al eliminar:", err));
    }
    setIdItinerario(null);
    setSelectedPuerto({});
    setSelectedDiaIndex(null);
    if (control && control.setValue) {
      for (let i = 0; i < cantDias; i++) {
        control.setValue(`puerto-${i}`, null);
      }
    }
    setOpenConfirmDialog(false);
    handleClose();
  };

  const resetSelect = (index) => {
    setSelectedPuerto((prevState) => {
      const newState = { ...prevState };
      delete newState[index];
      return newState;
    });
    if (control && control.setValue) {
      control.setValue(`puerto-${index}`, null);
    }
  };

  useEffect(() => {
    PuertoService.getPuertos()
      .then((response) => {
        setDataPuerto(response.data);
        setLoadedPuerto(true);
      })
      .catch((error) => {
        setError(error);
        setLoadedPuerto(false);
      });
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", maxWidth: "900px", maxHeight: "80vh", overflowY: "auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4 }}>
        <Button onClick={handleModalClose} sx={{ position: "absolute", top: "5px", right: "5px", minWidth: "30px", height: "30px", backgroundColor: "#16537e", color: "white", fontSize: "1rem", fontWeight: "bold", "&:hover": { backgroundColor: "darkred" }, zIndex: 1000 }}>✕</Button>
        <Typography variant="h4" component="h2"><b>Gestionar Puertos</b></Typography><br />

        <Grid container spacing={2}>
          {[...Array(cantDias)].map((_, index) => {

            return (
              <Grid item xs={12} key={index}>
                <Grid container alignItems="center" sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap" }}>
                  <Grid item sx={{ display: "flex", alignItems: "center", minWidth: "120px", marginRight: "10px" }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ whiteSpace: "nowrap", marginRight: "-40px" }}>
                      Día {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ flexGrow: 1, minwidth: "400px", maxWidth: "450px", paddingLeft: "20px" }}>
                    <FormControl fullWidth error={Boolean(errorMessage[index])}>
                      {control && (
                        <Controller
                          name={`puerto-${index}`}
                          control={control}
                          render={({ field }) => (
                            <>
                              <SelectPuerto
                                field={field}
                                data={dataPuerto}
                                onChange={(selectedValue) => {
                                  field.onChange(selectedValue.idPuerto);
                                  setSelectedPuerto((prevState) => ({
                                    ...prevState,
                                    [index]: {
                                      idPuerto: selectedValue.idPuerto,
                                      nombre: selectedValue.nombre,
                                      pais: selectedValue.pais.descripcion,
                                    },
                                  }));
                                  setErrorMessage((prev) => ({
                                    ...prev,
                                    [index]: null,
                                  }));
                                }}
                              />
                              {errorMessage[index] && <Typography color="error" variant="caption">{errorMessage[index]}</Typography>}
                            </>
                          )}
                        />
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sx={{ flexShrink: 0, ml: 35 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ backgroundColor: "blue", color: "white", "&:hover": { backgroundColor: "darkblue" }, width: "auto", minWidth: "180px", height: "40px" }}
                      onClick={() => {
                        if (!selectedPuerto[index] || !selectedPuerto[index].idPuerto) {
                          setErrorMessage((prev) => ({ ...prev, [index]: "Debe seleccionar un puerto" }));
                          return;
                        }
                        setSelectedDiaIndex(index + 1);
                        setOpenModalDesc(true);
                        setSelectedPuerto({ idPuerto: selectedPuerto?.idPuerto, nombre: selectedPuerto[index]?.nombre, pais: selectedPuerto[index]?.pais });
                      }}
                    >
                      Gestionar descripción
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>

        <ModalDescripcion
          open={openModalDesc}
          handleClose={() => setOpenModalDesc(false)}
          resetSelect={resetSelect}
          nombrePuerto={selectedPuerto?.nombre}
          paisPuerto={selectedPuerto?.pais}
          diaIndex={selectedDiaIndex}
        />

        <Button variant="contained" onClick={handleModalClose} sx={{ mt: 3, backgroundColor: "#16537e", color: "white", "&:hover": { backgroundColor: "#133d5a" }, width: "200px", height: "40px", fontSize: "0.9rem", mx: "auto", display: "block" }} fullWidth>
          Confirmar
        </Button>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>¿Deseas salir sin guardar?</DialogTitle>
          <DialogContent>Esto eliminará el itinerario creado.</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
            <Button onClick={confirmarCerrarYEliminar} color="error">Sí, eliminar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}

ModalGestionPuertos.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  cantDias: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  fechaSeleccionada: PropTypes.object,
};
