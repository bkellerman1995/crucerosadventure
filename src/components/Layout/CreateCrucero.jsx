import React from 'react';
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import BarcoService from '../../services/BarcoService';
import toast from 'react-hot-toast';
// import {Select, SelectTrigger,SelectValue,SelectContent,SelectItem } from "react-select";
import Select from 'react-select';

export function CreateCrucero() {
  const navigate = useNavigate();

  // Esquema de validación
  const barcoSchema = yup.object({
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
  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      capacidadHuesped: "",
      estado: "",
      foto:''
    },
    resolver: yupResolver(barcoSchema),
  });

  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  /* Gestion de imagen */
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
  

  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      if (barcoSchema.isValid()) {
        BarcoService.createBarco(DataForm)
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


  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              <b>Crear Crucero</b>
            </Typography>
          </Grid>

          {/* Grid para manejar insercion del nombre */}
          <Grid size={6} sm={6}>
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
          </Grid>

          {/* Grid para manejar insercion de la imagen */}
          <Grid size={12} sm={12}>
            <Typography variant="h7" gutterBottom>
              <b>Foto</b>
            </Typography>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="foto"
                control={control}
                render={({ field }) => (
                  <input type="file" {...field} onChange={handleChangeImage} />
                )}
              />
            </FormControl>
            <img src={fileURL} width={300} />
          </Grid>


          {/* Grid para manejar cantidad de dias*/}
          <Grid size={2} sm={4}>
            <Typography variant="h7" gutterBottom>
              <b>Cantidad de días</b>
            </Typography>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* <Select onValueChange={field.onChange} defaultValue={field.value}> */}
              <Select defaultValue="Prueba"></Select>
            </FormControl>
          </Grid>

          {/* Grid para manejar estado*/}
          <Grid size={4} sm={4}>
            {/* <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="estado"
                    label="Estado"
                    error={Boolean(errors.estado)}
                    helperText={errors.estado ? errors.estado.message : " "}
                  />
                )}
              />
            </FormControl> */}
          </Grid>

          <Grid size={12} sm={12}>
            <Button style={{backgroundColor:"#16537e"}}
              type="submit"
              variant="contained"
              sx={{ m: 1 }}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
