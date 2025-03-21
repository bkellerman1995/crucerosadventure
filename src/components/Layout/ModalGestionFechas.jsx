import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BarcoService from "../../services/BarcoService";


import PropTypes from "prop-types";

export function ModalGestionFechas({ open, handleClose,barco }) {
  const [barcoData, setBarcoData] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  //Hooks de fecha del dia de hoy
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    dayjs().add(1, "month")
  );

  //Función para manejar el form
  const {
    // control,
    // setValue,
    // handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      capacidadHuesped: "",
      estado: "",
      foto: "",
    },
    // resolver: yupResolver(cruceroSchema),
  });

  useEffect(() => {
    if (open && barco) {
      console.log("Se recibió barco en ModalGestionFechas:", barco);
      const idbarco = barco.value;
      console.log("Id de barco:", barco);

      BarcoService.getBarcobyId(idbarco)
        .then((response) => {
          console.log("Habitaciones cargadas:", response.data);
          setBarcoData(response.data);
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    }
  }, [open, barco]);

  const handleModalClose = () => {
    setOpenConfirmDialog(true);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          maxWidth: "900px",
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "5px",
            right: "5px",
            minWidth: "30px",
            height: "30px",
            backgroundColor: "#16537e",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "darkred" },
            zIndex: 1000,
          }}
        >
          ✕
        </Button>
        <Typography variant="h4" component="h2">
          <b>Gestionar Fechas</b>
        </Typography>
        <br />

        <Grid container spacing={2}>
          {/* Fecha límite de pago*/}
          <Grid size={3} sm={6}>
            <Typography variant="subtitle1">
              <b>Fecha de inicio</b>
            </Typography>
            <br></br>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Seleccione una fecha"
                value={fechaSeleccionada} //Valor por defecto: hoy
                onChange={(newValue) => setFechaSeleccionada(newValue)}
                slotProps={{
                  textField: { variant: "outlined", fullWidth: true },
                }}
                format="DD/MM/YYYY"
                // Para configurar la fecha al día de hoy -> minDate={dayjs()}
                // Para configurar la fecha dentro de un mes
                minDate={dayjs().add(1, "month")}
                //Para forzar la selección en el UI al valor mínimo por defecto
                onOpen={() => {
                  if (!fechaSeleccionada) setFechaSeleccionada(dayjs()); // Si no hay fecha, asigna el mínimo
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={20} sm={6}>
              <Typography variant="subtitle1">
                <b>Precios de habitaciones</b>
              </Typography>
              <br />

              <Grid
                size={20}
                sm={6}
                sx={{ backgroundColor: "#ADD8E6", padding: 2 }}
              >
                {barcoData.habitaciones?.length > 0 ? (
                  barcoData.habitaciones.map((habitacion) => (
                    <Typography key={habitacion.idHabitacion}>
                      <React.Fragment>
                        <b>{habitacion.nombre}</b>:
                        <br />
                        <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                        <TextField
                                // {...field}
                                id="precio"
                                label="$"
                                error={Boolean(errors.precio)}
                                sx = {{backgroundColor:"white", width:"100%",ml:-1 }}
                                // helperText={
                                //   errors.nombre ? errors.nombre.message : " "
                                // }
                              />
                          
                        </FormControl>
                      </React.Fragment>
                    </Typography>
                  ))
                ) : (
                  <Typography color="error">
                    <b>No hay habitaciones disponibles.</b>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <br></br>

        <Grid container spacing={2}>
          {/* Fecha */}
          <Grid size={3} sm={6}>
            <Typography variant="subtitle1">
              <b>Fecha límite de pago</b>
            </Typography>
            <br></br>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Seleccione una fecha"
                value={fechaSeleccionada} //Valor por defecto: hoy
                onChange={(newValue) => setFechaSeleccionada(newValue)}
                slotProps={{
                  textField: { variant: "outlined", fullWidth: true },
                }}
                format="DD/MM/YYYY"
                minDate={dayjs().add(1, "month")}
                onOpen={() => {
                  if (!fechaSeleccionada) setFechaSeleccionada(dayjs()); // Si no hay fecha, asigna el mínimo
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <br></br>

        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            mt: 3,
            backgroundColor: "#16537e",
            color: "white",
            "&:hover": { backgroundColor: "#133d5a" },
            width: "200px",
            height: "40px",
            fontSize: "0.9rem",
            mx: "auto",
            display: "block",
          }}
          fullWidth
        >
          Confirmar
        </Button>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>¿Desea salir sin guardar?</DialogTitle>
          <DialogContent>Esto eliminará el itinerario creado.</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button color="error">Sí, eliminar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}

ModalGestionFechas.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  cantDias: PropTypes.number.isRequired,
  barco: PropTypes.object, 
};
