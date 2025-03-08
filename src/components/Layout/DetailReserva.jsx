import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Grid from "@mui/material/Grid2";
import ReservaService from "../../services/ReservaService";

export function DetailReserva() {
  const routeParams = useParams();

  console.log(routeParams);

  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //variable para almacenar el total a pagar solo por los complementos
  let totalComplementos = 0;

  //variable para almacenar el impuesto (IVA)
  const impuesto = 0.13;

  //variable para almacenar tarifas de servicios
  const tarifaServicio = 100;

  //variable para almacenar la fecha de pago (si la reserva está pendiente de pago)
  let fechaPago = new Date();

  useEffect(() => {
    //Llamar al API y obtener una reserva por su id
    ReservaService.getReservaById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log("datosReserva detail", response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("datos del crucero", data);

  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <Grid size={7}>
          <Typography variant="h4" component="h1" gutterBottom>
            Detalles de la reserva
          </Typography>
          <Typography variant="h5" component="h1" gutterBottom>
            {data.nombreCrucero}
          </Typography>
          <Typography component="span" variant="h6">
            <Box>Puertos (salida y regreso):</Box>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {data.itinerarioPuertos.map((item) => (
                <ListItemButton key={item.idItinerario}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.puerto.Nombre} - ${item.puerto.pais.descripcion}`}
                    secondary={item.puerto.descripcion}
                  />
                </ListItemButton>
              ))}
            </List>
          </Typography>
          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Fecha de salida:</b>{" "}
            {new Date(data.fechaInicio).toLocaleDateString("en-GB")}
            <br></br>
          </Typography>
          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Fecha de llegada:</b>{" "}
            {new Date(data.fechaFinal.date).toLocaleDateString("en-GB")}
            <br></br>
          </Typography>
          <br></br>

          <Typography component="span" variant="h6">
            <Box>Habitaciones reservadas:</Box>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {data.habitaciones.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItemButton key={item.idHabitacion}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.Descripcion} />
                    <ListItemText
                      secondary={`Cantidad de huéspedes: ${item.cantHuespedes}`}
                    />
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          </Typography>
          <br></br>

          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Total por habitaciones:</b> {`$${data.totalHabitaciones}`}{" "}
            <br></br>
          </Typography>
          <br></br>

          {/* Rubros por complementos */}
          <Typography component="span" variant="h6">
            <Box>Complementos:</Box>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {data.complementos.map(
                (item) =>
                  (
                    //ir sumando en totalComplementos el precio
                    //del item (complmemento) por la cantidad
                    //en cada iteración de data.complementos,map
                    (totalComplementos += item.precio * item.cantidad),
                    (
                      <React.Fragment key={item.id}>
                        <ListItemButton key={item.idComplemento}>
                          <ListItemIcon>
                            <ArrowRightIcon />
                          </ListItemIcon>
                          <ListItemText primary={item.Descripcion} />
                          <ListItemText
                            sx={{ textAlign: "left", ml: 0 }}
                            secondary={
                              <>
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left" }}
                                >
                                  {item.descripcion}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {`Cantidad: ${item.cantidad}`}
                                </Typography>
                                <br></br>
                                <Typography
                                  variant="caption"
                                  sx={{ textAlign: "left" }}
                                  color="text.secondary"
                                >
                                  {`Total: $${item.precio * item.cantidad}`}
                                </Typography>
                              </>
                            }
                          />
                        </ListItemButton>
                      </React.Fragment>
                    )
                  )
              )}
            </List>
          </Typography>
          <br></br>

          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Subtotal:</b> {`$${data.totalHabitaciones + totalComplementos}`}{" "}
            <br></br>
          </Typography>
          <br></br>

          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Impuesto (IVA):</b> {`${impuesto * 100}%`} <br></br>
          </Typography>

          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Tarifa de servicio:</b> {`$${tarifaServicio}`} <br></br>
          </Typography>
          <br></br>

          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Precio Total: </b>
            {`$${
              data.totalHabitaciones +
              totalComplementos +
              tarifaServicio +
              (data.totalHabitaciones + totalComplementos + tarifaServicio) *
                impuesto
            }`}{" "}
            <br></br>
          </Typography>

          <Typography component="span" variant="subtitle1" gutterBottom>
            <b>Estado de pago: </b>
            {/* Operador ternario para desplegar el estado de pago de la reserva en detalle de reserva */}
            {data.estadoPago === "Pendiente"
              ? "Pendiente"
              : "Pagada en totalidad"}{" "}
            <br></br>
            <br></br>
          </Typography>

          <Typography component="span" variant="subtitle1" gutterBottom>
            {/* Operador ternario para desplegar el total a pagar si está pendiente */}
            {data.estadoPago === "Pendiente"
              ? //Setear la fecha de pago en 3 dias
                (fechaPago.setDate(fechaPago.getDate() + 3),
                (
                  <>
                    <b>Pendiente de pago: </b>
                    {`$${
                      data.totalHabitaciones +
                      totalComplementos +
                      tarifaServicio +
                      fechaPago.getDate() * 50 +
                      (data.totalHabitaciones +
                        totalComplementos +
                        tarifaServicio +
                        fechaPago.getDate() * 50) *
                        impuesto
                    }`}
                    <br></br>
                    {console.log(
                      "fecha de pago",
                      fechaPago.toISOString().split("T")[0]
                    )}
                    <b>Fecha limite de pago:</b>{" "}
                    {new Date(fechaPago).toLocaleDateString("en-GB")}
                  </>
                ))
              : ""}
            <br></br>
            <br></br>
          </Typography>
        </Grid>
        // </Grid>
      )}
    </Container>
  );

}
