import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import BarcoService from "../../services/BarcoService";
import HabitacionService from "../../services/HabitacionService";
import CatHabitacionService from "../../services/CatHabitacionService";
import toast from "react-hot-toast";
import { SelectCatHabitacion } from "./SelectCatHabitacion";
import { SelectBarco } from "./SelectBarco";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export function CreateHabitacion() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [habitacionDetails, setHabitacionDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

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
      .positive("Debe ser un número positivo")
      .min(1, "La capacidad debe ser al menos 1"),

    maxHuesped: yup
      .number()
      .typeError("Debe ser un número")
      .required("La capacidad máxima es requerida")
      .positive("Debe ser un número positivo")
      .when('minHuesped', (minHuesped) => {
        if(minHuesped) {
        return yup.value()
          .min(minHuesped, 'La canticad máxima no puede ser menor o igual a la mínima')
          .typeError("Debe ser un número") 
        }
      }),
    
    tamanno: yup
      .number()
      .typeError("Debe ser un número")
      .required("El tamaño es requerido")
      .positive("Debe ser un número positivo"),
    
    categoriaHabitacion: yup
      .string().required("La categoría de la habitacion es requerida"),

    barco: yup
      .string().required("El barco es requerido"),

    foto: yup
      .mixed()
      .test(
        "fileRequired",
        "La foto es requerida",
        (value) => value instanceof File
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
      categoriaHabitacion: "",
      barco: "",
      foto: null,
      estado: 1,
    },
    resolver: yupResolver(habitacionSchema),
  });

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Hooks de datos de barco de barcos
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

  //Hooks de datos de categoria habitacion
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

  function handleChangeImage(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileURL(URL.createObjectURL(file));
      setFile(file);
      setValue("foto", file); // Actualiza el campo en react-hook-form
    }
  }

  const onSubmit = (DataForm) => {
    const formData = new FormData();
    formData.append("nombre", DataForm.nombre);
    formData.append("descripcion", DataForm.descripcion);
    formData.append("minHuesped", DataForm.minHuesped);
    formData.append("maxHuesped", DataForm.maxHuesped);
    formData.append("tamanno", DataForm.tamanno);
    formData.append("categoriaHabitacion", DataForm.categoriaHabitacion);
    formData.append("barco", DataForm.barco);
    formData.append("estado", DataForm.estado);
    if (file) {
      formData.append("foto", file);
    }

    HabitacionService.createHabitacion(formData)
      .then((response) => {
        if (response.data) {
          setHabitacionDetails(response.data);
          setOpen(true);
          toast.success(
            `Habitacion creada #${response.data.idHabitacion} - ${response.data.nombre}`,
            {
              duration: 4000,
              position: "top-center",
            }
          );
        }
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
        encType="multipart/form-data"
      >
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mínimo de Huéspedes"
              type="number"
              variant="outlined"
              name="minHuesped"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Máximo de Huéspedes"
              type="number"
              variant="outlined"
              name="maxHuesped"
            />
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
                <Controller
                  name="categoriaHabitacion"
                  control={control}
                  render={({ field }) => (
                    <SelectCatHabitacion
                      field={field}
                      data={dataCatHabitacion}
                    />
                  )}
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
                <Controller
                  name="barco"
                  control={control}
                  render={({ field }) => (
                    <SelectBarco field={field} data={dataBarco} />
                  )}
                />
              )}
            </FormControl>
          </Grid>
          <Grid item>
            <Typography variant="h6">Foto</Typography>
            <input type="file" accept="image/*" onChange={handleChangeImage} />
            {fileURL && (
              <img
                src={fileURL}
                alt="Vista previa"
                width={200}
                style={{ marginTop: "10px" }}
              />
            )}
            {errors.foto && (
              <Typography color="error">{errors.foto.message}</Typography>
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
                    label="Estado"
                    error={Boolean(errors.estado)}
                    value={1}
                  >
                    <MenuItem value={1}>Activo</MenuItem>
                  </Select>
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          {habitacionDetails && (
            <>
              <Typography variant="h6" gutterBottom>
                ¡Habitacion Creada Exitosamente!
              </Typography>
              <Typography>Nombre: {habitacionDetails.nombre}</Typography>
              <Typography>
                Descripción: {habitacionDetails.descripcion}
              </Typography>
              <Typography>
                Mínimo de Huéspedes: {habitacionDetails.minHuesped}
              </Typography>
              <Typography>
                Máximo de Huéspedes: {habitacionDetails.maxHuesped}
              </Typography>
              <Typography>
                Tamaño: {habitacionDetails.tamanno} + m<sup>2</sup>
              </Typography>
              <Typography>
                Categoría de la Habitacion: {habitacionDetails.categoriaHabitacion}
              </Typography>
              <Typography>
                Barco: {habitacionDetails.barco}
              </Typography>
              <Typography>Estado: Activo</Typography>
              <Button
                onClick={() => navigate("/admin/barco")}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Ir a Barcos
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
