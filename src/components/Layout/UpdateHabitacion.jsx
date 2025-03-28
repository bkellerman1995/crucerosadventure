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
import { useNavigate, useSearchParams } from "react-router-dom";
import HabitacionService from "../../services/HabitacionService";
import toast from "react-hot-toast";

export function UpdateHabitacion() {
  const navigate = useNavigate();

  // Ahora obtenemos el ID desde el query param ?id=...
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const catHabitacion = searchParams.get("idcategoriaHabitacion");
  const barco = searchParams.get("idbarco");
  const [fileName, setFileName] = useState("");

  const rutaArchivo =
    "C:\\\\xampp\\\\htdocs\\\\crucerosadventure\\\\uploads\\\\habitaciones\\\\";

  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState("");

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
      .positive("Debe ser un número positivo"),

    maxHuesped: yup
      .number()
      .typeError("Debe ser un número")
      .required("La capacidad máxima es requerida")
      .positive("Debe ser un número positivo"),

    tamanno: yup
      .number()
      .typeError("Debe ser un número")
      .required("El tamaño es requerido")
      .positive("Debe ser un número positivo"),

    foto: yup
      .mixed()
      .test("fileType", "Debe cargar una imagen (jpg, png, jpeg)", (value) => {
        return (
          !value ||
          ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      })
      .test(
        "fileSize",
        "El tamaño debe ser menor a 500MB",
        (value) => !value || value.size <= 524288000
      ),
    estado: yup.number().required("El estado es requerido"),
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
      minHuesped: '',
      maxHuesped: '',
      tamanno: '',
      foto: null,
      estado: '',
    },
    resolver: yupResolver(habitacionSchema),
  });

  // ✅ Obtener habitacion por ID (query param)
  useEffect(() => {
    if (!id) {
      toast.error("No se proporcionó ID de habitacion");
      navigate("/habitacion-table");
      return;
    }

    HabitacionService.getHabitacionById(id)
      .then((res) => {
        const habitacion = res.data;
        setValue("nombre", habitacion.nombre);
        setValue("descripcion", habitacion.descripcion);
        setValue("minHuesped", habitacion.minHuesped);
        setValue("maxHuesped", habitacion.maxHuesped);
        setValue("tamanno", habitacion.tamanno);

        const estadoValue = habitacion.estado === 1 || habitacion.estado === null ? 1 : 0;
        setValue("estado", estadoValue);
        if (habitacion.foto) {
          const nombreArchivo = habitacion.foto.split("/").pop();
          setFileURL(habitacion.foto);
          setFileName(nombreArchivo);
        }
      })
      .catch((err) => {
        setError(err);
        toast.error("Error al cargar la habitacion");
      });
  }, [id]);

  const onSubmit = async (dataForm) => {
    try {
      const fotoNombre = dataForm.foto ? dataForm.foto.name : "";
      const fotoRuta = fotoNombre ? rutaArchivo + fotoNombre : "";

      const dataConRuta = {
        ...dataForm,
        fotoRuta,
        idHabitacion: id,
        idcategoriaHabitacion: catHabitacion,
        idbarco: barco,
      };

      const response = await HabitacionService.updateHabitacion(dataConRuta);

      if (response.data) {
        toast.success(`Habitacion actualizada: ${response.data.nombre}`, {
          duration: 3000,
          position: "top-center",
        });
        navigate("/admin/habitacion");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando habitacion");
    }
  };

  const handleChangeImage = (e) => {
    const selectedFile = e.target.files[0];
    setFileURL(URL.createObjectURL(selectedFile));
    setValue("foto", selectedFile);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid
        container
        spacing={2}
        direction="column"
        sx={{ maxWidth: "50%", margin: "auto" }}
      >
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Editar Habitacion
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

          <Grid container spacing={15}>
            <Grid item xs={12} md={6}>
              <Controller 
                name="minHuesped"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mínimo de Huéspedes"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    variant="outlined"
                    error={Boolean(errors.minHuesped)}
                    helperText={errors.minHuesped?.message}
                  />            
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller 
                name="maxHuesped"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Máximo de Huéspedes"
                    type="number"
                    InputProps={{ inputProps: { min: 2 } }}
                    variant="outlined"
                    error={Boolean(errors.maxHuesped)}
                    helperText={errors.maxHuesped?.message}
                  />            
                )}
              />
            </Grid>
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
          <FormControl fullWidth>
            <input type="file" onChange={handleChangeImage} />
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
