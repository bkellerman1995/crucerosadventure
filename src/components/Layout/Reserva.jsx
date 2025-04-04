import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from '@mui/material/FormHelperText';
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


export function Reserva() {

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

  // Estado para almacenar el valor de cantidad de días
  const [cantDias, setCantDias] = useState(7); // Valor mínimo predeterminado
  console.log("Cant Dias cargados", cantDias);

  // Estado para controlar la apertura del modal de Gestion Cruceros
  const [openModalGestPuertos, setOpenModalGestPuertos] = useState(false);

  // Estado para controlar la apertura del modal de Gestion Fechas y Precios
  const [openModalGestFechas, setOpenModalGestFechas] = useState(false);

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Estado de barcos Cargados en el select
  const [selectedBarco, setSelectedBarco] = useState(null);
  const [dataBarco, setDataBarco] = useState([]);
  const [loadedBarco, setLoadedBarco] = useState(false);

  //Estado del crucero creado
  const [cruceroCreado, setCruceroCreado] = useState(false);

  // Estado para almacenar el id del crucero
  const [idCrucero, setIdCrucero] = useState(null);

  //Estado de los puertos añadidos al itinerario
  const [puertosItinerario, setPuertosItinerario] = useState(false);

  //Estado de las fecas añadidas al crucero
  const [fechasCrucero, setFechasCrucero] = useState(false);

  //Hooks y funcion para gestionar imagen
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);

  //Control de errores
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
  const onSubmit = async (DataForm) => {
    //Validar si se ha seleccionado un barco

    if (!selectedBarco) {
      setTimeout(() => {
        if (!selectedBarco) {
          alert("Debe seleccionar un barco para el crucero.");
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

        CrucerosService.createCrucero(dataConRuta)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              //Obtener el valor del id del crucero creado
              setIdCrucero(response.data.idCrucero);

              toast.success(
                `Crucero # ${response.data.idCrucero} - ${response.data.nombre} 
                Añadido correctamente 
                Proceda a añadir el itinerario y las fechas del crucero`,
                {
                  duration: 3000,
                  position: "top-center",
                }
              );
              //Configurar el estado de crucero creado a true
              setCruceroCreado(true);
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error("Respuesta no válida del servidor");
            }
          });
      } else {
        //Configurar el estado de crucero creado a false
        setCruceroCreado(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Gestion de la imagen
  const handleChangeImage = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
    setValue("foto", selectedFile); // Pasar el archivo a react-hook-form
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
                style={{ backgroundColor: "#16537e" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre"
                    label="Nombre"
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : " "}
                    disabled={cruceroCreado}
                  />
                )}
              />
            </FormControl>
            <br></br>
            <FormControl
              variant="standard"
              fullWidth
              sx={{ m: 1 }}
              style={{ disabled: cruceroCreado }}
            >
              <Typography variant="subtitle1">
                <b>Foto</b>
              </Typography>
              <input
                type="file"
                onChange={handleChangeImage}
                disabled={cruceroCreado}
              />
              {fileURL && <img src={fileURL} alt="preview" width={300} />}
              {errors.foto && (
                <FormHelperText error>{errors.foto.message}</FormHelperText>
              )}
              <br></br>
            </FormControl>
            {/* <img src={fileURL} width={100} /> */}

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
                      onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        if (isNaN(value) || value < 7) value = 7;
                        else if (value > 14) value = 14;
                        setCantDias(value); // ACTUALIZA el estado cantDias con el valor seleccionado
                        field.onChange(value); // ACTUALIZA el valor en react-hook-form
                      }}
                      value={cantDias} // SE ASIGNA EL VALOR ACTUAL
                      disabled={cruceroCreado}
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
                    isDisabled={cruceroCreado}
                  />
                )}
              </FormControl>
            </Grid>
            <br></br>
            <br></br>

            {/* Botón Crear Crucero*/}
            <Grid size={4} sm={4} spacing={1}>
              <Button
                variant="contained"
                type="submit"
                style={{
                  backgroundColor: "#16537e",
                  display: !cruceroCreado ? "block" : "none",
                }}
                onClick={() => {
                  console.log("Estado actual de selectedBarco:", selectedBarco);
                }}
              >
                Crear crucero
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
              <Typography
                align="center"
                variant="h5"
                gutterBottom
                color="white"
              >
                <b>Itinerario y fechas</b>
              </Typography>

              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#50C878" }}
                    disabled={!cruceroCreado} // Deshabilita el botón si el crucero no ha sido creado
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

                        // Abrir el modal después de crear el itinerario:
                        setOpenModalGestPuertos(true);
                        setCruceroCreado(false);
                      } catch (error) {
                        console.error("Error al crear el itinerario:", error);
                      }
                    }}
                  >
                    Gestionar itinerarios
                  </Button>
                </Grid>

                <Button
                  variant="contained"
                  style={{ backgroundColor: "#50C878" }}
                  disabled={!cruceroCreado} // Deshabilita el botón si el crucero no ha sido creado
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
                          setCruceroCreado(false);
                        }
                      }, 100); // Retrasa la validación 100ms para dar tiempo a la actualización
                      return;
                    }

                    setOpenModalGestFechas(true);
                  }}
                >
                  Gestionar fechas y precios
                </Button>
              </Grid>
            </Grid>

            {/* Botón Confirmar*/}
            <Grid size={4} sm={4} spacing={1}>
              <Button
                variant="contained"
                // type="submit"
                style={{
                  backgroundColor: "#16537e",
                  color: "white",
                  display:
                    puertosItinerario && fechasCrucero ? "block" : "none",
                }}
                onClick={() => {
                  console.log("Estado actual de selectedBarco:", selectedBarco);
                  if (puertosItinerario && fechasCrucero) {
                    toast.success(
                      `Gestión de crucero exitosa`,
                      {
                        duration: 2000,
                        position: "top-center",
                      }
                    );
                    navigate("/admin/crucero");
                  }
                }}
              >
                Confirmar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>

      {/* Modal importado para Gestión de puertos */}
      <ModalGestionPuertos
        open={openModalGestPuertos}
        handleClose={() => setOpenModalGestPuertos(false)}
        //pasar la cantidad de dias
        cantDias={cantDias}
        control={{ ...control, setValue }}
        setCruceroCreado={setCruceroCreado}
        setPuertosItinerario={setPuertosItinerario}
        idCrucero={idCrucero} // Pasar el id del crucero
      />

      {/* Modal importado para Gestión de fechas y habitaciones */}
      <ModalGestionFechas
        open={openModalGestFechas}
        handleClose={() => setOpenModalGestFechas(false)}
        barco={selectedBarco}
        setFechasCrucero={setFechasCrucero}
        idCrucero={idCrucero} // Pasar el id del crucero
      />
    </>
  );
}
