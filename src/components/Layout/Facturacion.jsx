import React from "react";
import {useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useForm, Controller} from "react-hook-form";
import { Tooltip, List, ListItem,Box, TextField} from "@mui/material";
import Select from "react-select";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CruceroFechaService from "../../services/CruceroFechaService";
import {useUsuarioContext} from "../../context/usuarioContext";
import { format, addDays } from 'date-fns';

export function Facturacion() {
  // Usar el contexto para acceder al usuario
  const { usuario } = useUsuarioContext();
  console.log("Usuario cargado: ", usuario);

  // Para recibir el estado de resumenReserva cuando
  // se navega a esta sección
  const { state } = useLocation();

  // Acceder al estado de resumenReserva
  const { resumenReserva } = state;

  // Array con las formas de pago
  const formasPago = [
    { tipo: "Contado", monto: resumenReserva.total },
    { tipo: "Mínimo por huésped (c/u)", monto: 500 },
  ];

  // Estado de forma de pago seleccionada
  const [selectedFormaPago, setSelectedFormaPago] = useState(null);

  // formatear la fecha recibida de resumenReserva de "dd/mm/yyyy" a "yyyy-mm-dd"
  // para poder enviarla como parámetro en la consulta SQL
  function formatearFecha(fecha) {
    const [dia, mes, año] = fecha.split("/"); // Dividir la fecha en partes
    return `${año}-${mes}-${dia}`; // Reordenar las partes en formato YYYY-MM-DD
  }

  const fechaFormateada = formatearFecha(resumenReserva.fechaInicio);
  console.log("Fecha formateada a enviar",fechaFormateada); 

  // Estado de fecha del dia de hoy
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    dayjs().add(1, "day")
  );

  // Estado para almacenar la fecha limite de pagos
  const [fechaLimite, setFechaLimite] = useState(null);

  //Estilos personalizados para el select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#ADD8E6" // Color cuando se hace hover
        : state.isSelected
          ? "white" // Color cuando está seleccionado (blanco)
          : "white", // Color normal

      color: state.isSelected ? "black" : "black", // Asegura que el texto sea visible
      cursor: "pointer", // Cambia el cursor al pasar el mouse
      transition: "background-color 0.2s ease-in-out", // Suaviza la transición de color
    }),

    control: (provided) => ({
      ...provided,
      borderColor: "gray",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#16537e", // Cambia el borde cuando pasas el mouse
      },
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Asegura que el menú esté visible sobre otros elementos
    }),
  };

  //Función para manejar el form
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      foto: "",
      cantDias: 7,
      idBarco: null,
      estado: "",
    },
  });

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Control de errores
  if (error) return <p>Error: {error.message}</p>;

  // Accion submit
  const onSubmit = async (DataForm) => {
    //Validar si se ha seleccionado un barco

    if (!selectedCrucero) {
      setTimeout(() => {
        if (!selectedCrucero) {
          alert("Debe seleccionar un crucero");
        }
      }, 100); // Retrasa la validación 100ms para dar tiempo a la actualización
      return;
    }

    try {
      // Validar el objeto con Yup de manera asíncrona
      const isValid = await reservaSchema.isValid(DataForm);

      if (isValid) {
        console.log("Enviando datos de la reserva al form: ", DataForm);
      } else {
        //Configurar el estado de crucero creado a false
      }
    } catch (error) {
      console.error(error);
    }
  };

  //use Effect para cargar la fecha límite de pagos del crucero
  useEffect(() => {
    CruceroFechaService.getFechaLimiteDePago(
      resumenReserva.crucero,
      fechaFormateada
    )
      .then((response) => {
        console.log("Fecha límite de pago: ", response.data.fechaLimitePagos);
        setFechaLimite(response.data.fechaLimitePagos);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  //Cargar el grid del componente.
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={3}>
          {/* Datos de la reserva (lado izquierdo) */}
          <Grid size={8} sm={6}>
            <Box
              sx={{
                position: "relative",
                top: "42%",
                left: "30%",
                transform: "translate(-50%, -50%)",
                width: "50vw",
                maxWidth: "600px",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 10,
                p: 4,
              }}
            >
              <Typography variant="h5" gutterBottom>
                <b>Facturación</b>
              </Typography>
              <br />

              <Typography variant="subtitle1">
                <b>Usuario: </b> {usuario.nombre} ({usuario.correoElectronico})
              </Typography>
              <br></br>

              <Grid item container direction="row" xs={12} alignItems="center">
                <Typography variant="subtitle1">
                  <b>Forma de pago:</b>
                </Typography>
                <Grid item sx={{ width: "60%", marginLeft: "20px" }}>
                  <Select
                    options={formasPago.map((pago) => ({
                      label: `${pago.tipo} = $${pago.monto}`,
                      value: pago.monto,
                    }))}
                    onChange={(selectedOption) => {
                      console.log(
                        "Tipo de pago seleccionado: ",
                        selectedOption.value
                      );
                      setSelectedFormaPago(selectedOption.value);
                      setValue("pago", selectedOption.value);
                    }}
                    styles={{
                      ...customStyles,
                      container: (provided) => ({
                        ...provided,
                        width: "100%", // Asegura que el select ocupe el 100% del espacio disponible
                      }),
                    }}
                    placeholder="Seleccione una forma de pago"
                  />
                </Grid>
              </Grid>
              <br></br>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2} direction="column">

                  {/* Texto de Fecha limite de pagos*/}
                  <Grid container direction="column" xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      <b>Monto total a pagar: </b> ${resumenReserva.total}
                    </Typography>
                    <Typography variant="subtitle1">
                      <b>Fecha límite de pago:</b>{" "}
                      {format(addDays(fechaLimite, 1), "dd/MM/yyyy")}
                    </Typography>
                    <Typography variant="subtitle1">
                      <b>Saldo:</b> $
                      {parseInt(resumenReserva.total) -
                        resumenReserva.habitaciones.reduce(
                          (totalHuespedes, habitacion) =>
                            totalHuespedes + parseInt(habitacion.cantidad),
                          0
                        ) *
                          parseInt(selectedFormaPago)}
                    </Typography>
                  </Grid>

                  {/* Campo número de tarjeta */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name="numero"
                        control={control}
                        render={({ field }) => {
                          const handleKeyPress = (e) => {
                            // Prevenir la entrada del signo "-"
                            if (e.key === "-") {
                              e.preventDefault();
                            }
                          };
                          return (
                            <TextField
                              {...field} // Asocia el input con el estado del formulario
                              label="Número de tarjeta"
                              style={{
                                backgroundColor: "white",
                                width: "100%",
                              }}
                              type="number" // Asegura que solo se puedan ingresar números
                              //Quitar los controles de incremento y decremento
                              slotProps={{
                                input: {
                                  type: "number",
                                  sx: {
                                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                      {
                                        display: "none",
                                      },
                                    "& input[type=number]": {
                                      MozAppearance: "textfield",
                                    },
                                  },
                                },
                              }}
                              onKeyPress={handleKeyPress} // Prevenir ingreso de "-"
                              onInput={(e) => {
                                // Prevenir ingreso de números negativos
                                if (e.target.value < 0) {
                                  e.target.value = 0;
                                }
                                // Limitar la longitud a 16 caracteres
                                if (e.target.value.length > 16) {
                                  e.target.value = e.target.value.slice(0, 16);
                                }
                              }}
                              helperText={errors.numero?.message}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Campo fecha Caducidad */}
                  <Grid item size={4} xs={12} sm={6}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="fechaCaducidad"
                          control={control} // Control de react-hook-form
                          defaultValue={fechaSeleccionada || dayjs()} // Valor por defecto
                          render={({ field }) => (
                            <DatePicker
                              label="Fecha de caducidad"
                              value={field.value} //Valor por defecto: hoy
                              onChange={(newValue) => {
                                const fechaFormateada = newValue;
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
                              // Para configurar la fecha dentro de un dias
                              minDate={dayjs().add(1, "day")}
                              //Para forzar la selección en el UI al valor mínimo por defecto
                              onOpen={() => {
                                if (!fechaSeleccionada)
                                  setFechaSeleccionada(dayjs()); // Si no hay fecha, asigna el mínimo
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>

                  {/* Campo CVV */}
                  <Grid item size={2} xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name="cvv"
                        control={control}
                        render={({ field }) => {
                          const handleKeyPress = (e) => {
                            // Prevenir la entrada del signo "-"
                            if (e.key === "-") {
                              e.preventDefault();
                            }
                          };
                          return (
                            <TextField
                              {...field} // Asocia el input con el estado del formulario
                              label="CVV"
                              style={{
                                backgroundColor: "white",
                                width: "100%",
                              }}
                              type="number" // Asegura que solo se puedan ingresar números
                              //Quitar los controles de incremento y decremento
                              slotProps={{
                                input: {
                                  type: "number",
                                  sx: {
                                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                      {
                                        display: "none",
                                      },
                                    "& input[type=number]": {
                                      MozAppearance: "textfield",
                                    },
                                  },
                                },
                              }}
                              onKeyPress={handleKeyPress} // Prevenir ingreso de "-"
                              onInput={(e) => {
                                // Prevenir ingreso de números negativos
                                if (e.target.value < 0) {
                                  e.target.value = 0;
                                }
                                // Limitar la longitud a 16 caracteres
                                if (e.target.value.length > 3) {
                                  e.target.value = e.target.value.slice(0, 3);
                                }
                              }}
                              helperText={errors.numero?.message}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Campo nombre del titular */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Nombre del titular"
                            error={Boolean(errors.nombre)}
                            helperText={errors.nombre?.message}
                          />
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
                  }}
                >
                  Pagar
                </Button>
              </form>
            </Box>
          </Grid>

          {/*Resumen de la reserva (lado derecho) */}

          <Grid container direction="column" spacing={2}>
            <Grid
              item
              width={450}
              xs={12}
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "16px",
                padding: "10px",
                marginRight: "20px",
              }}
            >
              <Typography
                align="center"
                variant="h5"
                gutterBottom
                color="¨black"
              >
                <b>Resumen de la reserva</b>
              </Typography>

              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Crucero seleccionado:</b>
                  </Typography>
                  <Typography>{resumenReserva.nombre}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Puerto de salida:</b>
                  </Typography>
                  <Typography>{resumenReserva.puertoSalida}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Puerto de regreso:</b>
                  </Typography>
                  <Typography>{resumenReserva.puertoRegreso}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Fecha de salida:</b>
                  </Typography>
                  <Typography>{resumenReserva.fechaInicio}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Fecha de regreso:</b>
                  </Typography>
                  <Typography>{resumenReserva.fechaRegreso}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Habitaciones seleccionadas:</b>
                  </Typography>

                  <List>
                    {resumenReserva.habitaciones.map((habitacion, index) => (
                      <ListItem key={index}>
                        <Typography>
                          {habitacion.nombre} - Cantidad de huéspedes:{" "}
                          {habitacion.cantidad}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  xs={12}
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    <b>Total por habitaciones:</b>
                  </Typography>
                  <Typography>$ {resumenReserva.totalHabitaciones}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Complementos seleccionados:</b>
                  </Typography>

                  <List>
                    {resumenReserva.complementos.map((complemento, index) => (
                      <ListItem key={index}>
                        <Typography>
                          {complemento.nombre} - ${complemento.precio}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  xs={12}
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    <b>Total por complementos:</b>
                  </Typography>
                  <Typography>$ {resumenReserva.totalComplementos}</Typography>
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  xs={12}
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    <b>Subtotal :</b>
                  </Typography>
                  <Typography>$ {resumenReserva.subTotal}</Typography>
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  xs={12}
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    <b>Impuesto (IVA) :</b>
                  </Typography>
                  <Typography> {resumenReserva.impuesto * 100}%</Typography>
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  xs={12}
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    <b>Tarifa portuaria :</b>
                  </Typography>
                  <Typography>$ {resumenReserva.tarifaPortuaria}</Typography>
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  xs={12}
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    <b>Total :</b>
                  </Typography>
                  <Typography>$ {resumenReserva.total}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
