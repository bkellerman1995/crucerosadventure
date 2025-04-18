import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ReservaService from "../../services/ReservaService";
import { CircularProgress } from "@mui/material";
// import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import html2pdf from "html2pdf.js"; 
import {Card, ListGroup, Row, Col, Table, Button } from 'react-bootstrap';
import ContainerBootStrap from 'react-bootstrap/Container';
import {format, addDays} from 'date-fns';


export function DetailReserva() {
  const routeParams = useParams();

  console.log(routeParams);

  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

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

  //Función para exportar reserva a PDF
  const exportarAPDF = () => {
    const contenido = document.getElementById("contenido");

    // Opciones de configuración de html2pdf.js
    const options = {
      margin: 20, // Márgenes
      filename: "detalle_reserva.pdf", // Nombre del archivo PDF
      image: { type: "jpeg", quality: 0.98 }, // Opciones de imagen
      html2canvas: { scale: 2,logging: true, dpi: 300, letterRendering: true }, // Aumenta la escala de la renderización
      jsPDF: {
        unit: "mm", // Unidades en milímetros
        format: "a4", // Formato de la página
        orientation: "portrait", // Orientación de la página
        putOnlyUsedFonts: true, // Solo usar las fuentes necesarias
      },
    };

    // Generar el PDF
    html2pdf()
      .from(contenido)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        var totalPaginas = pdf.internal.getNumberOfPages();
        const pageHeight = pdf.internal.pageSize.height;
        const pageWidth = pdf.internal.pageSize.width;
        // Para generar el footer
        for (let i = 1; i <= totalPaginas; i++) {
          // Agregar el footer a cada página
          pdf.setPage(i);
          pdf.setFontSize(10);

          //Total de páginas
          pdf.text(
            pageWidth - 40,
            pageHeight - 10,
            `Página ${i} de ${totalPaginas}`
          );
        }

        // Establecer la posición inicial para la primera línea (X: 10, Y: pageHeight - 20)
        let yPosition = pageHeight - 20;

        // Datos de la empresa alineados a la izquierda
        pdf.text(10, yPosition, "CRuceros Adventure");
        yPosition += 5; // Aumentar el valor de Y para la siguiente línea
        pdf.text(10, yPosition, "Correo: administracion@crucerosadventure.com");
        yPosition += 5;
        pdf.text(10, yPosition, "Teléfono: +50624420002");
        yPosition += 5;
        pdf.text(10, yPosition, "Sitio web: crucerosadventure.com");
      })
      .save();

    this.elementPDF.clear();
  };

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
        <>
          <Button variant="primary" className="mt-4" onClick={exportarAPDF}>
            Generar PDF
          </Button>
          <br></br>
          <br></br>
          <Card id="contenido">
            {/* Encabezado */}
            <Card.Header>
              <h2>
                <b>Resumen de reserva - Crucero #{data.idReserva}</b>
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
                <b>Detalles de la reserva</b>
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
                        {format(addDays(data.fechaInicio, 1), "dd/MM/yyyy")}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div>
                        <strong>Fecha de llegada:</strong>{" "}
                        {format(data.fechaFinal.date, "dd/MM/yyyy")}
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              {/* Habitaciones reservadas */}
              <Col xs={12} md={12}>
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
                        <b>Costo total por habitaciones:</b>
                      </td>
                      <td className="text-right">
                        {`$${data.totalHabitaciones}`}
                      </td>
                    </tr>
                  </tbody>
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
                    {/* Validar si complementosAdicionales no es null o vacío */}
                    {data.complementosAdicionales &&
                    data.complementosAdicionales.length > 0 ? (
                      data.complementosAdicionales.map((item) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2"><i>No hay complementos adicionales.</i></td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="3" className="text-right">
                        <b>Costo total por complementos:</b>
                      </td>
                      <td className="text-right">
                        {`$${data.totalComplementos}`}
                      </td>
                    </tr>
                  </tbody>
                  <br />

                  <h5>
                    <b>Totales:</b>
                  </h5>

                  <tbody>
                    {/* Subtotal */}
                    <tr>
                      <td colSpan="2" className="text-right">
                        <b>Subtotal:</b>
                      </td>
                      <td colSpan="3" className="text-right">
                        ${data.subTotal}
                      </td>
                    </tr>

                    {/* Impuesto */}
                    <tr>
                      <td colSpan="2" className="text-right">
                        <b>Impuesto (IVA):</b>
                      </td>
                      <td colSpan="3" className="text-right">
                        {data.impuestos * 100}%
                      </td>
                    </tr>

                    {/* Tarifa portuaria */}
                    <tr>
                      <td colSpan="2" className="text-right">
                        <b>Tarifa portuaria:</b>
                      </td>
                      <td colSpan="3" className="text-right">
                        ${data.tarifaPortuaria}
                      </td>
                    </tr>

                    {/* Total a pagar */}
                    <tr>
                      <td colSpan="2" className="text-right">
                        <b>Precio Total:</b>
                      </td>
                      <td colSpan="3" className="text-right">
                        ${data.precioTotal}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              {/* Estado de pago */}
              <Typography component="span" variant="subtitle1" gutterBottom>
                <b>Estado de pago: </b>
                {/* Operador ternario para desplegar el estado de pago de la reserva en detalle de reserva */}
                {data.idEstadoPago == 2 ? "Pendiente" : "Pagada en totalidad"}{" "}
                <br></br>
              </Typography>
              {/* Fecha límite de pago */}
              <Typography
                component="span"
                variant="subtitle1"
                gutterBottom
                display={
                  data.idEstadoPago === 2
                    ? { display: "none" }
                    : { display: "block" }
                }
              >
                <b>Fecha límite de pago: </b>
                {format(
                  addDays(new Date(data.fechaLimitePagos.fechaLimitePagos), 1),
                  "dd/MM/yyyy"
                )}
              </Typography>
              {/* Saldo */}
              <Typography
                component="span"
                variant="subtitle1"
                gutterBottom
                display={
                  data.idEstadoPago === 2
                    ? { display: "none" }
                    : { display: "block" }
                }
              >
                <b>Saldo: </b>${data.saldo}
              </Typography>
            </Card.Body>
          </Card>
          <Button variant="primary" className="mt-4" onClick={exportarAPDF}>
            Generar PDF
          </Button>
        </>
      )}
    </ContainerBootStrap>
  );
}
