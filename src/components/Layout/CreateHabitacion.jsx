import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
//import MenuItem from "@mui/material/MenuItem";
import Select from "react-select";
//import Select from "@mui/material/Select";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import BarcoService from "../../services/BarcoService";
import HabitacionService from "../../services/HabitacionService";
import CatHabitacionService from "../../services/CatHabitacionService";
import toast from "react-hot-toast";
import { ForkRight } from "@mui/icons-material";

export function CreateHabitacion() {
  const navigate = useNavigate();
  const rutaArchivo =
    "C:\\\\xampp\\\\htdocs\\\\crucerosadventure\\\\uploads\\\\habitaciones\\\\";

  const habitacionSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .min(2, "Debe tener al menos 2 caracteres"),

    descripcion: yup.string().required("La descripción es requerida"),

    minHuesped: yup
      .number()
      .typeError("Debe ser un número")
      .required("La cantidad mínima es requerida")
      .positive("Debe ser un número positivo"),

    maxHuesped: yup
      .number()
      .typeError("Debe ser un número")
      .required("La capacidad máxima es requerida")
      .positive("Debe ser un número positivo"),

    tamanno: yup
      .number()
      .typeError("Debe ser un número")
      .required("El tamaño es requerido")
      .positive("Debe ser un número positivo"),

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
    estado: yup.number().required("El estado es requerido"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      minHuesped: "",
      maxHuesped: "",
      tamanno: "",
      categoriaHabitacion: null,
      barco: null,
      foto: null,
      estado: 1,
    },
    resolver: yupResolver(habitacionSchema),
  });

  const estadoValues = [
    { value: 1, label: "Activo" },
    { value: 2, label: "Inactivo" },
  ];

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

  const [error, setError] = useState("");

  //Hooks de datos de categoria habitacion
  const [selectedCatHabitacion, setSelectedCatHabitacion] = useState(null);
  const [dataCatHabitacion, setDataCatHabitacion] = useState({});
  const [loadedCatHabitacion, setLoadedCatHabitacion] = useState(false);

  if (error) return <p>Error: {error.message}</p>;

  useEffect(() => {
    CatHabitacionService.getCatHabitaciones()
      .then((response) => {
        console.log(response);
        setDataCatHabitacion(response.data);

        setLoadedCatHabitacion(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedCatHabitacion(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  //Hooks de datos de barco de barcos
  const [selectedBarco, setSelectedBarco] = useState(null);
  const [dataBarco, setDataBarco] = useState({});
  const [loadedBarco, setLoadedBarco] = useState(false);

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


  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const onSubmit = async (DataForm) => {
    try {
      const isValid = await habitacionSchema.isValid(DataForm);

      if (isValid) {
        //Acceder al nombre del archivo de la foto
        const fotoNombre = DataForm.foto
          ? DataForm.foto.name
          : "No hay foto cargada";

        console.log("Nombre del archivo cargado:", fotoNombre);
        //Extraer la categoriahabitacion y el barco del objeto DataForm
        const { categoriaHabitacion, barco, ...restoDeDataForm } = DataForm;

        //adjuntar el nombre de la imagen a la ruta por defecto
        const archivoRuta = rutaArchivo + fotoNombre;

        // Agregar la ruta al objeto DataForm como un campo adicional
        const dataConRuta = {
          ...restoDeDataForm,
          // DataForm, // Copiar todos los demás datos
          fotoRuta: archivoRuta,
          idcategoriaHabitacion: categoriaHabitacion?.value,
          idbarco: barco?.value,
        };

        console.log("Enviando datos del crucero al form: ", dataConRuta);

        HabitacionService.createHabitacion(dataConRuta)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              //Obtener el valor del id de la habitacion creado
              // setIdHabitacion(response.data.idHabitacion);

              toast.success(
                `Habitacion # ${response.data.idHabitacion} - ${response.data.nombre} 
                Añadida correctamente`,
                {
                  duration: 3000,
                  position: "top-center",
                }
              );
              //Configurar el estado de crucero creado a true
              //setCruceroCreado(true);
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
        //setCruceroCreado(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeImage = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
    setValue("foto", selectedFile); // Pasar el archivo a react-hook-form
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid
          container
          spacing={2}
          direction="column"
          sx={{ maxWidth: "50%", margin: "auto" }}
        >
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Crear Habitacion
            </Typography>
          </Grid>
          <Grid item>
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
          <Grid item>
            <FormControl fullWidth>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion?.message}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid container spacing={16.5}>
            <Grid item xs={12} md={6}>
              <Controller 
                name="minHuesped"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mínimo de Huéspedes"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    variant="outlined"
                    error={Boolean(errors.minHuesped)}
                    helperText={errors.minHuesped?.message}
                  />            
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller 
                name="maxHuesped"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Máximo de Huéspedes"
                    type="number"
                    InputProps={{ inputProps: { min: 2 } }}
                    variant="outlined"
                    error={Boolean(errors.maxHuesped)}
                    helperText={errors.maxHuesped?.message}
                  />            
                )}
              />
            </Grid>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <Controller
                name="tamanno"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tamaño de la habitacion en metros cuadrados"
                    error={Boolean(errors.tamanno)}
                    helperText={errors.tamanno?.message}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              <b>Categoría de habitacion</b>
            </Typography>
            <FormControl fullWidth>
              {loadedCatHabitacion && (
                <Select
                  options={dataCatHabitacion.map((categoriaHabitacion) => ({
                    label: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {categoriaHabitacion.nombre}
                      </div>
                    ),
                    value: categoriaHabitacion.idcategoriaHabitacion,
                  }))}
                  placeholder="Seleccione una Categoria de Habitacion"
                  onChange={(selectedOption) => {
                    setSelectedCatHabitacion(selectedOption);
                    setValue("categoriaHabitacion", selectedOption);
                  }}
                  value={selectedCatHabitacion}
                  styles={customStyles}
                  error={Boolean(errors.categoriaHabitacion)}
                  helperText={errors.categoriaHabitacion?.message}
                />
              )}
            </FormControl>
          </Grid>
          <Grid item>
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
          <Grid item>
            <FormControl fullWidth>
              <input type="file" onChange={handleChangeImage} />
            </FormControl>
            {fileURL && (
              <img src={fileURL} alt="Previsualización" width={300} />
            )}
          </Grid>
          <Grid item>
            <FormControl fullWidth disabled>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={estadoValues}
                    isDisabled
                    placeholder="Seleccione un estado"
                    value={estadoValues[0]}
                    error={Boolean(errors.estado)}
                    helperText={errors.estado?.message}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
