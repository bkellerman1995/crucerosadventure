import React from 'react';
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from "/node_modules/.vite/deps/@mui_material_Button.js?v=57074f40";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import BarcoService from '../../services/BarcoService';
import toast from 'react-hot-toast';

export function CreateBarco() {
  const navigate = useNavigate();

  // Esquema de validación
  const barcoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    capacidadHuesped: yup.number().typeError('Debe ser un número').required('La capacidad es requerida').positive('Debe ser un número positivo'),
    foto: yup.string().required('La la foto es requerida'),
    estado: yup.mixed()
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
      nombre: '',
      descripcion: '',
      capacidadHuesped: '',
      foto: '',
      estado: '',
    },
    resolver: yupResolver(barcoSchema),
  });

  const [error, setError] = useState('');
  const onError = (errors, e) => console.log(errors, e);
  if (error) return <p>Error: {error.message}</p>;

   //Hooks gestión de imagen
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
    
  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      if (barcoSchema.isValid()) {
        BarcoService.createBarco(DataForm)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              toast.success(`Barco creado #${response.data.idbarco} - ${response.data.nombre}`, {
                duration: 4000,
                position: 'top-center'
              });
              return navigate("/admin/crucero");
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error('Respuesta no válida del servidor');
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
              Crear Barco
            </Typography>
          </Grid>
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
                    helperText={errors.nombre ? errors.nombre.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={6} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="descripcion"
                    label="Descripción"
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion ? errors.descripcion.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="capacidadHuesped"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="capacidadHuesped"
                    label="Capacidad de Huéspedes"
                    error={Boolean(errors.capacidadHuesped)}
                    helperText={errors.capacidadHuesped ? errors.capacidadHuesped.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={4} sm={4}>
          <Typography variant="h20" gutterBottom>
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
          </Grid>
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="estado"
                    label="Estado"
                    error={Boolean(errors.estado)}
                    helperText={errors.estado ? errors.estado.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
