import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useForm} from "react-hook-form";
import { Tooltip } from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import IconButton from "@mui/material/IconButton";
import * as yup from "yup";
import { format, addDays } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import CruceroService from "../../services/CrucerosService";
import toast from "react-hot-toast";
import Select from "react-select";
import { ListBox } from "primereact/listbox";
import { ModalGestionHuespedes } from "./ModalGestionHuespedes";
import HabitacionDisponibleFechaService from "../../services/HabitacionDisponibleFechaService";
import HuespedService from "../../services/HuespedService";
import ComplementoService from "../../services/ComplementoService";
import CrucerosService from "../../services/CrucerosService";

export function CreateReserva() {
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

  // Estado para controlar la apertura del modal de Gestion Huéspedes
  const [openModalGestHuespedes, setOpenModalGestHuespedes] = useState(false);

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Estado de cruceros cargados en el select
  const [selectedCrucero, setSelectedCrucero] = useState(null);
  const [dataCrucero, setDataCrucero] = useState([]);
  const [loadedCrucero, setLoadedCrucero] = useState(false);

  // Estado para almacenar el id del crucero
  const [idCrucero, setIdCrucero] = useState(null);

  // Estado para almacenar el id de habitación
  const [idHabitacion, setIdHabitacion] = useState(null);

  // Estado para almacenar la cantidad máxima de huéspedes
  const [maxHuespedes, setMaxHuespedes] = useState(null);

  // Estado para las fechas asignadas al crucero seleccionado
  const [fechasSalida, setFechasSalida] = useState(false);

  // Estado para la fecha seleccionada
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  // Estado para almacenar las habitaciones disponibles
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);

  // Estado para almacenar los complementos disponibles
  const [complementosDisponibles, setComplementosDisponibles] = useState([]);

  // Estado para almacenar la habitación seleccionada
  const [selectedHabitacionDisponible, setSelectedHabitacionDisponible] =
    useState([]);

  // Estado para almacenar el complemento seleccionado
  const [selectedComplementoDisponible, setSelectedComplementoDisponible] =
    useState([]);

  // Estado para almacenar la habitación agregada
  const [selectedHabitacionAgregada, setSelectedHabitacionAgregada] = useState(
    []
  );

  // Estado para almacenar el complemento agregado
  const [selectedComplementoAgregado, setSelectedComplementoAgregado] =
    useState([]);

  // Estado para controlar las habitaciones seleccionadas del listbox
  const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState(
    []
  );

  // Estado para controlar los complementos seleccionados del listbox
  const [complementosSeleccionados, setComplementosSeleccionados] = useState(
    []
  );

  // Estado para manejar los puertos de salida y regreso
  const [puertoSalida, setPuertoSalida] = useState("");
  const [puertoRegreso, setPuertoRegreso] = useState("");

  // Estado para actualizar la información del resumen de la reserva
  const [resumenReserva, setResumenReserva] = useState({
    crucero: "",
    fechaSalida: "",
    puertoSalida: "",
    puertoRegreso: "",
    habitaciones: [],
    complementos: [],
    total: 0,
  });

  //Control de errores
  if (error) return <p>Error: {error.message}</p>;

  //Use Effect para renderizar las habitaciones disponibles y habitaciones seleccionadas [idCrucero, fechaSeleccionada]
  useEffect(() => {
    if (idCrucero && fechaSeleccionada) {
      console.log("idCrucero:", idCrucero);
      console.log("fechaSeleccionada", fechaSeleccionada.value);
      HabitacionDisponibleFechaService.getDisponibilidadHabitacionPorFechaByCrucero(
        idCrucero,
        fechaSeleccionada.value
      )
        .then((response) => {
          // Forzar el manejo de código de estado dentro de .then() para no entrar en el catch
          // console.log("Respuesta del servidor:", response);

          if (response.status >= 200 && response.status < 300) {
            // Si la respuesta es correcta
            if (response.data && response.data.length > 0) {
              setHabitacionesDisponibles(response.data); // Establecer habitaciones disponibles
            } else {
              setHabitacionesDisponibles([]); // Limpiar habitaciones disponibles
              setHabitacionesSeleccionadas([]); //Limpiar habitaciones seleccionadas
            }
          } else {
            setHabitacionesDisponibles([]); // Limpiar habitaciones disponibles
            setHabitacionesSeleccionadas([]); //Limpiar habitaciones seleccionadas
          }
        })
        .catch((error) => {
          // Manejar el error si ocurre fuera de los casos normales
          console.error(
            "Error al obtener las habitaciones disponibles:",
            error
          );
          toast.error("Hubo un error al obtener las habitaciones disponibles.");
        });

      ComplementoService.getComplementos()
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            // Si la respuesta es correcta
            if (response.data && response.data.length > 0) {
              setComplementosDisponibles(response.data); // Establecer complementos disponibles
            } else {
              setComplementosDisponibles([]); // Limpiar complementos disponibles
              setComplementosSeleccionados([]); //Limpiar complementos seleccionados
            }
          } else {
            setComplementosDisponibles([]); // Limpiar complementos disponibles
            setComplementosSeleccionados([]); //Limpiar complementos seleccionados
          }
        })
        .catch((error) => {
          // Manejar el error si ocurre fuera de los casos normales
          console.error(
            "Error al obtener las habitaciones disponibles:",
            error
          );
          toast.error("Hubo un error al obtener las habitaciones disponibles.");
        });
    }
  }, [idCrucero, fechaSeleccionada]);

  //Use Effect para cargar los cruceros al cargar la página "[]"
  useEffect(() => {
    CruceroService.getCruceros()
      .then((response) => {
        console.log("Cruceros cargados", response);
        setDataCrucero(response.data);

        setLoadedCrucero(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedCrucero(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  // Use effect para vaciar el listbox de "Complementos seleccionados" si
  // el listbox de "Habitaciones seleccionadas" se vacía
  useEffect(() => {
    if (habitacionesSeleccionadas.length === 0) {
      setComplementosSeleccionados([]); // Vaciar complementos cuando no hay habitaciones seleccionadas
    }
  }, [habitacionesSeleccionadas]); //escucha cuando haya un cambio en "habitacionesSeleccionadas"

  // Use effect para cambiar dinámicamente la información en "Resumen Reserva"
  useEffect(() => {
    console.log("Crucero seleccionado: ", selectedCrucero);
    console.log("Fecha seleccionada: ", fechaSeleccionada);
    console.log ("Habitaciones seleccionadas", habitacionesSeleccionadas);
    console.log ("Complementos seleccionados", complementosSeleccionados);


    // Evitar el retorno anticipado, dejar que el efecto se ejecute siempre
    let total = 0;
    let puertos = [];
    let puertoSalida = "";
    let puertoRegreso = "";

    // Si no hay información, no hacer nada, pero sin retornar anticipadamente
    if (
      (selectedCrucero ||
      fechaSeleccionada) ||
      habitacionesSeleccionadas.length > 0 ||
      complementosSeleccionados.length > 0
    ) {
      // Calcular el total de las habitaciones y complementos seleccionados
      habitacionesSeleccionadas.forEach((habitacion) => {
        total += habitacion.precio;
      });

      complementosSeleccionados.forEach((complemento) => {
        total += complemento.precio;
      });

      const fetchCruceroData = async () => {
        try {
          // Obtener los datos del crucero
          const response = await CrucerosService.getCrucerobyId(
            selectedCrucero.value
          );
          puertos = response.data.puertosItinerario;
          puertoSalida = puertos[0].puerto.nombre;
          puertoRegreso = puertos[puertos.length - 1].puerto.nombre;

          // Actualizar el estado con los datos obtenidos
          setResumenReserva((prevState) => ({
            ...prevState,
            crucero: selectedCrucero ? selectedCrucero.label : "",
            fechaSalida: fechaSeleccionada ? fechaSeleccionada.label : "",
            puertoSalida: puertoSalida,
            puertoRegreso: puertoRegreso,
            habitaciones: habitacionesSeleccionadas.map(
              (habitacion) => habitacion.nombre
            ),
            complementos: complementosSeleccionados.map(
              (complemento) => complemento.nombre
            ),
            total: total,
          }));
        } catch (error) {
          console.error("Error al obtener los datos del crucero:", error);
          setError(error);
        }
      };

      // Llamar la función asíncrona solo si los datos están disponibles
      fetchCruceroData();
    } else {
      return;
    }
  }, [
    selectedCrucero,
    fechaSeleccionada,
    habitacionesSeleccionadas,
    complementosSeleccionados,
  ]);
  



  //Función para manejar la eliminación de la habitación
  //seleccionada cuando se cierre el modal de "ModalGestionHuespedes"
  const eliminarHabitacionSeleccionada = (idHabitacion) => {
    // Eliminar la habitación de las seleccionadas
    setHabitacionesSeleccionadas((prevHabitaciones) =>
      prevHabitaciones.filter(
        (habitacion) => habitacion.idHabitacion !== idHabitacion
      )
    );
  };

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
              <b>Generar reserva</b>
            </Typography>
          </Grid>

          {/* Datos de la reserva (lado izquierdo) */}
          <Grid size={8} sm={6}>
            {/* Crucero */}
            <Grid size={6} sm={4}>
              <Typography variant="subtitle1">
                <b>Crucero</b>
              </Typography>

              <FormControl fullWidth>
                {loadedCrucero && (
                  <Select
                    options={dataCrucero.map((crucero) => ({
                      label: (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {crucero.nombre}

                          <img
                            src={crucero.foto}
                            alt={crucero.nombre}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                      ),
                      value: crucero.idCrucero,
                    }))}
                    onChange={(selectedOption) => {
                      setSelectedCrucero(selectedOption);
                      setValue("crucero", selectedOption);

                      //Restablecer el valor de fechaSalida al cambiar el crucero
                      setFechaSeleccionada(null);

                      //Obtener las fechas asignadas al crucero seleccionado
                      if (selectedOption) {
                        setIdCrucero(selectedOption.value); //Actualizar el idCrucero
                        CruceroService.getCrucerobyId(selectedOption.value)
                          .then((response) => {
                            setFechasSalida(
                              response.data.fechasAsignadas || []
                            );
                          })
                          .catch((error) => {
                            console.error(
                              "Error al cargar las fechas del crucero:",
                              error
                            );
                          });
                      }
                    }}
                    value={selectedCrucero}
                    styles={customStyles}
                    placeholder="Seleccione un crucero"
                  />
                )}
              </FormControl>
            </Grid>
            <br></br>

            {/* Fecha del Crucero */}
            <Grid size={6} sm={4}>
              <Typography variant="subtitle1">
                <b>Fecha del crucero</b>
              </Typography>

              <FormControl fullWidth>
                {loadedCrucero && fechasSalida.length > 0 && (
                  <Select
                    options={fechasSalida.map((fecha) => ({
                      label: `${format(addDays(new Date(fecha), 1), "dd/MM/yyyy")}`, //Mostrar la fecha en formato dd/MM/yyyy
                      value: fecha, //Usar la fecha como valor
                    }))}
                    onChange={async (selectedOption) => {
                      //Actualizar la fecha seleccionada
                      setFechaSeleccionada(selectedOption);
                    }}
                    value={fechaSeleccionada} // Asegurarse de que el valor del select se restablezca para que se muestre el placeholder
                    styles={customStyles}
                    placeholder="Seleccione una fecha de salida"
                  />
                )}
              </FormControl>
            </Grid>

            <br></br>

            {/* Grid contenedor de las habitaciones */}
            <Grid container spacing={2} alignItems="stretch" size={15}>
              <Grid
                xs={6}
                sm={6}
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "16px",
                  padding: "10px",
                }}
              >
                <Typography variant="subtitle1">
                  <b>Habitaciones disponibles</b>
                </Typography>
                <br />
                <FormControl fullWidth>
                  {habitacionesDisponibles.length > 0 ? (
                    <>
                      <ListBox
                        // multiple
                        options={habitacionesDisponibles.map((habitacion) => ({
                          label: `${habitacion.nombre}/ $${habitacion.precio} 
                      /Min: ${habitacion.minHuesped} /Max: ${habitacion.maxHuesped}
                      / ${habitacion.nombreCategoria}`, // Mostrar información relevante
                          value: habitacion, //Guardar el objeto habitación completo
                          // group: habitacion.nombreCategoria, // Agrupar por nombre de categoría
                        }))}
                        className="w-full md:w-14rem"
                        onChange={(e) => {
                          console.log(
                            "Habitacion seleccionada en ´Habitaciones disponibles:",
                            e.value
                          ); // Muestra los ids de las habitaciones seleccionadas
                          // Acciones cuando se selecciona una habitación
                          setSelectedHabitacionDisponible(e.value); // Actualizar el estado de la habitación seleccionada
                          setValue("habitacion", e.value); //'e.value' tiene todo el objeto "habitación" seleccionado
                        }}
                        value={selectedHabitacionDisponible}
                        placeholder="Seleccione una habitación"
                      />
                    </>
                  ) : (
                    <Typography>No hay habitaciones disponibles</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
                marginTop={3}
              >
                {/* Botón para agregar habitación */}
                <Tooltip title="Agregar Habitación">
                  <IconButton
                    style={
                      habitacionesDisponibles.length > 0
                        ? {
                            backgroundColor: "green",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                        : {
                            backgroundColor: "gray",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                    }
                    onClick={() => {
                      // Verificar si se ha seleccionado una habitación
                      if (selectedHabitacionDisponible.length === 0) {
                        toast.error(
                          "Debe seleccionar una habitación de la lista 'Habitaciones Disponibles'",
                          {
                            duration: 1500,
                            position: "top-center",
                          }
                        );
                        return; // No agregar la habitación si no hay una seleccionada
                      }

                      //Verificar si la habitación ya ha sido seleccionada
                      const isAlreadySelected = habitacionesSeleccionadas.some(
                        (habitacion) =>
                          habitacion.idHabitacion ===
                          selectedHabitacionDisponible.idHabitacion
                      );

                      if (!isAlreadySelected && selectedHabitacionDisponible) {
                        console.log(
                          "Habitación agregada",
                          selectedHabitacionDisponible
                        );

                        //Configurar el idHabitacion para abrir el modalGestionHuespedes
                        setIdHabitacion(
                          selectedHabitacionDisponible.idHabitacion
                        );
                        console.log(
                          "Habitación enviada al modal:",
                          selectedHabitacionDisponible
                        );
                        setHabitacionesSeleccionadas([
                          ...habitacionesSeleccionadas,
                          selectedHabitacionDisponible, //Añadir el objeto completo de la habitación
                        ]); // Agregar habitación seleccionada al nuevo listbox
                        setSelectedHabitacionAgregada(null);
                        setMaxHuespedes(
                          selectedHabitacionDisponible.maxHuesped
                        );
                        console.log(
                          "Enviando la cant Máxima de huéspedes al modal: ",
                          maxHuespedes
                        );
                        setOpenModalGestHuespedes(true);
                      } else {
                        toast.error("Esta habitación ya ha sido agregada.", {
                          duration: 1500,
                          position: "top-center",
                        });
                        return;
                      }
                    }}
                    disabled={habitacionesDisponibles.length > 0 ? false : true}
                  >
                    <KeyboardDoubleArrowRightIcon />
                  </IconButton>
                </Tooltip>

                {/* Botón para quitar habitación */}
                <Tooltip title="Quitar Habitación">
                  <IconButton
                    style={
                      habitacionesSeleccionadas.length > 0
                        ? {
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                        : {
                            backgroundColor: "gray",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                    }
                    onClick={() => {
                      // Verificar si hay una habitación seleccionada en el ListBox de "Habitaciones seleccionadas"
                      if (selectedHabitacionAgregada !== null) {
                        console.log(
                          "Habitacion seleccionada: ",
                          selectedHabitacionAgregada
                        );
                        // Filtrar las habitaciones seleccionadas para eliminar la seleccionada
                        setHabitacionesSeleccionadas((prev) =>
                          prev.filter(
                            (habitacion) =>
                              habitacion.idHabitacion !==
                              selectedHabitacionAgregada.idHabitacion
                          )
                        );

                        // Eliminar los huéspedes en la base de datos (HuespedService.deleteHuesped)
                        habitacionesSeleccionadas.forEach((habitacion) => {
                          if (habitacion) {
                            HuespedService.deleteHuesped(idHabitacion) // Aquí suponemos que cada huesped tiene un campo 'id'
                              .then((response) => {
                                if (response?.data) {
                                  console.log(
                                    `Huésped de habitación ${habitacion.idHabitacion} eliminado exitosamente`
                                  );
                                }
                              })
                              .catch((error) => {
                                console.error(
                                  `Error al eliminar huésped con de habitación ${habitacion.idHabitacion}`,
                                  error
                                );
                              });
                          }
                        });
                      } else {
                        toast.error(
                          "Por favor seleccione una habitación para quitar.",
                          {
                            duration: 1500,
                            position: "top-center",
                          }
                        );
                      }
                    }}
                    disabled={
                      habitacionesSeleccionadas.length > 0 ? false : true
                    }
                  >
                    <KeyboardDoubleArrowLeftIcon />
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Mostrar habitaciones seleccionadas */}
              <Grid
                xs={6}
                sm={6}
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "16px",
                  padding: "10px",
                }}
              >
                <Typography variant="subtitle1">
                  <b>Habitaciones seleccionadas</b>
                </Typography>
                <br />
                <FormControl fullWidth>
                  <ListBox
                    options={habitacionesSeleccionadas.map((habitacion) => ({
                      label: `${habitacion.nombre}/ $${habitacion.precio} 
                      /Min: ${habitacion.minHuesped} /Max: ${habitacion.maxHuesped}
                      / ${habitacion.nombreCategoria}`, // Mostrar información relevante
                      value: habitacion,
                    }))}
                    className="w-full md:w-14rem"
                    onChange={(e) => {
                      console.log(
                        "Habitacion seleccionada en ´Habitaciones seleccionadas´:",
                        e.value
                      );
                      setSelectedHabitacionAgregada(e.value); // Actualizar el estado de la habitación seleccionada
                      setValue("habitacion", e.value); //'e.value' tiene todo el objeto "habitación" seleccionado
                    }}
                    value={selectedHabitacionAgregada} // Usar el objeto completo de las habitaciones seleccionadas
                    emptyMessage="No hay habitaciones seleccionadas"
                    itemContent={(habitacion) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          {habitacion.nombre}/ ${habitacion.precio}
                          /Min: {habitacion.minHuesped} /Max:
                          {habitacion.maxHuesped}/ {habitacion.nombreCategoria}
                        </span>
                      </div>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br></br>

            {/* Grid contenedor de los complementos */}
            <Grid container spacing={2} alignItems="stretch" size={15}>
              <Grid
                xs={6}
                sm={6}
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "16px",
                  padding: "10px",
                }}
              >
                <Typography variant="subtitle1">
                  <b>Complementos disponibles</b>
                </Typography>
                <br />
                <FormControl fullWidth>
                  {complementosDisponibles.length > 0 ? (
                    <>
                      <ListBox
                        // multiple
                        options={complementosDisponibles.map((complemento) => ({
                          label: `${complemento.nombre}/ $${complemento.precio} 
                      /Aplica por: ${complemento.precioAplicado}`, // Mostrar información relevante
                          value: complemento, //Guardar el objeto complemento completo
                        }))}
                        className="w-full md:w-14rem"
                        onChange={(e) => {
                          console.log(
                            "Complemento seleccionado en ´Complementos disponibles´:",
                            e.value
                          ); // Muestra los ids de las complementos seleccionados
                          // Acciones cuando se selecciona un complemento
                          setSelectedComplementoDisponible(e.value); // Actualizar el estado del complemento seleccionado
                          setValue("complemento", e.value); //'e.value' tiene todo el objeto "habitación" seleccionado
                        }}
                        value={selectedComplementoDisponible}
                        placeholder="Seleccione un complemento"
                      />
                    </>
                  ) : (
                    <Typography>No hay complementos disponibles</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
                marginTop={3}
              >
                {/* Botón para agregar complemento */}
                <Tooltip title="Agregar Complemento">
                  <IconButton
                    style={
                      complementosDisponibles.length > 0 &&
                      habitacionesSeleccionadas.length > 0
                        ? {
                            backgroundColor: "green",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                        : {
                            backgroundColor: "gray",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                    }
                    onClick={() => {
                      // Verificar si se ha seleccionado un complemento
                      if (selectedComplementoDisponible.length === 0) {
                        toast.error(
                          "Debe seleccionar un complemento de la lista 'Complementos Disponibles'",
                          {
                            duration: 1500,
                            position: "top-center",
                          }
                        );
                        return; // No agregar el complemento si no hay uno seleccionado
                      }

                      //Verificar si el complemento ya ha sido seleccionado
                      const isAlreadySelected = complementosSeleccionados.some(
                        (complemento) =>
                          complemento.idComplemento ===
                          selectedComplementoDisponible.idComplemento
                      );

                      if (!isAlreadySelected && selectedComplementoDisponible) {
                        console.log(
                          "Complemento agregado",
                          selectedComplementoDisponible
                        );

                        setComplementosSeleccionados([
                          ...complementosSeleccionados,
                          selectedComplementoDisponible, //Añadir el objeto completo del complemento
                        ]); // Agregar complemento seleccionado al nuevo listbox
                        setSelectedComplementoAgregado(null);
                      } else {
                        toast.error("Este complemento ya ha sido agregado.", {
                          duration: 1500,
                          position: "top-center",
                        });
                        return;
                      }
                    }}
                    disabled={
                      complementosDisponibles.length > 0 &&
                      habitacionesSeleccionadas.length > 0
                        ? false
                        : true
                    }
                  >
                    <KeyboardDoubleArrowRightIcon />
                  </IconButton>
                </Tooltip>

                {/* Botón para quitar complemento */}
                <Tooltip title="Quitar Complemento">
                  <IconButton
                    style={
                      complementosSeleccionados.length > 0
                        ? {
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                        : {
                            backgroundColor: "gray",
                            color: "white",
                            borderRadius: "10px",
                            width: "60px",
                            height: "50px",
                            // marginTop: "60px",
                          }
                    }
                    onClick={() => {
                      // Verificar si hay un complemento seleccionado en el ListBox de "Complementos seleccionados"
                      if (selectedComplementoAgregado != null) {
                        console.log(
                          "Complemento seleccionado en 'Complementos seleccionados': ",
                          selectedComplementoAgregado
                        );
                        // Filtrar los complementos seleccionados para eliminar el seleccionado
                        setComplementosSeleccionados((prev) =>
                          prev.filter(
                            (complemento) =>
                              complemento.idComplemento !==
                              selectedComplementoAgregado.idComplemento
                          )
                        );
                      } else {
                        toast.error(
                          "Por favor seleccione un complemento para quitar.",
                          {
                            duration: 1500,
                            position: "top-center",
                          }
                        );
                      }
                    }}
                    disabled={
                      complementosSeleccionados.length > 0 ? false : true
                    }
                  >
                    <KeyboardDoubleArrowLeftIcon />
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Mostrar complementos seleccionados */}
              <Grid
                xs={6}
                sm={6}
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "16px",
                  padding: "10px",
                }}
              >
                <Typography variant="subtitle1">
                  <b>Complementos seleccionados</b>
                </Typography>
                <br />
                <FormControl fullWidth>
                  <ListBox
                    options={complementosSeleccionados.map((complemento) => ({
                      label: `${complemento.nombre}/ $${complemento.precio * habitacionesSeleccionadas.length} 
                      /Aplica por: ${complemento.precioAplicado}`, // Mostrar información relevante
                      value: complemento, //Guardar el objeto complemento completo
                    }))}
                    className="w-full md:w-14rem"
                    onChange={(e) => {
                      console.log(
                        "Complemento seleccionado en ´Complementos seleccionados´:",
                        e.value
                      );
                      setSelectedComplementoAgregado(e.value); // Actualizar el estado del complemento seleccionado
                      setValue("complemento", e.value); //'e.value' tiene todo el objeto "habitación" seleccionado
                    }}
                    value={selectedComplementoAgregado} // Usar el objeto completo de los complementos seleccionados
                    emptyMessage="No hay complementos cargados"
                    itemContent={(complemento) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          {complemento.nombre}/ ${complemento.precio}
                          /Aplica por: {complemento.precioAplicado}
                        </span>
                      </div>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br></br>

            {/* Botón Reservar*/}
            <Grid size={4} sm={4} spacing={1}>
              <Button
                variant="contained"
                // type="submit"
                style={
                  habitacionesSeleccionadas.length > 0 &&
                  complementosSeleccionados.length > 0
                    ? {
                        backgroundColor: "blue",
                        color: "white",
                        borderRadius: "10px",
                        width: "100px",
                        height: "50px",
                      }
                    : {
                        backgroundColor: "gray",
                        color: "white",
                        borderRadius: "10px",
                        width: "100px",
                        height: "50px",
                      }
                }
                onClick={() => {
                  // if (puertosItinerario && fechasCrucero) {
                  //   toast.success(`Gestión de crucero exitosa`, {
                  //     duration: 2000,
                  //     position: "top-center",
                  //   });
                  //   navigate("/admin/crucero");
                  // }
                }}
                // Deshabilita el botón si no hay complementos o habitaciones seleccionadas
                disabled={
                  habitacionesSeleccionadas.length > 0 &&
                  complementosSeleccionados.length > 0
                    ? false
                    : true
                }
              >
                Reservar
              </Button>
            </Grid>
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
                  <Typography>{resumenReserva.crucero}</Typography>
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
                  <Typography>{resumenReserva.fechaSalida}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Habitaciones seleccionadas:</b>
                  </Typography>
                  <Typography>
                    {resumenReserva.habitaciones.join(", ")}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <b>Complementos seleccionados:</b>
                  </Typography>
                  <Typography>
                    {resumenReserva.complementos.join(", ")}
                  </Typography>
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

      {/* Modal importado para Gestión de Huéspedes */}
      <ModalGestionHuespedes
        open={openModalGestHuespedes}
        handleClose={() => setOpenModalGestHuespedes(false)}
        maxHuespedes={maxHuespedes}
        idHabitacion={idHabitacion} // Pasar el id de la habitación
        eliminarHabitacionSeleccionada={eliminarHabitacionSeleccionada} // Enviar funcion para eliminar habitación seleccionada
      />
    </>
  );
}
