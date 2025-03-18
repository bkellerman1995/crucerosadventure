import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import BarcoService from "../../services/BarcoService";
import CrucerosService from "../../services/CrucerosService";
import toast from "react-hot-toast";
import { SelectBarco } from "./SelectBarco";
import { ModalGestionPuertos } from './ModalGestionPuertos';


export function CreateCrucero() {
  const navigate = useNavigate();

  // Esquema de validación
  const cruceroSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .min(2, "Debe tener al menos 2 caracteres")
      .max(50, "No debe sobrepasar los 50 caracteres"),

    cantDias: yup
      .number()
      .typeError("Debe ser un número")
      .required("La cantidad de días es requerida")
      .positive("Debe ser un número positivo")
      .min(7, "La cantidad de días debe ser al menos 7")
      .max(14, "La cantidad de días no debe ser mayor a 14"),

    // foto: yup.required("La foto es requerida"),
    foto: yup
      .mixed()
      .test(
        "fileRequired",
        "La imagen es obligatoria",
        (value) => value && value.length > 0
      )
      .test(
        "fileType",
        "Solo se permiten imágenes (jpg, png, jpeg)",
        (value) =>
          value && value[0]
            ? ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
            : false
      )
      .test("fileSize", "El tamaño debe ser menor a 2MB", (value) =>
        value && value[0] ? value[0].size <= 2 * 1024 * 1024 : false
      ),
  });

  //Función para manejar el form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      capacidadHuesped: "",
      estado: "",
      foto: "",
    },
    resolver: yupResolver(cruceroSchema),
  });

  // Estado para almacenar el valor de cantidad de días
  const [cantDias, setCantDias] = useState(7); // Valor mínimo predeterminado

  // Estado para controlar la apertura del modal
  const [openModal, setOpenModal] = useState(false);

  //Hooks gestión de imagen
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  function handleChangeImage(e) {
    if (e.target.files) {
      setFileURL(
        URL.createObjectURL(e.target.files[0], e.target.files[0].name)
      );
      setFile(e.target.files[0], e.target.files[0].name);
    }
  }

  //Hooks de control de errores
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;

  //Hooks Lista de barcos
  const [dataBarco, setDataBarco] = useState({});
  const [loadedBarco, setLoadedBarco] = useState(false);

  useEffect(() => {
    BarcoService.getBarcos()
      .then((response) => {
        console.log(response);
        setDataBarco(response.data);

        setLoadedBarco(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedBarco(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      if (cruceroSchema.isValid()) {
        CrucerosService.createCrucero(DataForm)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              toast.success(
                `Crucero #${response.data.idCrucero} - ${response.data.nombre}`,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
              return navigate("/admin/crucero");
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error("Respuesta no válida del servidor");
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Cargar el grid del componente.
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={5}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              <b>Crear Crucero</b>
            </Typography>
          </Grid>

          {/* Datos del crucero (lado izquierdo) */}
          <Grid size={6} sm={6}>
            {/*Nombre */}
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre"
                    label="Nombre"
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre ? errors.nombre.message : " "}
                  />
                )}
              />
            </FormControl>
            <br></br>
            {/* Foto */}
            <Grid size={6} sm={6}>
              <Typography variant="subtitle1">
                <b>Foto</b>
              </Typography>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <input type="file" onChange={handleChangeImage} />
              </FormControl>
              {fileURL && <img src={fileURL} alt="preview" width={150} />}
            </Grid>
            <br></br>

            {/* Cantidad de días */}
            <Grid size={4} sm={6} spacing={2}>
              <Typography variant="subtitle1">
                <b>Cantidad de días</b>
              </Typography>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                <Controller
                  name="cantDias"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Seleccione un valor"
                      type="number"
                      variant="outlined"
                      inputProps={{
                        min: 7,
                        max: 14,
                        step: 1,
                      }}
                      onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        if (isNaN(value) || value < 7) value = 7;
                        else if (value > 14) value = 14;
                        setCantDias(value); // ACTUALIZA el estado cantDias con el valor seleccionado
                        field.onChange(value); // ACTUALIZA el valor en react-hook-form
                      }}
                      value={cantDias} // SE ASIGNA EL VALOR ACTUAL
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <br></br>
            {/* Barco */}
            <Grid size={12} sm={4}>
              <Typography variant="subtitle1">
                <b>Barco</b>
              </Typography>
              <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                {loadedBarco && (
                  <Controller
                    name="barco"
                    control={control}
                    render={({ field }) => (
                      <SelectBarco field={field} data={dataBarco} />
                    )}
                  />
                )}
              </FormControl>
            </Grid>
            <br></br>
            <br></br>

            {/* Botón */}
            <Grid size={4} sm={4}>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#16537e" }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>

          {/*Datos del crucero (lado derecho) */}

          <Grid container direction="column" spacing={2}>
            <Grid
              item
              xs={12}
              style={{
                backgroundColor: "#16537e",
                borderRadius: "16px",
                padding: "10px",
              }}
            >
              <Typography variant="h5" gutterBottom color="white">
                <b>Itinerario (puertos y actividades)</b>
              </Typography>

              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#50C878" }}
                    onClick={() => setOpenModal(true)}
                  >
                    Gestionar puertos
                  </Button>
                </Grid>

                {/* Modal importado para Geston de puertos */}
                <ModalGestionPuertos
                  open={openModal}
                  handleClose={() => setOpenModal(false)}
                  //pasar la cantidad de dias
                  cantDias={cantDias}
                  control={control}
                />

                <Grid item>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#B5485E" }}
                    onClick={() => setOpenModal(true)}
                  >
                    Mostrar puertos
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                backgroundColor: "#16537e",
                borderRadius: "16px",
                padding: "10px",
              }}
            >
              <Typography variant="h5" gutterBottom color="white">
                <b>Fechas y precios de habitaciones</b>
              </Typography>

              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#50C878" }}
                    onClick={() => setOpenModal(true)}
                  >
                    Gestionar fechas
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#B5485E" }}
                    onClick={() => setOpenModal(true)}
                  >
                    Mostrar fechas
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
