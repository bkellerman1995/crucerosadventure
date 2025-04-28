import React from "react";
import { useState, useEffect } from "react";
import { Modal, Box,Button} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";
import { format, addDays } from "date-fns";
import { BarChart, Bar,Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import CruceroService from "../../services/CrucerosService";

export function ModalInfoReservas ({ open, handleClose,idCrucero}) {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);

  // Estado para los datos del gráfico
  const [chartData, setChartData] = useState([]);  

  // Estado para controlar el tipo de gráfico (cantidad reservas, habitacions disponibles o huéspedes con reserva)
  const [chartType, setChartType] = useState("reservas");  

  //Use Effect para renderizar la grafica al abrir el modal
  useEffect(() => {

    // Reiniciar los datos del gráfico cada vez que el idCrucero cambie o se abra el modal de nuevo
    setChartData([]);

    // Resetear el tipo de gráfico a "reservas" al abrir el modal 
    setChartType("reservas");

    if (idCrucero) {
      console.log("idCrucero recibido en el modal:", idCrucero);
      CruceroService.getCrucerobyId(idCrucero)
        .then((response) => {
          setData(response.data);
          console.log(
            "Cantidad de reservas del crucero:",
            response.data.cantidadReservas
          );
          console.log(
            "Habitaciones disponibles por categoria:",
            response.data.habitacionesDisponiblesPorCategoria
          );
          console.log(
            "Cantidad de huespedes con reserva:",
            response.data.huespedesConReserva
          );

          // Cargar los datos del gráfico por defecto cuando se recibe la información
          const defaultChartData = response.data.cantidadReservas.map(
            (item) => ({
              fecha: format(addDays(new Date(item.fecha), 1), "dd/MM/yyyy"), // Fecha para el eje X
              cantidad: parseInt(item.cantidadReservas, 10), // Convertir cantidad de reservas a número
            })
          );

          setChartData(defaultChartData); // Establecer los datos por defecto
        })
        .catch((error) => {
          console.error("Error al cargar la información del crucero", error);
        });
    }
  }, [open, idCrucero]); // Se ejecuta cuando se abre el modal o cambia el idCrucero

  // Función para cerrar el modal
  const handleModalClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleClose(); // Solo cerrar si no es un clic en el backdrop
    }
  };


  // Función para cambiar el tipo de gráfico (habitaciones o huéspedes)
  const handleChartDataChange = (type) => {
    setChartType(type);
    if (type === "habitaciones") {
      // Datos de habitaciones disponibles por categoría
      const habitacionesData = data.habitacionesDisponiblesPorCategoria.map(
        (item) => ({
          fecha: item.nombreCategoria, // Usamos el nombre de la categoría como "fecha" en el gráfico
          cantidad: parseInt(item.habitaciones_disponibles, 10),
        })
      );
      setChartData(habitacionesData);
    
    } else if (type === "huespedes") {
      
      // Datos de huéspedes con reserva
      const huespedesData = data.huespedesConReserva.map((item) => ({
        fecha: `ID de crucero: ${item.idCrucero}`, // Usamos el ID del crucero como "fecha"
        cantidad: parseInt(item.cantidad_huespedes, 10),
      }));
      setChartData(huespedesData);
    }
  };

  console.log("Datos para el gráfico:", chartData);

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          maxWidth: "600px",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Button
          onClick={handleModalClose}
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

        <br />

        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            style={{
              backgroundColor: "#16537e",
            }}
            // Cambiar al gráfico de habitaciones
            onClick={() => handleChartDataChange("habitaciones")}
          >
            Habitaciones disponibles por categoría
          </Button>

          <Button
            variant="contained"
            type="submit"
            style={{
              backgroundColor: "#16537e",
            }}
            // Cambiar al gráfico de huéspedes
            onClick={() => handleChartDataChange("huespedes")}
          >
            Cantidad de huéspedes con reserva
          </Button>
        </Box>

        <Grid
          container
          sx={{ p: 2, display: "flex", justifyContent: "center" }}
          spacing={3}
        >
          <Grid
            container
            sx={{ p: 2, display: "flex", justifyContent: "center" }}
            spacing={3}
          >
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                name={
                  chartType === "reservas"
                    ? "Cantidad de Reservas"
                    : chartType === "habitaciones"
                      ? "Habitaciones Disponibles"
                      : "Huéspedes con reserva"
                }
                dataKey="cantidad"
                fill="#008000"
                activeBar={<Rectangle fill="#90EE90" stroke="#ADD8E6" />}
              />
            </BarChart>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

// Validación de las props con PropTypes
ModalInfoReservas.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  idCrucero: PropTypes.number.isRequired,
};
