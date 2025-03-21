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
import ItinerarioService from "../../services/PuertoService";


export function ModalDescripcion({ open, handleClose, nombrePuerto, paisPuerto, diaIndex, resetSelect, fecha }) {
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
    defaultValues: {
      descripcion: "",
    },
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
  const onSubmit = (DataForm,e) => {
    e.preventDefault();  // Asegurar que el evento se capture bien. El modal puede no estar permitiendo que se ejecute onSubmit.
    console.log("Enviando datos:", DataForm);
    try {
      ItinerarioService.createItinerarioDescripcion(DataForm)
        .then((response) => {
          setError(response.error);
          if (response.data != null) {
            toast.success(
              `Día #${response.data.idCrucero} - ${response.data.nombre}`,
              {
                duration: 4000,
                position: "top-center",
              }
            );
          }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
      // }
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
              <b>Día {diaIndex} </b> - {fecha} <br />
              {console.log("fecha seleccionada", fecha)}
              <b>Puerto: </b> {nombrePuerto ?? "No seleccionado"} <br />
              <b>País: </b> {paisPuerto ?? "No seleccionado"}
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
  nombrePuerto: PropTypes.string, 
  paisPuerto: PropTypes.string,
  diaIndex: PropTypes.number.isRequired,
  fechaSeleccionada: PropTypes.object,

};
