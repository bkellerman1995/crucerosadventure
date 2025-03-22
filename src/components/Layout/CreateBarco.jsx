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

  // Validaciones con Yup
  const barcoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    capacidadHuesped: yup.number().typeError('Debe ser un número').required('La capacidad es requerida').positive('Debe ser un número positivo'),
    estado: yup.number().required('El estado es requerido'),
  });

  // Hook de formulario
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      capacidadHuesped: '',
      estado: 1,
    },
    resolver: yupResolver(barcoSchema),
  });

  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  function handleChangeImage(e) {
    if (e.target.files) {
      setFileURL(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  }

  const onSubmit = async (DataForm) => {
    try {
      const response = await BarcoService.createBarco(DataForm);

      if (response.data) {
        const barco = response.data;

        // Subir imagen
        if (file) {
          formData.append("file", file);
          formData.append("barco_id", barco.idbarco);

          try {
            const imgResponse = await ImageService.createImage(formData);
            if (imgResponse.data) {
              toast.success(imgResponse.data, {
                duration: 4000,
                position: "top-center"
              });
            }
          } catch (error) {
            console.error("Error subiendo imagen:", error);
            setError(error.message || "Error al subir imagen");
          }
        }

        toast.success(
          `Barco creado #${barco.idbarco} - ${barco.nombre}`,
          {
            duration: 4000,
            position: 'top-center'
          }
        );
        navigate('/admin/barco');
      } else if (response.error) {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error creando barco:", error);
      setError(error.message || "Error desconocido");
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} direction="column" sx={{ maxWidth: '50%', margin: 'auto' }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Crear Barco
          </Typography>
        </Grid>

        {/* Nombre */}
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

        {/* Descripción */}
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

        {/* Capacidad de Huéspedes */}
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

        {/* Imagen */}
        <Grid item>
          <FormControl fullWidth>
            <input type='file' onChange={handleChangeImage} />
          </FormControl>
          {fileURL && <img src={fileURL} alt="Previsualización" width={300} />}
        </Grid>

        {/* Estado */}
        <Grid item>
          <FormControl fullWidth disabled>
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Estado">
                  <MenuItem value={1}>Activo</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* Botón */}
        <Grid item>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
