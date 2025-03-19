import React from 'react';
import { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, } from '@mui/material';
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import PuertoService from "../../services/PuertoService";
import {SelectPuerto} from "./SelectPuerto";
import {Controller } from "react-hook-form";
import { ModalDescripcion } from "./ModalDescripcion";

import PropTypes from 'prop-types';

export function ModalGestionPuertos({ open, handleClose, cantDias, control }) {
  //Hooks Lista de puertos
  const [dataPuerto, setDataPuerto] = useState({});
  const [loadedPuerto, setLoadedPuerto] = useState(false);

  //Hooks de control de errores
  const [error, setError] = useState("");

  // Hook para abrir el modal de descripción
  const [openModalDesc, setOpenModalDesc] = useState(false);
  const [selectedPuerto, setSelectedPuerto] = useState({});
  const [selectedDiaIndex, setSelectedDiaIndex] = useState(null);

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
            backgroundColor: "#16537e",
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
          <b>Gestionar Puertos</b>
        </Typography>
        <br></br>

        {/* Contenedor en Grid con 2 columnas y alineación correcta */}
        <Grid container spacing={2}>
          {[...Array(cantDias)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Grid
                container
                alignItems="center"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {/* Título del Día */}
                <Grid item sx={{ minWidth: "80px" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Día {index + 1}
                  </Typography>
                </Grid>

                {/* SelectPuerto */}
                <Grid
                  item
                  sx={{ flexGrow: 1, minWidth: "300px", maxWidth: "450px" }}
                >
                  {" "}
                  {/*  Ancho fijo evita desajustes */}
                  <FormControl fullWidth>
                    {control && (
                      <Controller
                        name={`puerto-${index}`}
                        control={control}
                        render={({ field }) => (
                          <SelectPuerto
                            field={field}
                            data={dataPuerto}
                            onChange={(selectedValue) => {
                              console.log(
                                `Puerto seleccionado para el Día ${index + 1}:`,
                                selectedValue
                              );

                              field.onChange(selectedValue.idPuerto); // Guarda solo el ID en react-hook-form

                              setSelectedPuerto((prevState) => {
                                const newState = {
                                  ...prevState,
                                  [index]: {
                                    idPuerto: selectedValue.idPuerto,
                                    ...selectedValue,
                                  },
                                };
                                console.log(
                                  "Nuevo estado de selectedPuerto:",
                                  newState
                                );
                                return newState;
                              });
                            }}
                          />
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
                      console.log(
                        "Estado actual de selectedPuerto:",
                        selectedPuerto
                      );
                      console.log(
                        `Intentando abrir modal para el Día ${index + 1}, Puerto:`,
                        selectedPuerto[index]
                      );

                      if (
                        !selectedPuerto[index] ||
                        !selectedPuerto[index].idPuerto
                      ) {
                        console.error("No se seleccionó ningún puerto.");
                        return;
                      }

                      setSelectedDiaIndex(index + 1);
                      setOpenModalDesc(true);
                      setSelectedPuerto({
                        nombre: selectedPuerto[index]?.nombre,
                        pais: selectedPuerto[index]?.pais?.descripcion,
                      });
                    }}
                  >
                    Agregar descripción
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>

        {/* Modal para Agregar Descripción */}
        <ModalDescripcion
          open={openModalDesc}
          handleClose={() => setOpenModalDesc(false)}
          nombrePuerto={selectedPuerto?.nombre}
          paisPuerto={selectedPuerto?.pais}
          diaIndex={selectedDiaIndex}
        />

        {/* Botón para cerrar el modal */}
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            mt: 3,
            backgroundColor: "#16537e",
            color: "white",
            "&:hover": { backgroundColor: "#133d5a" },
            width: "200px", // Reduce el ancho del botón
            height: "40px", // Reduce la altura para hacerlo más compacto
            fontSize: "0.9rem", // Hace el texto más pequeño para mejor proporción
            mx: "auto", // Centra el botón en la pantalla
            display: "block", // Asegura que el botón no se expanda innecesariamente
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
  open: PropTypes.bool.isRequired, // 'open' debe ser un booleano obligatorio
  handleClose: PropTypes.func.isRequired,// 'handleClose' debe ser una función obligatoria
  cantDias: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired, 
};

