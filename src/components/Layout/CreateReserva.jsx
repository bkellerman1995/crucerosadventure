import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import * as yup from "yup";
import { format, addDays } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import CruceroService from "../../services/CrucerosService";
import toast from "react-hot-toast";
import Select from "react-select";
import { ListBox } from "primereact/listbox";
import { ModalGestionPuertos } from "./ModalGestionPuertos";
import { ModalGestionFechas } from "./ModalGestionFechas";
import ItinerarioService from "../../services/ItinerarioService";
import HabitacionDisponibleFechaService from "../../services/HabitacionDisponibleFechaService";

export function CreateReserva() {
  const navigate = useNavigate();

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

  // Esquema de validación
  const cruceroSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .min(2, "Debe tener al menos 2 caracteres")
      .max(50, "No debe sobrepasar los 50 caracteres"),

    cantDias: yup
      .number()
      .typeError("Debe ser un número")
      .required("La cantidad de días es requerida")
      .positive("Debe ser un número positivo")
      .min(7, "La cantidad de días debe ser al menos 7")
      .max(14, "La cantidad de días no debe ser mayor a 14"),

    foto: yup
      .mixed()
      .required("La imagen es obligatoria")
      .test("fileType", "Debe cargar una imagen (jpg, png, jpeg)", (value) => {
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      })
      .test(
        "fileSize",
        "El tamaño debe ser menor a 500MB",
        (value) => value && value.size <= 524288000 // Verifica si el tamaño del archivo es menor a 500 MB (524288000 bytes)
      ),
  });

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
    resolver: yupResolver(cruceroSchema),
  });

  // Estado para controlar la apertura del modal de Gestion Cruceros
  const [openModalGestPuertos, setOpenModalGestPuertos] = useState(false);

  // Estado para controlar la apertura del modal de Gestion Fechas y Precios
  const [openModalGestFechas, setOpenModalGestFechas] = useState(false);

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Estado de cruceros cargados en el select
  const [selectedCrucero, setSelectedCrucero] = useState(null);
  const [dataCrucero, setDataCrucero] = useState([]);
  const [loadedCrucero, setLoadedCrucero] = useState(false);

  // Estado para almacenar el id del crucero
  const [idCrucero, setIdCrucero] = useState(null);

  // Estado para las fechas asignadas al crucero seleccionado
  const [fechasSalida, setFechasSalida] = useState(false);

  //Estado de los puertos añadidos al itinerario
  const [puertosItinerario, setPuertosItinerario] = useState(false);

  //Estado de las fecas añadidas al crucero
  const [fechasCrucero, setFechasCrucero] = useState(false);

  // Estado para la fecha seleccionada
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  // Estado para almacenar las habitaciones disponibles
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);

  // Estado para almacenar la habitación seleccionada
  const [selectedHabitacion, setSelectedHabitacion] = useState([]);

  // Estado para controlar las habitaciones seleccionadas del listbox
  const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState(
    []
  );

  //Control de errores
  if (error) return <p>Error: {error.message}</p>;

  //Cargar los cruceros al iniciar el componente
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
      const isValid = await cruceroSchema.isValid(DataForm);

      if (isValid) {
        //Acceder al nombre del archivo de la foto
        const fotoNombre = DataForm.foto
          ? DataForm.foto.name
          : "No hay foto cargada";

        console.log("Nombre del archivo cargado:", fotoNombre);
        //Extraer el barco del objeto DataForm
        const { barco, ...restoDeDataForm } = DataForm;
        //adjuntar el nombre de la imagen a la ruta por defecto

        // Agregar la ruta al objeto DataForm como un campo adicional
        const dataConRuta = {
          ...restoDeDataForm, // Copiar todos los demás datos
          idbarco: barco?.value,
        };

        console.log("Enviando datos del crucero al form: ", dataConRuta);
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
          <Grid size={12} sm={12} >
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

                      //Realizar una consulta para obtener las habitaciones disponibles
                      //para la fecha seleccionada

                      try {
                        const fechaSeleccionada = selectedOption.value;

                        const response =
                          await HabitacionDisponibleFechaService.getDisponibilidadHabitacionPorFechaByCrucero(
                            idCrucero,
                            fechaSeleccionada
                          );

                        //Verificar si hay habitaciones disponibles
                        if (response.data && response.data.length > 0) {
                          setHabitacionesDisponibles(response.data); // Establecer habitaciones disponibles
                        } else if (response.data === null) {
                          toast.error(
                            "No hay habitaciones disponibles para esta fecha.",
                            { duration: 1500 }
                          );
                          setHabitacionesDisponibles([]); // Limpiar habitaciones si no hay disponibles
                        }
                      } catch (error) {
                        console.error(
                          "Error al obtener las habitaciones disponibles:",
                          error
                        );
                        toast.error(
                          "Hubo un error al obtener las habitaciones disponibles."
                        );
                      }
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
            <Grid container spacing={2} alignItems="stretch" size= {15}>
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
                          console.log("Habitacion seleccionada en ´Habitaciones disponibles:", e.value); // Muestra los ids de las habitaciones seleccionadas
                          // Acciones cuando se selecciona una habitación
                          setSelectedHabitacion(e.value); // Actualizar el estado de la habitación seleccionada
                          setValue("habitacion", e.value); //'e.value' tiene todo el objeto "habitación" seleccionado
                        }}
                        value={selectedHabitacion}
                        placeholder="Seleccione una habitación"
                      />
                    </>
                  ) : (
                    <Typography>
                      No hay habitaciones disponibles para esta fecha
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Botón para agregar habitación */}
              <Tooltip title="Agregar Habitación">
                <IconButton
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "10px",
                    width: "60px",
                    height: "50px",
                    marginTop: "20px",
                  }}
                  onClick={() => {
                    if (selectedHabitacion) {
                      console.log("Habitación agregada", selectedHabitacion);
                      setHabitacionesSeleccionadas([
                        ...habitacionesSeleccionadas,
                        selectedHabitacion, //Añadir el objeto completo de la habitación
                      ]); // Agregar habitación seleccionada al nuevo listbox
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>

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
                    multiple
                    options={habitacionesSeleccionadas.map((habitacion) => ({
                      label: `${habitacion.nombre}/ $${habitacion.precio} 
                      /Min: ${habitacion.minHuesped} /Max: ${habitacion.maxHuesped}
                      / ${habitacion.nombreCategoria}`, // Mostrar información relevante                      
                      value: habitacion,
                    }))}
                    className="w-full md:w-14rem"
                    onChange={(e) => {
                      console.log("Habitacion seleccionada en ´Habitaciones seleccionadas´:", e.value); // Muestra los ids de las habitaciones seleccionadas
                      // Acciones cuando se selecciona una habitación
                      setSelectedHabitacion(e.value); // Actualizar el estado de la habitación seleccionada
                      setValue("habitacion", e.value); //'e.value' tiene todo el objeto "habitación" seleccionado
                    }}
                    value={habitacionesSeleccionadas.map((h) => h.idHabitacion)} // Usar las ids como valores seleccionados                    placeholder="Habitaciones seleccionadas"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/*Datos del crucero (lado derecho) */}

          <Grid container direction="stretch" spacing={2}>
            <Grid
              item
              xs={12}
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "16px",
                padding: "10px",
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

              <Grid container spacing={2}>

              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </form>

      {/* Modal importado para Gestión de puertos */}
      <ModalGestionPuertos
        open={openModalGestPuertos}
        handleClose={() => setOpenModalGestPuertos(false)}
        control={{ ...control, setValue }}
        setPuertosItinerario={setPuertosItinerario}
        idCrucero={idCrucero} // Pasar el id del crucero
      />

      {/* Modal importado para Gestión de fechas y habitaciones */}
      <ModalGestionFechas
        open={openModalGestFechas}
        handleClose={() => setOpenModalGestFechas(false)}
        setFechasCrucero={setFechasCrucero}
        idCrucero={idCrucero} // Pasar el id del crucero
      />
    </>
  );
}
