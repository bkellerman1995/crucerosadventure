import React from "react";
import {useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useForm} from "react-hook-form";
import { Tooltip, List, ListItem, Input, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { ModalGestionHuespedes } from "./ModalGestionHuespedes";
import CrucerosService from "../../services/CrucerosService";
import {useUsuarioContext} from "../../context/usuarioContext";


export function Facturacion() {
  
  // Usar el contexto para acceder al usuario
  const { usuario } = useUsuarioContext();

  const { state } = useLocation();

  // Acceder a resumenReserva
  const { resumenReserva } = state;

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

  //Cargar el grid del componente.
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={3}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              <b>Facturación</b>
            </Typography>
          </Grid>

          {/* Datos de la reserva (lado izquierdo) */}
          <Grid size={8} sm={6}>
            <Typography variant="subtitle1">
              <b>Usuario: </b> {usuario.nombre} ({usuario.correoElectronico})
            </Typography>
            <br></br>
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
                  {/* <Typography variant="subtitle1">
                    <b>{resumenReserva.complementos}</b>
                  </Typography> */}
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
