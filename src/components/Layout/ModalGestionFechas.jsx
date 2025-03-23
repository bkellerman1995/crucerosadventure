import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, InputLabel, Input, FormHelperText } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BarcoService from "../../services/BarcoService";


import PropTypes from "prop-types";

export function ModalGestionFechas({ open, handleClose,barco }) {
  const [barcoData, setBarcoData] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState("");
  const onError = (errors) => {
    console.log("Errores en el formulario:", errors);
  };

  //Hooks de fecha del dia de hoy
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    dayjs().add(1, "month")
  );

  // Esquema de validación
  const fechaHabitacionSchema = yup.object({
    precio: yup
      .number()
      .transform((value, originalValue) => {
        // Si el valor es vacío, devuelve undefined
        return originalValue === "" ? undefined : value;
      })
      .min(500, "El precio mínimo debe ser de $500")
      .max(9999, "El precio máximo debe ser $9999")
      // .required("El precio es requerido")
  });

  //Función para manejar el form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, //limpiar el formulario cuando el modal se cierre
  } = useForm({
    resolver: yupResolver(fechaHabitacionSchema),
    mode: "onSubmit", //validar al salir del campo
  });

  //Cuando el modal se abre, resetear el precio de la habitación
  useEffect(() => {
    if (open) {
      reset({ precio: "" });
    }
  }, [open, reset]);

  useEffect(() => {
    if (open && barco) {
      console.log("id de barco recibido en ModalGestionFechas:", barco);
      const idbarco = barco.value;
      BarcoService.getBarcobyId(idbarco)
        .then((response) => {
          console.log("Habitaciones cargadas:", response.data);
          setBarcoData(response.data);
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    }
  }, [open, barco]);

  if (error) return <p>Error: {error.message}</p>;

  // Accion submit del botón confirmar
  const onSubmit = (data) => {
    // e.preventDefault(); // Asegurar que el evento se capture bien. El modal puede no estar permitiendo que se ejecute onSubmit.
    console.log("Dato recibido del form:", data);

    // Iterar sobre las claves de "precio-1", "precio-2", etc.
    // Object.keys(data).forEach((key) => {
    //   if (key.startsWith("precio-")) {
    //     // console.log(`Valor de ${key}:`, data[key]);
    //   }
    // });

    const formData = {
      // idItinerario,
      // dia,
      // idPuerto,
      ...data, // descripción del textField
      // estado,
    };
    console.log("Enviando datos:", formData);
    // try {
    //   ItinerarioPuertoService.agregarPuertoItinerario(formData)
    //     .then((response) => {
    //       setError(response.error);
    //       if (response.data != null) {
    //         console.log("objeto Puerto Itinerario:", response.data);
    //         toast.success(`Gestión de puerto exitosa`, {
    //           duration: 1500,
    //           position: "top-center",
    //         });
    //         setPuertosDeshabilitados((prev) => ({
    //           ...prev,
    //           [diaIndex - 1]: true,
    //         })); // Deshabilitar el select y el botón de ese día
    //         setPuertosContador((prevCount) => prevCount + 1); // Incrementar el contador de puertos
    //       }
    //     })
    //     .catch((error) => {
    //       if (error instanceof SyntaxError) {
    //         console.log(error);
    //         setError(error);
    //         throw new Error("Respuesta no válida del servidor");
    //       }
    //     });

    //   handleClose();
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
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
                zIndex: 1000,
              }}
            >
              ✕
            </Button>
            <Typography variant="h4" component="h2">
              <b>Gestionar Fechas</b>
            </Typography>
            <br />

            <Grid container spacing={2}>
              {/* Fecha límite de pago*/}
              <Grid>
                <Grid size={10} sm={6}>
                  <Typography variant="subtitle1">
                    <b>Fecha de inicio</b>
                  </Typography>
                  <br></br>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Seleccione una fecha"
                      value={fechaSeleccionada} //Valor por defecto: hoy
                      onChange={(newValue) => setFechaSeleccionada(newValue)}
                      slotProps={{
                        textField: { variant: "outlined", fullWidth: true },
                      }}
                      format="DD/MM/YYYY"
                      // Para configurar la fecha al día de hoy -> minDate={dayjs()}
                      // Para configurar la fecha dentro de un mes
                      minDate={dayjs().add(1, "month")}
                      //Para forzar la selección en el UI al valor mínimo por defecto
                      onOpen={() => {
                        if (!fechaSeleccionada) setFechaSeleccionada(dayjs()); // Si no hay fecha, asigna el mínimo
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <br></br>

                {/* Fecha límite de pago*/}
                <Grid size={10} sm={6}>
                  <Typography variant="subtitle1">
                    <b>Fecha límite de pago</b>
                  </Typography>
                  <br></br>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Seleccione una fecha"
                      value={fechaSeleccionada} //Valor por defecto: hoy
                      onChange={(newValue) => setFechaSeleccionada(newValue)}
                      slotProps={{
                        textField: { variant: "outlined", fullWidth: true },
                      }}
                      format="DD/MM/YYYY"
                      minDate={dayjs().add(1, "month")}
                      onOpen={() => {
                        if (!fechaSeleccionada) setFechaSeleccionada(dayjs()); // Si no hay fecha, asigna el mínimo
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <br></br>
                <Grid size={10} sm={6}>
                  <Button
                    type="submit"
                    sx={{
                      ml: 4,
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
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={20} sm={6}>
                  <Typography variant="subtitle1">
                    <b>Precios de habitaciones (en dólares)</b>
                  </Typography>
                  <br />

                  <Grid
                    size={20}
                    sm={6}
                    sx={{ backgroundColor: "#ADD8E6", padding: 2 }}
                  >
                    {barcoData.habitaciones?.length > 0 ? (
                      barcoData.habitaciones.map((habitacion) => (
                        <Typography key={habitacion.idHabitacion}>
                          <React.Fragment>
                            <b>{habitacion.nombre}</b>:
                            <br />
                            <FormControl
                              fullWidth
                              error={Boolean(
                                errors[`precio-${habitacion.idHabitacion}`]
                              )}
                              variant="standard"
                            >
                              <InputLabel
                                htmlFor={`precio-${habitacion.idHabitacion}`}
                              >
                                $
                              </InputLabel>
                              <Controller
                                name={`precio de habitación-${habitacion.idHabitacion}`} // Usar ID único
                                control={control} //valor predeterminado vacio
                                // defaultValue={""}
                                render={({ field }) => {

                                  const handleKeyPress = (e) => {
                                    // Prevenir la entrada del signo "-"
                                    if (e.key === "-") {
                                      e.preventDefault();
                                    }
                                  };
                                  console.log(
                                    `Valor de habitación ${habitacion.idHabitacion} - ${habitacion.nombre}: `,
                                    field.value
                                  );

                                  return (
                                    <Input
                                      {...field} // Asocia el input con el estado del formulario
                                      id={`precio-${habitacion.idHabitacion}`} // Usar ID único
                                      placeholder="0"
                                      style={{
                                        backgroundColor: "white",
                                        width: "100%",
                                        padding: "10px",
                                        fontSize: "16px",
                                      }}
                                      type="number" // Asegura que solo se puedan ingresar números
                                      min="500" // Valor mínimo
                                      max="9999" // Valor máximo
                                      onKeyPress={handleKeyPress} // Prevenir ingreso de "-"
                                      onInput={(e) => {
                                        // Prevenir ingreso de números negativos
                                        if (e.target.value < 0) {
                                          e.target.value = 0;
                                        }
                                        // Limitar la longitud a 4 caracteres
                                        if (e.target.value.length > 4) {
                                          e.target.value = e.target.value.slice(
                                            0,
                                            4
                                          );
                                        }
                                      }}
                                    />
                                  );
                                }}
                              />
                              <FormHelperText>
                                {errors[`precio-${habitacion.idHabitacion}`]
                                  ? errors[`precio-${habitacion.idHabitacion}`]
                                      ?.message
                                  : "Ingrese un precio entre 500 y 9999"}
                              </FormHelperText>
                            </FormControl>
                          </React.Fragment>
                        </Typography>
                      ))
                    ) : (
                      <Typography color="error">
                        <b>No hay habitaciones disponibles.</b>
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br></br>

            <br></br>

            <Dialog
              open={openConfirmDialog}
              onClose={() => setOpenConfirmDialog(false)}
            >
              <DialogTitle>¿Desea salir sin guardar?</DialogTitle>
              <DialogContent>
                Esto eliminará el itinerario creado.
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenConfirmDialog(false)}>
                  Cancelar
                </Button>
                <Button color="error">Sí, eliminar</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </form>
      </Modal>
    </>
  );
}

ModalGestionFechas.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  cantDias: PropTypes.number.isRequired,
  barco: PropTypes.object, 
};
