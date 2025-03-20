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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export function CreateBarco() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [barcoDetails, setBarcoDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const barcoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    capacidadHuesped: yup.number().typeError('Debe ser un número').required('La capacidad es requerida').positive('Debe ser un número positivo'),
    foto: yup.mixed().test("fileRequired", "La foto es requerida", (value) => value instanceof File),
    estado: yup.number().required('El estado es requerido'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      capacidadHuesped: '',
      foto: null,
      estado: 1,
    },
    resolver: yupResolver(barcoSchema),
  });

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
    formData.append('nombre', DataForm.nombre);
    formData.append('descripcion', DataForm.descripcion);
    formData.append('capacidadHuesped', DataForm.capacidadHuesped);
    formData.append('estado', DataForm.estado);
    if (file) {
      formData.append('foto', file);
    }

    BarcoService.createBarco(formData)
      .then((response) => {
        if (response.data) {
          setBarcoDetails(response.data);
          setOpen(true);
          toast.success(`Barco creado #${response.data.idbarco} - ${response.data.nombre}`, {
            duration: 4000,
            position: 'top-center',
          });
        }
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
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
            <input type="file" accept="image/*" onChange={handleChangeImage} />
            {fileURL && <img src={fileURL} alt="Vista previa" width={200} style={{ marginTop: '10px' }} />}
            {errors.foto && <Typography color="error">{errors.foto.message}</Typography>}
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: 2 }}>
          {barcoDetails && (
            <>
              <Typography variant="h6" gutterBottom>
                ¡Barco Creado Exitosamente!
              </Typography>
              <Typography>Nombre: {barcoDetails.nombre}</Typography>
              <Typography>Descripción: {barcoDetails.descripcion}</Typography>
              <Typography>Capacidad: {barcoDetails.capacidadHuesped}</Typography>
              <Typography>Estado: Activo</Typography>
              <Button onClick={() => navigate('/admin/crucero')} variant="contained" sx={{ mt: 2 }}>
                Ir a Cruceros
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
