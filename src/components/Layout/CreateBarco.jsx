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

export function CreateBarco() {
  const navigate = useNavigate();

  const barcoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    capacidadHuesped: yup.number().typeError('Debe ser un número').required('La capacidad es requerida').positive('Debe ser un número positivo'),
    foto: yup.string().required('La foto es requerida'),
    estado: yup.number().required('El estado es requerido'),
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
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  function handleChangeImage(e) {
    if (e.target.files) {
      setFileURL(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  }

  const onSubmit = (DataForm) => {
    BarcoService.createBarco(DataForm)
      .then((response) => {
        if (response.data) {
          toast.success(`Barco creado #${response.data.idbarco} - ${response.data.nombre}`, {
            duration: 4000,
            position: 'top-center',
          });
          navigate('/admin/crucero');
        }
      })
      .catch((error) => setError(error.message));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} direction="column" sx={{ maxWidth: '50%', margin: 'auto' }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Crear Barco
          </Typography>
        </Grid>
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
        <Grid item>
          <Typography variant="h6">Foto</Typography>
          <FormControl fullWidth>
            <Controller
              name="foto"
              control={control}
              render={({ field }) => (
                <input type="file" {...field} onChange={handleChangeImage} />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item>
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
        <Grid item>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
