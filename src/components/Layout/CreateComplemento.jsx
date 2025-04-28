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
import ComplementoService from '../../services/ComplementoService';
import toast from 'react-hot-toast';

export function CreateComplemento() {
  const navigate = useNavigate();
  //let formData = new FormData();

  // Validaciones con Yup
  const complementoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    precio: yup.number().typeError('Debe ser un número').required('El precio es requerido').positive('Debe ser un número positivo'),
    estado: yup.number().required('El estado es requerido'),

  });

  // Hook de formulario
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      precioAplicado: 'habitación',
      estado: 1,
    },
    resolver: yupResolver(complementoSchema),
  });

  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  // Estado para almacenar el id del crucero
 // const [idcomplemento, setIdComplemento] = useState(null);

   // Accion submit
   const onSubmit = async (DataForm) => {

    try {
      // Validar el objeto con Yup de manera asíncrona
      const isValid = await complementoSchema.isValid(DataForm);

      if (isValid) {
        //Acceder al nombre del archivo de la foto

       const { ...restoDeDataForm } = DataForm;

        // Agregar la ruta al objeto DataForm como un campo adicional
        const dataConRuta = {
          ...restoDeDataForm,
        };

        console.log("Enviando datos del crucero al form: ", dataConRuta);

         ComplementoService.createComplemento(dataConRuta)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              //Obtener el valor del id del complemento creado
             // setIdComplemento(response.data.idcomplemento);

              toast.success(
                `Complemento # ${response.data.idComplemento} - ${response.data.nombre} 
                Añadido correctamente`,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} direction="column" sx={{ maxWidth: '50%', margin: 'auto' }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Crear Complemento
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

        {/* Precio */}
        <Grid item>
          <FormControl fullWidth>
            <Controller
              name="precio"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Precio en dólares" error={Boolean(errors.precio)} helperText={errors.precio?.message} />
              )}
            />
          </FormControl>
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
