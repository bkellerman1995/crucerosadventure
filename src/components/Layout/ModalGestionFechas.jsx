import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import toast from "react-hot-toast";
import BarcoService from "../../services/BarcoService";
import CruceroFechaService from "../../services/CruceroFechaService";
import CrucerosService from "../../services/CrucerosService";
import PrecioHabitacionFechaService from "../../services/PrecioHabitacionFechaService";

import PropTypes from "prop-types";

export function ModalGestionFechas({
  open,
  handleClose,
  barco,
  setFechasCrucero,
  idCrucero,
}) {
  const [barcoData, setBarcoData] = useState([]);
  const [idCruceroFecha, setidCruceroFecha] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState("");

  const onError = (errors) => {
    console.log("Errores en el formulario:", errors);
  };

  //Hooks de fecha del dia de hoy
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    dayjs().add(1, "month")
  );

  // Estado para almacenar el esquema de validación
  const [fechaHabitacionSchema, setFechaHabitacionSchema] = useState(
    yup.object()
  );

  // Crear cruceroFecha al abrir modal
  useEffect(() => {
    if (open && !idCruceroFecha) {
    const nuevo = { estado: 1 };
    CruceroFechaService.createFechaCrucero(nuevo)
      .then((res) => {
        if (res?.data?.idCruceroFecha) {
          setidCruceroFecha(res.data.idCruceroFecha);
        }
      })
      .catch((err) => console.error("Error al crear fecha del crucero:", err));
    }
  }, [open]);

  // Generación dinámica del esquema de validación
  // para las habitaciones

  useEffect(() => {
    if (open && barco) {
      // Obtener las habitaciones
      const idbarco = barco.value;
      BarcoService.getBarcobyId(idbarco)
        .then((response) => {
          setBarcoData(response.data);

          // Generar el esquema de validación dinámicamente
          const dynamicValidationSchema = {};
          response.data.habitaciones.forEach((habitacion) => {
            const precioFieldName = `precio-${habitacion.idHabitacion}`;
            dynamicValidationSchema[precioFieldName] = yup
              .number()
              .transform((value, originalValue) =>
                originalValue === "" ? undefined : value
              )
              .min(500, `El precio mínimo debe ser de $500`)
              .max(9999, `El precio máximo debe ser $9999`)
              .required(`El precio es requerido`);
          });

          // Crear el esquema de validación con yup
          setFechaHabitacionSchema(yup.object().shape(dynamicValidationSchema));
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [open, barco]);

  //Función para manejar el form
  const {
    control,
    handleSubmit,
    formState: { errors },
    //reset, //limpiar el formulario cuando el modal se cierre
  } = useForm({
    resolver: yupResolver(fechaHabitacionSchema),
    mode: "onSubmit", //validar al salir del campo
  });

  if (error) return <p>Error: {error.message}</p>;

  // Accion submit del botón confirmar
  const onSubmit = async (data) => {
    console.log("Dato recibido del form:", data);
  
    const cruceroID = parseInt(idCrucero, 10);
    const fechaInicioFormateada = data.fechaSalida
      ? dayjs(data.fechaSalida).format("YYYY-MM-DD")
      : null;
  
    const fechaLimitePagosFormateada = data.fechaLimitePagos
      ? dayjs(data.fechaLimitePagos).format("YYYY-MM-DD")
      : null;
  
    const estado = 1;
  
    const formData = {
      idCruceroFecha,
      cruceroID,
      fechaInicioFormateada,
      fechaLimitePagosFormateada,
      estado,
      habitacionesPrecios: [], // Almacenar los datos (idHabitacion y precio) de las habitaciones
    };
  
    // Recorrer las habitaciones y agregar los precios a formData
    barcoData.habitaciones.forEach((habitacion) => {
      const precio = data[`precio-${habitacion.idHabitacion}`]; // obtener el precio de cada habitacion
  
      if (precio) {
        formData.habitacionesPrecios.push({
          idPrecioHabitacion: null, // precioHabitacion
          idCruceroFecha,
          idHabitacion: habitacion.idHabitacion,
          precio: precio,
        });
      }
    });
  
    // Verificar que haya habitaciones con precios válidos
    if (formData.habitacionesPrecios.length === 0) {
      toast.error("Debe ingresar precios válidos para las habitaciones.");
      return;
    }
  
    console.log("Enviando datos:", formData);
    try {
      // Validar que no haya conflicto de fechas
      const responseCrucero = await CrucerosService.getCrucerobyId(cruceroID);
      setError(responseCrucero.error);
  
      if (responseCrucero.data != null) {
        if (responseCrucero.data.fechaAsignada === fechaInicioFormateada) {
          toast.error(`La fecha de inicio ${fechaInicioFormateada} ya se asignó al crucero # ${cruceroID}. 
            Por favor seleccione otra fecha`);
          return;
        }
  
        // Guardar los precios de las habitaciones
        const preciosResponse = await PrecioHabitacionFechaService.agregarPrecioHabitacionFecha(formData.habitacionesPrecios);
  
        if (preciosResponse.data != null) {
          toast.success("Precios de habitaciones guardados correctamente.", {
            duration: 2000,
            position: "top-center",
          });
  
          // Actualizar la fecha del crucero
          const fechaCruceroResponse = await CruceroFechaService.updateFechaCrucero(formData);
  
          if (fechaCruceroResponse.data != null) {
            toast.success(`Fechas y habitaciones agregadas correctamente`, {
              duration: 1500,
              position: "top-center",
            });
  
            // Actualizar el estado y cerrar el modal
            setFechasCrucero(true); 
            handleClose(); // Cerrar el modal
          }
        }
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Hubo un error al guardar los precios.");
    }
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

                  <FormControl
                    variant="standard"
                    fullWidth
                    sx={{ m: 1 }}
                    error={Boolean(errors.fechaSalida)}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="fechaSalida" // El nombre que usas en tu formulario
                        control={control} // Control de react-hook-form
                        defaultValue={fechaSeleccionada || dayjs()} // Valor por defecto
                        render={({ field }) => (
                          <DatePicker
                            label="Seleccione una fecha válida"
                            value={field.value} //Valor por defecto: hoy
                            onChange={(newValue) => {
                              const fechaFormateada = newValue;
                              // && newValue.isValid()
                              // ? newValue.format("YYYY-MM-DD")
                              // : null;
                              field.onChange(fechaFormateada);
                            }}
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                fullWidth: true,
                              },
                            }}
                            format="DD/MM/YYYY"
                            // Para configurar la fecha al día de hoy -> minDate={dayjs()}
                            // Para configurar la fecha dentro de un mes
                            minDate={dayjs().add(1, "month")}
                            //Para forzar la selección en el UI al valor mínimo por defecto
                            onOpen={() => {
                              if (!fechaSeleccionada)
                                setFechaSeleccionada(dayjs()); // Si no hay fecha, asigna el mínimo
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <FormHelperText>
                      {errors.fechaSalida ? errors.fechaSalida.message : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <br></br>

                {/* Fecha límite de pago*/}
                <Grid size={10} sm={6}>
                  <Typography variant="subtitle1">
                    <b>Fecha límite de pago</b>
                  </Typography>
                  <br></br>

                  <FormControl
                    variant="standard"
                    fullWidth
                    sx={{ m: 1 }}
                    error={Boolean(errors.fechaLimitePagos)}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="fechaLimitePagos" // El nombre que usas en tu formulario
                        control={control} // Control de react-hook-form
                        defaultValue={fechaSeleccionada || dayjs()} // Valor por defecto
                        render={({ field }) => (
                          <DatePicker
                            label="Seleccione una fecha válida"
                            value={field.value} //Valor por defecto: hoy
                            onChange={(newValue) => {
                              const fechaFormateada = newValue;
                              // && newValue.isValid()
                              // ? newValue.format("YYYY-MM-DD")
                              // : null;
                              field.onChange(fechaFormateada);
                            }}
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                fullWidth: true,
                              },
                            }}
                            format="DD/MM/YYYY"
                            // Para configurar la fecha al día de hoy -> minDate={dayjs()}
                            // Para configurar la fecha dentro de un mes
                            minDate={dayjs().add(1, "month")}
                            //Para forzar la selección en el UI al valor mínimo por defecto
                            onOpen={() => {
                              if (!fechaSeleccionada)
                                setFechaSeleccionada(dayjs()); // Si no hay fecha, asigna el mínimo
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <FormHelperText>
                      {errors.fechaLimitePagos
                        ? errors.fechaLimitePagos.message
                        : ""}
                    </FormHelperText>
                  </FormControl>
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
                                name={`precio-${habitacion.idHabitacion}`} // Usar ID único
                                control={control} //valor predeterminado vacio
                                // defaultValue={0}
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
                                  : "Ingrese un precio entre $500 y $9999"}
                              </FormHelperText>
                              <br></br>
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
  setFechasCrucero: PropTypes.func.isRequired,
  idCrucero: PropTypes.number.isRequired,
};
