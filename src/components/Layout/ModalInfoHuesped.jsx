import React from "react";
import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, Select, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import HuespedService from "../../services/HuespedService";


export function ModalInfoHuesped({ open, handleClose,idHabitacion,setHuespedesContador, setInfoHuesped}) {

  // Esquema de validación
  const huespedSchema = yup.object({
    nombre: yup.string().required("El nombre es requerido"),
    apellido1: yup.string().required("El primer apellido es requerido"),
    apellido2: yup.string().required("El segundo apellido es requerido"),
    telefono: yup
      .string()
      .required("El teléfono es requerido")
      .matches(/^\d{8,15}$/, "El teléfono debe tener entre 8 y 15 dígitos"),
    estado: yup.number().required("El estado es requerido"),
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
    resolver: yupResolver(huespedSchema),
    mode: "onSubmit", //validar al salir del campo
  });

  //Cuando el modal se abre, resetear los campos
  useEffect(() => {
    
    if (open) {
      reset({
        nombre: "",
        apellido1: "",
        apellido2: "",
        telefono: "",
        estado: 1,
      });
    }
  }, [open, reset]);


  // Accion submit del botón guardar
  const onSubmit = async (data) => {
    try {
      //Validar el esquema de Huésped
      const isValid = await huespedSchema.isValid(data);

      if (isValid) {
        const formData = {
          idHabitacion,
          ...data, // Contenido del formulario
        };

        console.log("Enviando datos:", formData);

        try {
          HuespedService.createHuesped(formData)
            .then((response) => {
              setError(response.error);
              if (response?.data) {
                toast.success("Gestión de huésped exitosa", { duration: 1500 });
                setHuespedesContador((prevCount) => prevCount + 1); // Incrementar el contador de huéspedes
                console.log ("Cant. de Huéspedes creados hasta el momento: ", setHuespedesContador )
                setInfoHuesped(formData); // Actualiza solo el huésped correspondiente en el estado
                handleClose();
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
      }
    } catch (error) {
      console.error("Error al gestionar el huésped:", error);
      toast.error("Hubo un error al gestionar el huésped.");
    }
  };
  
  // Función para cerrar el modal
  const handleModalClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleClose();  // Solo cerrar si no es un clic en el backdrop
    }
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
          <Typography variant="h5" component="h2">
            <b>Agregar Huésped</b>
          </Typography>
          <br />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2} direction="column">
              {/* Campo nombre */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nombre"
                        error={Boolean(errors.nombre)}
                        helperText={errors.nombre?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Campo apellido1 */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="apellido1"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Primer Apellido"
                        error={Boolean(errors.apellido1)}
                        helperText={errors.apellido1?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Campo apellido2 */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="apellido2"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Segundo Apellido"
                        error={Boolean(errors.apellido2)}
                        helperText={errors.apellido2?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Campo teléfono */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Teléfono"
                        error={Boolean(errors.telefono)}
                        helperText={errors.telefono?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Estado */}
              <Grid item xs={12}>
                <FormControl fullWidth disabled>
                  <Controller
                    name="estado"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Estado">
                        <MenuItem value={1}>Activo</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

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
          </form>
        </Box>
      </Modal>
  );
}

// Validación de las props con PropTypes
ModalInfoHuesped.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  idHabitacion: PropTypes.number.isRequired,
  infoHabitacion: PropTypes.object.isRequired,
  setHuespedesContador: PropTypes.number.isRequired,
  setInfoHuesped: PropTypes.object.isRequired
};
