import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import PuertoService from "../../services/PuertoService";
import { SelectPuerto } from "./SelectPuerto";
import { Controller } from "react-hook-form";
import { ModalDescripcion } from "./ModalDescripcion";

import PropTypes from "prop-types";

export function ModalGestionPuertos({ open, handleClose, cantDias, control, fechaSeleccionada }) {
  // Hooks Lista de puertos
  const [dataPuerto, setDataPuerto] = useState({});
  const [loadedPuerto, setLoadedPuerto] = useState(false);
  // Hooks de control de errores
  const [error, setError] = useState("");

  // Hook para abrir el modal de descripción
  const [openModalDesc, setOpenModalDesc] = useState(false);
  const [selectedPuerto, setSelectedPuerto] = useState({});
  const [selectedDiaIndex, setSelectedDiaIndex] = useState(null);
  // Estado para errores en el UI
  const [errorMessage, setErrorMessage] = useState({});

  //Función para manejar 

  // Función para cerrar el modal y resetear valores del select
  const handleModalClose = () => {
    setSelectedPuerto({});
    setSelectedDiaIndex(null);

    if (control && control.setValue) {
      for (let i = 0; i < cantDias; i++) {
        control.setValue(`puerto-${i}`, null);
      }
    }

    handleClose();
  };

  // Función para resetear el select cuando se cierra el modal Descripcion
  const resetSelect = (index) => {
    setSelectedPuerto((prevState) => {
      const newState = { ...prevState };
      delete newState[index]; // Elimina el puerto seleccionado del estado
      return newState;
    });

    if (control && control.setValue) {
      control.setValue(`puerto-${index}`, null);
    }
  };

  if (error) return <p>Error: {error.message}</p>;

  // Hook para cargar la lista de puertos
  useEffect(() => {
    PuertoService.getPuertos()
      .then((response) => {
        console.log(response);
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

  return (
    <Modal open={open} onClose={handleClose}>
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

        {/* Título */}
        <Typography variant="h4" component="h2">
          <b>Gestionar Puertos</b>
        </Typography>
        <br />

        {/* Contenedor en Grid con 2 columnas y alineación correcta */}
        <Grid container spacing={2}>
          {[...Array(cantDias)].map((_, index) => {

            //constante para guardar la fecha en formato "dd/mm/yyyy"
            const fechaActual = fechaSeleccionada
              ? dayjs(fechaSeleccionada).add(index, "day").format("DD/MM/YYYY")
              : "Sin fecha";

            return (
              <Grid item xs={12} key={index}>
                <Grid container alignItems="center" sx={{ display: "flex", justifyContent: "space-between" }}>
                  {/* Título del Día con Fecha */}
                  <Grid item sx={{ display: "flex", alignItems: "center", minWidth: "120px", marginRight: "10px"}}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ whiteSpace: "nowrap", marginRight: "-40px"}}>
                      Día {index + 1} - {fechaActual}
                    </Typography>
                  </Grid>

                  {/* SelectPuerto */}
                  <Grid item sx={{ flexGrow: 1, width: "250px", maxWidth: "300px", paddingLeft: "30px" }}>
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
                                    [index]: null, // Limpia el error si selecciona algo
                                  }));
                                }}
                              />
                              {errorMessage[index] && (
                                <Typography color="error" variant="caption">
                                  {errorMessage[index]}
                                </Typography>
                              )}
                            </>
                          )}
                        />
                      )}
                    </FormControl>
                  </Grid>

                  {/* Botón Agregar Descripción */}
                  <Grid item sx={{ flexShrink: 0, ml: 30 }}>
                    <Button
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
                        console.log("Estado actual de selectedPuerto:", selectedPuerto);
                        console.log(`Intentando abrir modal para el Día ${index + 1}, Puerto:`, selectedPuerto[index]);

                        if (!selectedPuerto[index] || !selectedPuerto[index].idPuerto) {
                          console.error("No se seleccionó ningún puerto.");
                          setErrorMessage((prev) => ({
                            ...prev,
                            [index]: "Debe seleccionar un puerto",
                          }));
                          return;
                        }

                        setSelectedDiaIndex(index + 1);
                        setOpenModalDesc(true);
                        setSelectedPuerto({
                          idPuerto: selectedPuerto?.idPuerto,
                          nombre: selectedPuerto[index]?.nombre,
                          pais: selectedPuerto[index]?.pais,
                        });
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

        {/* Modal para Agregar Descripción */}
        <ModalDescripcion
          open={openModalDesc}
          handleClose={() => setOpenModalDesc(false)}
          resetSelect={resetSelect}
          nombrePuerto={selectedPuerto?.nombre}
          paisPuerto={selectedPuerto?.pais}
          diaIndex={selectedDiaIndex}
        />

        {/* Botón para cerrar el modal */}
        <Button
          variant="contained"
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
          fullWidth
        >
          Confirmar
        </Button>
      </Box>
    </Modal>
  );
}

// Validación de las props con PropTypes
ModalGestionPuertos.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  cantDias: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  fechaSeleccionada: PropTypes.object,
};
