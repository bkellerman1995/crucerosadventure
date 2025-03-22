import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import BarcoService from '../../services/BarcoService';
import toast from 'react-hot-toast';
import ImageService from '../../services/ImageService';

export function CreateBarco() {
  const navigate = useNavigate();
  let formData = new FormData();

  /* Validaciones del formulario con Yup */
  const barcoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    capacidadHuesped: yup.number().typeError('Debe ser un número').required('La capacidad es requerida').positive('Debe ser un número positivo'),
    // foto: yup.mixed().test("fileRequired", "La foto es requerida", (value) => value instanceof File),
    estado: yup.number().required('El estado es requerido'),
  });

  /* Hook de React Hook Form para gestionar el formulario */
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
      estado: 1,
    },
    resolver: yupResolver(barcoSchema),
  });

  /* Estado para manejar errores en pantalla */
  const [error, setError] = useState('');

  // Función para manejar errores al enviar el formulario
  const onError = (errors, e) => console.log(errors, e);

  /* Función que maneja el envío del formulario */
  const onSubmit = (DataForm) => {
    console.log('Formulario:');
    console.log(DataForm);

    try {
      if (barcoSchema.isValid()) {
        // Crear barco en backend
        BarcoService.createBarco(DataForm)
        
          .then((response) => {
            console.log("Respuesta del backend:", response);
            setError(response.error);
            if (response.data != null) {
              /* Subida de imagen luego de crear el barco */
              formData.append("file", file);
              formData.append("barco_id", response.data.idbarco);
              ImageService.createImage(formData)
                .then((response) => {
                  setError(response.error);
                  if (response.data != null) {
                    toast.success(response.data, {
                      duration: 4000,
                      position: "top-center"
                    });
                  }
                })
                .catch((error) => {
                  if (error instanceof SyntaxError) {
                    console.log(error);
                    setError(error);
                    throw new Error('Respuesta no válida del servidor');
                  }
                });

              // Notificación y redirección
              toast.success(
                `Barco creado #${response.data.idbarco} - ${response.data.nombre}`,
                {
                  duration: 4000,
                  position: 'top-center'
                }
              );
              return navigate('/admin/barco');
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
      console.error("Error al crear barco:", error.response?.data || error.message);
    }
  };

  /* Manejo de archivo de imagen */
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  function handleChangeImage(e) {
    if (e.target.files) {
      setFileURL(
        URL.createObjectURL(e.target.files[0])
      );
      setFile(e.target.files[0]);
    }
  }

  if (error) return <p>Error: {error.message}</p>;

  /* Render del formulario */
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2} direction="column" sx={{ maxWidth: '50%', margin: 'auto' }}>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Crear Barco
            </Typography>
          </Grid>

          {/* Campo: Nombre */}
          <Grid item>
            <FormControl fullWidth>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Nombre" error={Boolean(errors.nombre)} helperText={errors.nombre?.message} />
                )}
              />
            </FormControl>
          </Grid>

          {/* Campo: Descripción */}
          <Grid item>
            <FormControl fullWidth>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Descripción" error={Boolean(errors.descripcion)} helperText={errors.descripcion?.message} />
                )}
              />
            </FormControl>
          </Grid>

          {/* Campo: Capacidad de Huéspedes */}
          <Grid item>
            <FormControl fullWidth>
              <Controller
                name="capacidadHuesped"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Capacidad de Huéspedes" error={Boolean(errors.capacidadHuesped)} helperText={errors.capacidadHuesped?.message} />
                )}
              />
            </FormControl>
          </Grid>

          {/* Campo: Imagen */}
          <Grid item size={12} sm={12}>
            <FormControl variant='standard' fullWidth sx={{ m: 1 }}>
              <Controller
                name='foto'
                control={control}
                render={({ field }) => (
                  <input type='file' {...field} onChange={handleChangeImage} />
                )}
              />
            </FormControl>
            <img src={fileURL} width={300} />
          </Grid>

          {/* Campo: Estado (fijo en 1) */}
          <Grid item size={12} sm={12}>
            <FormControl fullWidth disabled>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Estado" error={Boolean(errors.estado)} value={1}>
                    <MenuItem value={1}>Activo</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Botón de Envío */}
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
