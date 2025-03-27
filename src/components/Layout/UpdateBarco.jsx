import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import BarcoService from '../../services/BarcoService';
import toast from 'react-hot-toast';

export function UpdateBarco() {
  const navigate = useNavigate();
  const { id } = useParams();
  const rutaArchivo = "C:\\\\xampp\\\\htdocs\\\\crucerosadventure\\\\uploads\\\\barcos\\\\";
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState('');

  const barcoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    capacidadHuesped: yup.number().typeError('Debe ser un número').required('La capacidad es requerida').positive('Debe ser un número positivo'),
    foto: yup
      .mixed()
      .test("fileType", "Debe cargar una imagen (jpg, png, jpeg)", (value) => {
        return !value || ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      })
      .test("fileSize", "El tamaño debe ser menor a 500MB", (value) => !value || value.size <= 524288000),
    estado: yup.number().required('El estado es requerido'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
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

  useEffect(() => {
    if (id) {
      BarcoService.getBarcoById(id)
        .then((res) => {
          const barco = res.data;
          setValue('nombre', barco.nombre);
          setValue('descripcion', barco.descripcion);
          setValue('capacidadHuesped', barco.capacidadHuesped);
          setValue('estado', barco.estado);
          if (barco.fotoRuta) {
            const nombreArchivo = barco.fotoRuta.split("\\").pop();
            setFileURL(`/uploads/barcos/${nombreArchivo}`);
          }
        })
        .catch((err) => {
          setError(err);
          toast.error('Error al cargar el barco');
        });
    }
  }, [id]);

  const onSubmit = async (dataForm) => {
    try {
      const fotoNombre = dataForm.foto ? dataForm.foto.name : '';
      const fotoRuta = fotoNombre ? rutaArchivo + fotoNombre : '';

      const dataConRuta = {
        ...dataForm,
        fotoRuta,
        idbarco: id,
      };

      const response = await BarcoService.updateBarco(dataConRuta);

      if (response.data) {
        toast.success(`Barco actualizado: ${response.data.nombre}`, {
          duration: 3000,
          position: 'top-center',
        });
        navigate('/barco-table');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error actualizando barco');
    }
  };

  const handleChangeImage = (e) => {
    const selectedFile = e.target.files[0];
    setFileURL(URL.createObjectURL(selectedFile));
    setValue("foto", selectedFile);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} direction="column" sx={{ maxWidth: '50%', margin: 'auto' }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Editar Barco
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
          <FormControl fullWidth>
            <input type='file' onChange={handleChangeImage} />
          </FormControl>
          {fileURL && <img src={fileURL} alt="Previsualización" width={300} />}
        </Grid>

        <Grid item>
          <FormControl fullWidth>
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Estado">
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
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
