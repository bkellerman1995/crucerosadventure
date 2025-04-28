import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import ComplementoService from "../../services/ComplementoService";
import toast from "react-hot-toast";

export function UpdateComplemento() {
  const navigate = useNavigate();

  // Ahora obtenemos el ID desde el query param ?id=...
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [error, setError] = useState("");

  const complementoSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .min(2, "Debe tener al menos 2 caracteres"),
    descripcion: yup.string().required("La descripción es requerida"),
    precio: yup
      .number()
      .typeError("Debe ser un número")
      .required("El precio es requerido")
      .positive("Debe ser un número positivo"),
    estado: yup.number().required("El estado es requerido"),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      precioAplicado: "habitación",
      estado: 1,
    },
    resolver: yupResolver(complementoSchema),
  });

  // ✅ Obtener complemento por ID (query param)
  useEffect(() => {
    if (!id) {
      toast.error("No se proporcionó ID de complemento");
      navigate("/complemento-table");
      return;
    }

    ComplementoService.getComplementobyId(id)
      .then((res) => {
        const complemento = res.data;
        setValue("nombre", complemento.nombre);
        setValue("descripcion", complemento.descripcion);
        setValue("precio", complemento.precio);
        const estadoValue =
          complemento.estado === 1 || complemento.estado === null ? 1 : 0;
        setValue("estado", estadoValue);
      })
      .catch((err) => {
        setError(err);
        toast.error("Error al cargar el complemento");
      });
  }, [id]);

  const onSubmit = async (dataForm) => {
    try {
      const response = await ComplementoService.updateComplemento(dataForm);

      if (response.data) {
        toast.success(`Complemento actualizado: ${response.data.nombre}`, {
          duration: 3000,
          position: "top-center",
        });
        navigate("/admin/complemento");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando complemento");
    }
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

        {/* Descripción */}
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

        {/* Precio */}
        <Grid item>
          <FormControl fullWidth>
            <Controller
              name="precio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio en dólares"
                  error={Boolean(errors.precio)}
                  helperText={errors.precio?.message}
                />
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
