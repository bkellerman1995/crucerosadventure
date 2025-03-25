import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { ModalDescripcion } from "./ModalDescripcion";
import PuertoService from "../../services/PuertoService";
import ItinerarioService from "../../services/ItinerarioService";
import CrucerosService from "../../services/CrucerosService";
import PropTypes from "prop-types";
import Select from "react-select";
import toast from "react-hot-toast";
export function ModalGestionPuertos({ open, handleClose, cantDias, control, setCruceroCreado,setPuertosItinerario, idCrucero }) {
  const [dataPuerto, setDataPuerto] = useState([]);
  const [loadedPuerto, setLoadedPuerto] = useState(false);
  const [idItinerario, setIdItinerario] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState("");
  const [openModalDesc, setOpenModalDesc] = useState(false);
  const [selectedPuerto, setSelectedPuerto] = useState({});
  const [selectedDiaIndex, setSelectedDiaIndex] = useState(null);
  const [puertosContador, setPuertosContador] = useState(0); // Estado para contar puertos seleccionados
  const [puertosDeshabilitados, setPuertosDeshabilitados] = useState({}); // 1. Crear el estado disabledPorts
  const [errorMessage, setErrorMessage] = useState({}); 
  
  // Crear itinerario al abrir modal
  useEffect(() => {
    if (open && !idItinerario) {
      const nuevo = { estado: 1 };
      ItinerarioService.createItinerario(nuevo)
        .then((res) => {
          if (res?.data?.idItinerario) {
            setIdItinerario(res.data.idItinerario);
          }
        })
        .catch((err) => console.error("Error al crear itinerario:", err));
    }
  }, [open]);

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

  //Abrir confirm Dialog en caso de que
  //se quiera cerrar el modal
  const handleModalClose = () => {
    setOpenConfirmDialog(true);
  };

  //Confirmar que al menos dos puertos 
  //estén añadidos al itinerario
  const handleConfirmar = () => {
    // Verificar si se han seleccionado al menos dos puertos
    if (puertosContador < 2) {
      toast.error("Se debe agregar más de un puerto al itinerario.");
      return;
    }

    const crucero = {
      idCrucero : parseInt(idCrucero,10),
      idItinerario: parseInt (idItinerario,10)
    }

    console.log(typeof crucero.idCrucero); // Imprime 'number' o 'string', dependiendo del valor
    console.log(typeof crucero.idItinerario);

    CrucerosService.update(crucero)
      .then((response) => {
        setError(response.error);
        if (response.data != null) {
          toast.success("Puertos agregados correctamente.");
          setPuertosContador(0);
          setPuertosDeshabilitados(false);
          setSelectedPuerto({});
          setSelectedDiaIndex(null);
          setPuertosItinerario(true);
          setCruceroCreado(true);
        }
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          throw new Error("Respuesta no válida del servidor");
        }
      });
    if (control && control.setValue) {
      for (let i = 0; i < cantDias; i++) {
        control.setValue(`puerto-${i}`, null);
      }
    }
    handleClose();
  };

  const confirmarCerrarYEliminar = () => {
    if (idItinerario) {
      setPuertosDeshabilitados(false);
      setIdItinerario(null);
      setSelectedPuerto({});
      setSelectedDiaIndex(null);
      setCruceroCreado(true);
    }
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

  if (error) return <p>Error: {error.message}</p>;

  // Estilos personalizados para el select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ADD8E6" : state.isSelected ? "white" : "white",
      color: state.isSelected ? "black" : "black",
      cursor: "pointer",
      transition: "background-color 0.2s ease-in-out",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: "gray",
      boxShadow: "none",
      minHeight: "40px", 
      width: "300px",
      "&:hover": {
        borderColor: "#16537e",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      width: "300px",
    }),
  };

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
          <b>Gestionar Puertos</b>
        </Typography>
        <br />

        <Grid container spacing={2}>
          {[...Array(cantDias)].map((_, index) => (
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
                    Día {index + 1}
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{
                    flexGrow: 1,
                    minwidth: "400px",
                    maxWidth: "450px",
                    paddingLeft: "20px",
                  }}
                >
                  <FormControl fullWidth error={Boolean(errorMessage[index])}>
                    {control && (
                      <Controller
                        name={`puerto-${index}`}
                        control={control}
                        render={({ field }) => {
                          // Mapear los puertos
                          const options = dataPuerto.map((puerto) => ({
                            label: `${puerto.nombre} / País: ${puerto.pais.descripcion}`,
                            value: puerto.idPuerto,
                            obj: puerto,
                          }));

                          // Seleccionar la opción correcta
                          const selectedOption =
                            options.find((opt) => opt.value === field.value) ||
                            null;

                          return (
                            <Select
                              styles={customStyles}
                              options={options}
                              placeholder="Seleccione un puerto"
                              value={selectedOption} // Mostrar el puerto seleccionado
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption.value);
                                console.log(
                                  "puerto seleccionado",
                                  selectedOption.obj
                                ); // Solo se guarda el ID en el formulario
                                setSelectedPuerto((prevState) => ({
                                  ...prevState,
                                  [index]: selectedOption.obj, // Guardar el objeto completo
                                }));
                                setErrorMessage((prev) => ({
                                  ...prev,
                                  [index]: null,
                                }));
                              }}
                              isDisabled={puertosDeshabilitados[index]} // Deshabilitar el select según el estado
                            />
                          );
                        }}
                      />
                    )}
                    {/* Mostrar el mensaje de error debajo del Select */}
                    {errorMessage[index] && (
                      <Typography color="error" variant="caption">
                        {errorMessage[index]}
                      </Typography>
                    )}
                  </FormControl>
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
                      const puertoSeleccionado = selectedPuerto[index];
                      if (!puertoSeleccionado || !puertoSeleccionado.idPuerto) {
                        setErrorMessage((prev) => ({
                          ...prev,
                          [index]: "Debe seleccionar un puerto",
                        }));
                        return;
                      }

                      // Actualizar el índice del día y abrir el modal
                      const diaIndex = index + 1;
                      setSelectedDiaIndex(diaIndex);
                      console.log("selectedDiaIndex:", selectedDiaIndex);
                      setOpenModalDesc(true);
                    }}
                    disabled={puertosDeshabilitados[index]} // Deshabilitar el botón solo si este puerto fue modificado
                  >
                    Gestionar descripción
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <ModalDescripcion
          open={openModalDesc}
          handleClose={() => setOpenModalDesc(false)}
          resetSelect={resetSelect}
          puertoSeleccionado={selectedPuerto[selectedDiaIndex - 1]}
          diaIndex={selectedDiaIndex}
          idItinerario={idItinerario}
          setPuertosContador={setPuertosContador}
          setPuertosDeshabilitados={setPuertosDeshabilitados}
        />

        <Button
          variant="contained"
          onClick={handleConfirmar}
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
          <DialogTitle>¿Deseas salir sin guardar?</DialogTitle>
          <DialogContent>El itinerario no se asignará al crucero.</DialogContent>
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

ModalGestionPuertos.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  cantDias: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  setCruceroCreado: PropTypes.func.isRequired,
  setPuertosItinerario: PropTypes.func.isRequired,
  idCrucero: PropTypes.number.isRequired,

};
