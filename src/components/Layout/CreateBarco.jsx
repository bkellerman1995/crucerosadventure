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
//import BarcoService from '../../services/HabitacionService';

//import ImageService from '../../services/ImageService';

export function CreateBarco() {
  const navigate = useNavigate();
  //let formData = new FormData();
  const rutaArchivo =
  "C:\\\\xampp\\\\htdocs\\\\crucerosadventure\\\\uploads\\\\barcos\\\\";

  // Validaciones con Yup
  const barcoSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    capacidadHuesped: yup.number().typeError('Debe ser un número').required('La capacidad es requerida').positive('Debe ser un número positivo'),
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
    estado: yup.number().required('El estado es requerido'),

    Habitaciones: yup
  .array()
  .of(
    yup.object().shape({
      IdHabitacion: yup.string().required("La habitación es obligatoria"),
      CantidadDisponible: yup
        .number()
        .required("La cantidad disponible es obligatoria")
        .positive("La cantidad disponible debe ser un número positivo")
        .integer("La cantidad disponible debe ser un número entero")
        .min(1, "La cantidad mínima debe ser de al menos 1")
        .max(10, "La cantidad máxima no puede exceder 10"),
    })
  )
  .min(1, "Debe registrar al menos una habitación"),
    

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
      capacidadHuesped: '',
      foto:" ", 
      estado: 1,
    },
    resolver: yupResolver(barcoSchema),
  });

  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  // Estado para almacenar el id del crucero
 // const [idbarco, setIdBarco] = useState(null);

   // Accion submit
   const onSubmit = async (DataForm) => {

    try {
      // Validar el objeto con Yup de manera asíncrona
      const isValid = await barcoSchema.isValid(DataForm);

      if (isValid) {
        //Acceder al nombre del archivo de la foto
        const fotoNombre = DataForm.foto
          ? DataForm.foto.name
          : "No hay foto cargada";

        console.log("Nombre del archivo cargado:", fotoNombre);

       const { ...restoDeDataForm } = DataForm;
        //adjuntar el nombre de la imagen a la ruta por defecto
        const archivoRuta = rutaArchivo + fotoNombre;

        // Agregar la ruta al objeto DataForm como un campo adicional
        const dataConRuta = {
          ...restoDeDataForm,
          // DataForm, // Copiar todos los demás datos
          fotoRuta: archivoRuta,
         // idbarco: barco?.value,
        };

        console.log("Enviando datos del crucero al form: ", dataConRuta);

         BarcoService.createBarco(dataConRuta)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              //Obtener el valor del id del barco creado
             // setIdBarco(response.data.idbarco);

              toast.success(
                `Barco # ${response.data.idbarco} - ${response.data.nombre} 
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


  //if (error) return <p>Error: {error}</p>;

    //Gestion de la imagen
    const handleChangeImage = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
      setValue("foto", selectedFile); // Pasar el archivo a react-hook-form
    };

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
