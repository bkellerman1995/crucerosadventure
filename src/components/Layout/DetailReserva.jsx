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
import { CircularProgress } from "@mui/material";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import {Card, ListGroup, Row, Col, Table, Button } from 'react-bootstrap';
import ContainerBootStrap from 'react-bootstrap/Container';
import {format} from 'date-fns';


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

  if (!loaded) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh", 
        }}
      >
        <CircularProgress />
        <Typography variant="h5" gutterBottom>
          <b>Cargando</b>
        </Typography>
      </Box>
    );
  }
  
  if (error) return <p>Error: {error.message}</p>;

  //Obtener la fecha de hoy 
  const hoy = new Date();

  console.log("Datos de la reserva", data);

  return (
    <ContainerBootStrap component="main" className="mt-5">
      {data && (
        // Envolver todo el contenido de la reserva en un card
        <Card>
          {/* Encabezado */}
          <Card.Header>
            <h2>
              <b>Resumen de Reserva - Crucero #{data.idReserva}</b>
            </h2>
            <img
              src="../uploads/LogoTransparente.png"
              alt="Logo"
              style={{ width: "80px", height: "80px" }} // Ajusta el tamaño según sea necesario
            ></img>
            <h6>
              <b>Fecha de emisión</b>: {format(hoy, "dd/MM/yyyy")}
            </h6>
          </Card.Header>

          {/* Cuerpo/Contenido */}
          <Card.Body>
            <h4>
              <b>Detalles de la Reserva</b>
            </h4>
            <br />
            <h5>
              <b>Nombre del crucero: </b>
              {data.nombreCrucero}
            </h5>
            <br />

            {/* Puerto de salida y de regreso */}
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <h5>
                  <b>Puertos (salida y regreso):</b>
                </h5>
                <ListGroup>
                  {data.itinerarioPuertos.map((item) => (
                    <ListGroup.Item key={item.idItinerario}>
                      <ArrowRightIcon /> {item.puerto.nombre} -{" "}
                      {item.puerto.pais.descripcion}
                      <div>{item.puerto.descripcion}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <br />
              </Col>

              {/* Fecha de salida y de regreso */}
              <Col xs={12} md={6}>
                <h5>
                  <b>Fechas:</b>
                </h5>
                <ListGroup>
                  <ListGroup.Item>
                    <div>
                      <strong>Fecha de salida:</strong>{" "}
                      {new Date(data.fechaInicio).toLocaleDateString("en-GB")}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>
                      <strong>Fecha de llegada:</strong>{" "}
                      {new Date(data.fechaFinal.date).toLocaleDateString(
                        "en-GB"
                      )}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>

            <Row className="mb-3">
            {/* Habitaciones reservadas */}
            <Col xs={12} md={6}>
              <h5>
                <b>Habitaciones reservadas:</b>
              </h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {data.habitacionesReservadas.map((item) => (
                    <tr key={item.idHabitacion}>
                      <td>
                        {item.nombre}
                        <p>
                          <ArrowRightIcon />
                          Número de huéspedes: {item.cantidadHuespedes}
                        </p>
                      </td>
                      <td>${item.precio}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-right">
                      <b>Total:</b>
                    </td>
                    <td className="text-right">
                      {`$${data.totalHabitaciones}`}
                    </td>
                  </tr>
                </tbody>
              {/* </Table> */}
              <br />

              {/* Complementos adicionales */}
              <h5>
                <b>Complementos adicionales:</b>
              </h5>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Total a pagar por complemento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.complementosAdicionales.map((item) => (
                    <tr key={item.idComplemento}>
                      <td>
                        {item.nombre}
                        <p>
                          <ArrowRightIcon />
                          Cantidad: {item.cantidad}
                        </p>
                      </td>
                      <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-right">
                      <b>Total:</b>
                    </td>
                    <td className="text-right">
                      {`$${data.totalComplementos}`}
                    </td>
                  </tr>
                </tbody>
              </Table>

            </Col>

            <Col xs={12} md={6}>
            
            <br></br>
            <Typography component="span" variant="subtitle1" gutterBottom>
              <b>Subtotal:</b>{" "}
              {`$${data.totalHabitaciones + data.totalComplementos}`} <br></br>
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
              {data.idEstadoPago == 2 ? "Pendiente" : "Pagada en totalidad"}{" "}
              <br></br>
              <br></br>
            </Typography>
            <Typography component="span" variant="subtitle1" gutterBottom>
              {/* Operador ternario para desplegar el total a pagar si está pendiente */}
              {data.idEstadoPago === 2
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
            </Col>
            </Row>
          </Card.Body>
        </Card>
        // </Grid>
      )}
    </ContainerBootStrap>
  );

}
