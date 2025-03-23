import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import BarcoService from "../../services/BarcoService";
import CrucerosService from "../../services/CrucerosService";
import toast from "react-hot-toast";
import Select from "react-select";
import { ModalGestionPuertos } from './ModalGestionPuertos';
import { ModalGestionFechas } from './ModalGestionFechas';
import ItinerarioService from "../../services/ItinerarioService";


export function CreateCrucero() {
  const navigate = useNavigate();

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

    // foto: yup.required("La foto es requerida"),
    foto: yup
      .mixed()
      .test(
        "fileRequired",
        "La imagen es obligatoria",
        (value) => value && value.length > 0
      )
      .test(
        "fileType",
        "Solo se permiten imágenes (jpg, png, jpeg)",
        (value) =>
          value && value[0]
            ? ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
            : false
      )
      .test("fileSize", "El tamaño debe ser menor a 2MB", (value) =>
        value && value[0] ? value[0].size <= 2 * 1024 * 1024 : false
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
      descripcion: "",
      capacidadHuesped: "",
      estado: "",
      foto: "",
    },
    resolver: yupResolver(cruceroSchema),
  });

  // Estado para almacenar el valor de cantidad de días
  const [cantDias, setCantDias] = useState(7); // Valor mínimo predeterminado

  // Estado para controlar la apertura del modal de Gestion Cruceros
  const [openModalGestPuertos, setOpenModalGestPuertos] = useState(false);

  // Estado para controlar la apertura del modal de Ver Cruceros
  const [openModalVerPuertos, setOpenModalVerPuertos] = useState(false);

  // Estado para controlar la apertura del modal de Gestion Fechas y Precios
  const [openModalGestFechas, setOpenModalGestFechas] = useState(false);

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Estado de barcos Cargados en el select
  const [selectedBarco, setSelectedBarco] = useState(null);
  const [dataBarco, setDataBarco] = useState([]);
  const [loadedBarco, setLoadedBarco] = useState(false);

  //Hooks y funcion para gestionar imagen
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  function handleChangeImage(e) {
    if (e.target.files) {
      setFileURL(
        URL.createObjectURL(e.target.files[0], e.target.files[0].name)
      );
      setFile(e.target.files[0], e.target.files[0].name);
    }
  }

  if (error) return <p>Error: {error.message}</p>;

  useEffect(() => {
    BarcoService.getBarcos()
      .then((response) => {
        console.log(response);
        setDataBarco(response.data);

        setLoadedBarco(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedBarco(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      if (cruceroSchema.isValid()) {
        CrucerosService.createCrucero(DataForm)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              toast.success(
                `Crucero #${response.data.idCrucero} - ${response.data.nombre}`,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
              return navigate("/admin/crucero");
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error("Respuesta no válida del servidor");
            }
          });
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
              <b>Crear Crucero</b>
            </Typography>
          </Grid>

          {/* Datos del crucero (lado izquierdo) */}
          <Grid size={6} sm={6}>
            {/*Nombre */}
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre"
                    label="Nombre"
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : " "}
                  />
                )}
              />
            </FormControl>
            <br></br>

            {/* Foto */}
            <Grid size={6} sm={6}>
              <Typography variant="subtitle1">
                <b>Foto</b>
              </Typography>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <input type="file" onChange={handleChangeImage} />
              </FormControl>
              {fileURL && <img src={fileURL} alt="preview" width={150} />}
            </Grid>
            <br></br>

            {/* Cantidad de días */}
            <Grid size={4} sm={6} spacing={2}>
              <Typography variant="subtitle1">
                <b>Cantidad de días</b>
              </Typography>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <Controller
                  name="cantDias"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Seleccione un valor"
                      type="number"
                      variant="outlined"
                      inputProps={{
                        min: 7,
                        max: 14,
                        step: 1,
                      }}
                      onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        if (isNaN(value) || value < 7) value = 7;
                        else if (value > 14) value = 14;
                        setCantDias(value); // ACTUALIZA el estado cantDias con el valor seleccionado
                        field.onChange(value); // ACTUALIZA el valor en react-hook-form
                      }}
                      value={cantDias} // SE ASIGNA EL VALOR ACTUAL
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <br></br>

            {/* Barco */}
            <Grid size={12} sm={4}>
              <Typography variant="subtitle1">
                <b>Barco</b>
              </Typography>
              <FormControl fullWidth>
                {loadedBarco && (
                  <Select
                    options={dataBarco.map((barco) => ({
                      label: (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {barco.nombre} / Capacidad: {barco.capacidadHuesped}{" "}
                          pasajeros
                          <img
                            src={barco.foto}
                            alt={barco.nombre}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                      ),
                      value: barco.idbarco,
                    }))}
                    onChange={(selectedOption) => {
                      setSelectedBarco(selectedOption);
                      setValue("barco", selectedOption);
                    }}
                    value={selectedBarco}
                    styles={customStyles}
                    placeholder="Seleccione un barco"
                  />
                )}
              </FormControl>
            </Grid>
            <br></br>
            <br></br>

            {/* Botón Guardar*/}
            <Grid size={4} sm={4}>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#16537e" }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>

          {/*Datos del crucero (lado derecho) */}

          <Grid container direction="column" spacing={2}>
            <Grid
              item
              xs={12}
              style={{
                backgroundColor: "#16537e",
                borderRadius: "16px",
                padding: "10px",
              }}
            >
              <Typography align = "center" variant="h5" gutterBottom color="white">
                <b>Itinerario y fechas</b>
              </Typography>

              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#50C878" }}
                    onClick={async () => {
                      try {
                        // Llamada al servicio para crear el itinerario
                        const nuevoItinerario = {
                          estado: 1,
                        };

                        const response =
                          await ItinerarioService.createItinerario(
                            nuevoItinerario
                          );

                        console.log("Itinerario creado:", response.data);

                        // Si quieres abrir el modal después de crear el itinerario:
                        setOpenModalGestPuertos(true);
                      } catch (error) {
                        console.error("Error al crear el itinerario:", error);
                      }
                    }}
                  >
                    Gestionar itinerarios
                  </Button>
                </Grid>

                {/* Modal importado para Gestión de puertos */}
                <ModalGestionPuertos
                  open={openModalGestPuertos}
                  handleClose={() => setOpenModalGestPuertos(false)}
                  //pasar la fecha seleccionada
                  //pasar la cantidad de dias
                  cantDias={cantDias}
                  control={{ ...control, setValue }}
                />

                <Button
                  variant="contained"
                  style={{ backgroundColor: "#50C878" }}
                  onClick={() => {
                    console.log(
                      "Estado actual de selectedBarco:",
                      selectedBarco
                    );

                    if (!selectedBarco) {
                      setTimeout(() => {
                        if (!selectedBarco) {
                          alert(
                            "Debe seleccionar un barco antes de gestionar fechas."
                          );
                        } else {
                          setOpenModalGestFechas(true);
                        }
                      }, 100); // Retrasa la validación 100ms para dar tiempo a la actualización
                      return;
                    }

                    setOpenModalGestFechas(true);
                  }}
                >
                  Gestionar fechas y precios
                </Button>

                {/* Modal importado para Gestión de fechas y habitaciones */}
                <ModalGestionFechas
                  open={openModalGestFechas}
                  handleClose={() => setOpenModalGestFechas(false)}
                  barco={selectedBarco}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
