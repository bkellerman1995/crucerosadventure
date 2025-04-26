import React from "react";
import { useNavigate } from 'react-router-dom';
import {useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useForm, Controller} from "react-hook-form";
import {List, ListItem,Box, TextField} from "@mui/material";
import Select from "react-select";
import dayjs from "dayjs";
import { es } from 'date-fns/locale';
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CruceroFechaService from "../../services/CruceroFechaService";
import {useUsuarioContext} from "../../context/usuarioContext";
import { format, addDays } from 'date-fns';
import { CircularProgress } from "@mui/material";
import ReservaService from "../../services/ReservaService";
import visa from "../../assets/visa.png";
import mastercard from "../../assets/mastercard.svg";

export function Facturacion() {

  // Usar el contexto para acceder al usuario
  const { usuario } = useUsuarioContext();
  console.log("Usuario cargado: ", usuario);
  //Estado para configurar el tipo de tarjeta
  const [cardType, setCardType] = useState(null);

  //Estado para configurar el icono de tipo de tarjeta
  const [cardIcon, setCardIcon] = useState("");

  //UseNavigate para navegar a la página de Facturación
  const navigate = useNavigate();

  // Función para obetener el bin de la tarjeta
  const handleCardNumberChange = async (e) => {
    const cardNumber = e.target.value;
    const bin = cardNumber.slice(0, 6);

    try {
      const response = await fetch(`https://data.handyapi.com/bin/${bin}`);
      if (response.ok) {
        const data = await response.json();
        if (data.Scheme === "VISA") {
          setCardType("VISA");
          setCardIcon(
            <img
              src= {visa}
              alt="Visa"
              style={{ width: "30px" }}
            />
          );
          document.getElementById("typeText").style.backgroundColor = "#D7FFE4"; // Color para Visa
        } else if (data.Scheme === "MASTERCARD") {
          setCardType("MASTERCARD");
          setCardIcon(
            <img
              src={mastercard}
              alt="Mastercard"
              style={{ width: "30px" }}
            />
          );
          document.getElementById("typeText").style.backgroundColor = "#D7FFE4"; // Color para Mastercard
        } else {
          setCardType(null);
          setCardIcon(<span style={{ color: "red" }}>Tarjeta no válida</span>);
          document.getElementById("typeText").style.backgroundColor = "pink"; // Error
        }
      
      } else {
        console.error("La búsqueda del BIN falló.");
        document.getElementById("typeText").style.backgroundColor = "pink";
      }
    } catch (error) {
      console.error("Error fetching card data:", error);
      setCardType(null);
      setCardIcon("<span>Error al verificar la tarjeta</span>");
      document.getElementById("typeText").style.backgroundColor = "pink";
    }
  };

  if (usuario == null) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h5" gutterBottom>
          <b>Cargando</b>
        </Typography>
      </Box>
    );
  }

  // Para recibir el estado de resumenReserva cuando
  // se navega a esta sección

  const { state } = useLocation();

  if (!state || !state.resumenReserva) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h5" gutterBottom>
          <b>Cargando</b>
        </Typography>
      </Box>
    );
  }

  const { resumenReserva } = state;

  // Array con las formas de pago
  const formasPago = [
    { tipo: "Contado", monto: resumenReserva.total },
    { tipo: "Mínimo por huésped (c/u)", monto: 50 },
  ];

  // Estado de forma de pago seleccionada
  const [selectedFormaPago, setSelectedFormaPago] = useState(null);

  // formatear la fecha recibida de resumenReserva de "dd/mm/yyyy" a "yyyy-mm-dd"
  // para poder enviarla como parámetro en la consulta SQL
  function formatearFecha(fecha) {
    const [dia, mes, año] = fecha.split("/"); // Dividir la fecha en partes
    return `${año}-${mes}-${dia}`; // Reordenar las partes en formato YYYY-MM-DD
  }

  // Fecha formateada a "yyyy-mm-dd"
  const fechaFormateada = formatearFecha(resumenReserva.fechaInicio);
  console.log("Fecha formateada a enviar", fechaFormateada);

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
        borderColor: "#16537e", // Cambia el borde cuando pasa el mouse
      },
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Asegura que el menú esté visible sobre otros elementos
    }),
  };

  // Esquema de validación
  const facturaSchema = yup.object({
    pago: yup
      .mixed()
      .required("Debe seleccionar una forma de pago")
      .test(
        "is-selected",
        "Debe seleccionar una opción válida",
        (value) => value !== null && value !== undefined
      ), // Validar que el valor no sea null
    numero: yup
      .string()
      .required("El número de tarjeta es requerido")
      .min(16, "El número de tarjeta no puede tener menos de 16 dígitos"),
    cvv: yup
      .string()
      .required("El CVV es requerido")
      .min(3, "El CVV no puede tener menos de 3 dígitos"),
    nombre: yup.string().required("El nombre del titular es requerido"),
  });

  //Función para manejar el form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(facturaSchema),
    mode: "onSubmit",
  });

  //Hooks de control de errores
  const [error, setError] = useState("");

  //Control de errores
  if (error) return <p>Error: {error.message}</p>;

  // Función para calcular el saldo
  const calcularSaldo = () => {
    // Calculamos el saldo dependiendo de la condición
    if (selectedFormaPago === resumenReserva.total) {
      return 0; // Si es igual, el saldo es 0
    } else {
      // Si no es igual, calculamos el saldo
      return (
        parseInt(resumenReserva.total) -
        resumenReserva.habitaciones.reduce(
          (totalHuespedes, habitacion) =>
            totalHuespedes + parseInt(habitacion.cantidad),
          0
        ) *
          parseInt(selectedFormaPago)
      );
    }
  };

  //Constante para almacenar el saldo calculado
  const saldo = calcularSaldo();

  console.log("Saldo =", saldo);
  // Accion submit
  const onSubmit = async (data) => {
    try {
      // Validar el objeto con Yup de manera asíncrona
      const isValid = await facturaSchema.isValid(data);

      if (isValid) {
        const formData = {
          idReserva: resumenReserva.idReserva,
          idCruceroFecha: parseInt(resumenReserva.idCruceroFecha),
          saldo: saldo,
          idEstadoPago: saldo === 0 ? 1 : 2,
        };

        console.log(
          "Enviando datos de pago al form para actualizar reserva: ",
          formData
        );

        ReservaService.updateReserva(formData)
          .then((response) => {
            if (response.data) {
              console.log("Reserva actualizada correctamente");
              toast.success(`¡Pago exitoso!`, {
                duration: 2000,
                position: "top-center",
              });
              navigate("/reserva");
            }
          })
          .catch((error) =>
            console.error(
              "Error al actualizar la reserva con id: ",
              resumenReserva,
              error
            )
          );
      } else {
        console.error("Datos inválidos");
      }
    } catch (error) {
      console.error("Error al validar los datos:", error);
    }
  };

  //use Effect para obtener la fecha límite de pagos del crucero
  // junto con el id crucerofecha
  useEffect(() => {
    if (resumenReserva !== null) {
      CruceroFechaService.getCruceroFecha(
        resumenReserva.crucero,
        fechaFormateada
      )
        .then((response) => {
          console.log("Fecha límite de pago: ", response.data.fechaLimitePagos);
          setFechaLimite(response.data.fechaLimitePagos);
          resumenReserva.idCruceroFecha = response.data.idCruceroFecha;
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    }
  }, []);

  //Cargar el grid del componente.
  return (
    <>
      <Grid container spacing={3}>
        {/* Datos de la reserva (lado izquierdo) */}
        <Grid size={8} sm={6}>
          <Box
            sx={{
              position: "relative",
              width: "50vw",
              maxWidth: "600px",
              bgcolor: "background.paper",
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
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
                <FormControl fullWidth>
                  <Controller
                    name="pago"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field} // Asegura que el input esté vinculado con react-hook-form
                        options={formasPago.map((pago) => ({
                          label: `${pago.tipo} = $${pago.monto}`,
                          value: pago.monto,
                        }))}
                        onChange={(selectedOption) => {
                          console.log(
                            "Monto seleccionado a pagar hoy : ",
                            selectedOption.value
                          );
                          setSelectedFormaPago(selectedOption.value); // Actualiza el valor seleccionado
                          field.onChange(selectedOption);
                        }}
                        styles={{
                          ...customStyles,
                          container: (provided) => ({
                            ...provided,
                            width: "100%", // Asegura que el select ocupe el 100% del espacio disponible
                          }),
                          control: (provided, state) => ({
                            ...provided,
                            borderColor: state.isFocused
                              ? "#16537e"
                              : errors.pago
                                ? "red"
                                : "#ccc", // Establecer color de borde rojo si hay error
                            "&:hover": {
                              borderColor: errors.pago ? "red" : "#16537e",
                            },
                          }),
                        }}
                        placeholder="Seleccione una forma de pago"
                        isInvalid={Boolean(errors.pago)} //para manejar el estado de error
                        isSearchable={false} // Evitar que el usuario escriba sobre el Select
                      />
                    )}
                  />

                  {/* Mostrar error si existe */}
                  {errors.pago && (
                    <Typography variant="body2" color="error" mt={1}>
                      {errors.pago.message}
                    </Typography>
                  )}
                </FormControl>
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
                    {console.log(
                      "Valor de selectedFormaPago",
                      selectedFormaPago
                    )}
                    {
                      // Verificar que resumenReserva, total, habitaciones y selectedFormaPago existan
                      resumenReserva &&
                      resumenReserva.total &&
                      selectedFormaPago === resumenReserva.total
                        ? 0
                        : saldo
                    }
                  </Typography>
                </Grid>

                {/* Mostrar si la tarjeta es Visa o Mastercard */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Typography id="typeText" variant="subtitle1">
                      {cardIcon}
                    </Typography>
                  </FormControl>
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
                            onChange={handleCardNumberChange}
                            error={Boolean(errors.numero)}
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
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      locale={es}
                    >
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
                <Grid item size={4} xs={12} sm={6}>
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
                            error={Boolean(errors.cvv)}
                            helperText={errors.cvv?.message}
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
            <Typography align="center" variant="h5" gutterBottom color="¨black">
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

              <Grid item container direction="row" xs={12} alignItems="center">
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

              <Grid item container direction="row" xs={12} alignItems="center">
                <Typography variant="subtitle1">
                  <b>Total por complementos:</b>
                </Typography>
                <Typography>$ {resumenReserva.totalComplementos}</Typography>
              </Grid>

              <Grid item container direction="row" xs={12} alignItems="center">
                <Typography variant="subtitle1">
                  <b>Subtotal :</b>
                </Typography>
                <Typography>$ {resumenReserva.subTotal}</Typography>
              </Grid>

              <Grid item container direction="row" xs={12} alignItems="center">
                <Typography variant="subtitle1">
                  <b>Impuesto (IVA) :</b>
                </Typography>
                <Typography> {resumenReserva.impuesto * 100}%</Typography>
              </Grid>

              <Grid item container direction="row" xs={12} alignItems="center">
                <Typography variant="subtitle1">
                  <b>Tarifa portuaria :</b>
                </Typography>
                <Typography>$ {resumenReserva.tarifaPortuaria}</Typography>
              </Grid>

              <Grid item container direction="row" xs={12} alignItems="center">
                <Typography variant="subtitle1">
                  <b>Total :</b>
                </Typography>
                <Typography>$ {resumenReserva.total}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
