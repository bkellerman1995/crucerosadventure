import React from "react";
import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import ItinerarioPuertoService from "../../services/ItinerarioPuertoService";


export function ModalDescripcion({ open, handleClose, resetSelect, puertoSeleccionado, diaIndex,idItinerario, setPuertosContador,setPuertosDeshabilitados}) {
  
  const idPuerto = puertoSeleccionado?.idPuerto;
  const dia = diaIndex;
  const estado = 1;
  console.log ("puerto recibido en modal",puertoSeleccionado);
  // Esquema de validación
  const puertoSchema = yup.object({
    descripcion: yup
      .string()
      .required("La descripción es requerida")
      .min(10, "Debe tener al menos 10 caracteres")
      .max(200, "No debe sobrepasar los 200 caracteres"),
  });

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Función para manejar el form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, //limpiar el formulario cuando el modal se cierre
  } = useForm({
    resolver: yupResolver(puertoSchema),
    mode: "onSubmit" //validar al salir del campo
  });

  //Cuando el modal se abre, resetear la descripción
  useEffect(() => {
    if (open) {
      reset({ descripcion: "" });
    }
  }, [open, reset]);


  // Accion submit del botón guardar
  const onSubmit = (descripcion,e) => {
    e.preventDefault(); // Asegurar que el evento se capture bien. El modal puede no estar permitiendo que se ejecute onSubmit.
    // Agregar los valores de idItinerario y idPuerto a los datos del formulario
    const formData = {
      idItinerario,
      dia,
      idPuerto,
      ...descripcion, // descripción del textField
      estado
      
    };
    console.log("Enviando datos:", formData );
    try {
      ItinerarioPuertoService.agregarPuertoItinerario(formData)
        .then((response) => {
          setError(response.error);
          if (response.data != null) {
            console.log('objeto Puerto Itinerario:', response.data)
            toast.success(
              `Gestión de puerto exitosa`,
              {
                duration: 1500,
                position: "top-center",
              }
            );
            setPuertosDeshabilitados((prev) => ({ ...prev, [diaIndex -1 ]: true })); // Deshabilitar el select y el botón de ese día
            setPuertosContador((prevCount) => prevCount + 1); // Incrementar el contador de puertos
          }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });

        handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  // Función para cerrar el modal y resetear valores del select
  const handleModalClose = () => {
    if (resetSelect && diaIndex !== null) {
      resetSelect(diaIndex - 1); // Llama a la función para resetear el select
    }
    handleClose(); // Cierra el modal
  };

  return (
    <>
      {/* <form onSubmit={handleSubmit(onSubmit, onError)} noValidate> */}
        <Modal open={open} onClose={handleModalClose}>
                <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>

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
            <br></br>
            <Typography>
              <b>Día {diaIndex} </b><br />
              <b>Puerto: </b> {puertoSeleccionado?.nombre ?? "No seleccionado"} <br />
              <b>País: </b> {puertoSeleccionado?.pais?.descripcion ?? "No seleccionado"}

            </Typography>
            <br></br>
            <Grid size={6} sm={6}>
              {/*Descripción del puerto */}
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <Controller
                  name="descripcion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      aria-label="minimum height"
                      minRows={3}
                      {...field}
                      id="descripcion"
                      label="Descripción"
                      multiline
                      placeholder="Escribe una descripción..."
                      error={Boolean(errors.descripcion)}
                      helperText={errors.descripcion?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Botón guardar */}
            <Button
              type="submit"
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
              Guardar
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
      </form>
      </Modal>
    </>
  );
}

// Validación de las props con PropTypes
ModalDescripcion.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  resetSelect: PropTypes.func,
  puertoSeleccionado: PropTypes.object.isRequired,
  diaIndex: PropTypes.number.isRequired,
  idItinerario: PropTypes.number.isRequired,
  setPuertosContador: PropTypes.number.isRequired,
  setPuertosDeshabilitados: PropTypes.func.isRequired
};
