import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
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
      .typeError("Ingrese un número")
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

  // Obtener complemento por ID (query param)
  useEffect(() => {
    if (!id) {
      toast.error("No se proporcionó ID de complemento");
      navigate("/complemento-table");
      return;
    }

    ComplementoService.getComplementobyId(id)
      .then((res) => {
        const complemento = res.data;
        console.log("Complemento recibido",complemento);
        setValue("nombre", complemento.nombre);
        setValue("descripcion", complemento.descripcion);
        setValue("precio", complemento.precio);
        // const estadoValue =
        //   complemento.estado === 1 || complemento.estado === null ? 1 : 0;
        // setValue("estado", estadoValue);
      })
      .catch((err) => {
        setError(err);
        toast.error("Error al cargar el complemento");
      });
  }, [id]);

  const onSubmit = async (dataForm) => {
    try {

      const dataConIdComplemento ={
        ...dataForm,
        idComplemento: parseInt(id),
      };

      console.log("Datos a enviar",dataConIdComplemento);
      const response = await ComplementoService.update(dataConIdComplemento);

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
            Actualizar Complemento
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
        <Grid item size={4}>
          <FormControl fullWidth>
            <Controller
              name="precio"
              control={control}
              render={({ field }) => {
                const handleKeyPress = (e) => {
                  // Prevenir la entrada del signo "-"
                  if (e.key === "-") {
                    e.preventDefault();
                  }
                };
                return (
                  <>
                    <TextField
                      label="$"
                      {...field} // Asocia el input con el estado del formulario
                      placeholder="0"
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        fontSize: "16px",
                      }}
                      type="number" // Asegura que solo se puedan ingresar números
                      //Quitar los controles de incremento y decremento
                      slotProps={{
                        input: {
                          type: "number",
                          sx: {
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                              {
                                display: "none",
                              },
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                          },
                        },
                      }}
                      min="500" // Valor mínimo
                      max="999" // Valor máximo
                      onKeyPress={handleKeyPress} // Prevenir ingreso de "-"
                      onInput={(e) => {
                        // Prevenir ingreso de números negativos
                        if (e.target.value < 0) {
                          e.target.value = 0;
                        }
                        // Limitar la longitud a 3 caracteres
                        if (e.target.value.length > 3) {
                          e.target.value = e.target.value.slice(0, 3);
                        }
                      }}
                      error={Boolean(errors.precio)}
                      helperText={errors.precio?.message}
                    />
                  </>
                );
              }}
            />
          </FormControl>
        </Grid>

        {/* Estado */}
        <Grid item>
          <Box
            sx={{ width: "30%", backgroundColor: "#D3D3D3", borderRadius: 2 }}
          >
            <Typography>
              <MenuItem value={0}>Activo</MenuItem>
            </Typography>
          </Box>
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
