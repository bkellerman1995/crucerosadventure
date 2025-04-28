import {React, useState} from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid2";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { Info } from "@mui/icons-material";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import {format, addDays} from 'date-fns';
import {useUsuarioContext} from "../../context/usuarioContext";
import {ModalInfoReservas} from "./ModalInfoReservas";

ListCardCruceros.propTypes = {
  data: PropTypes.array,
  botonCrearActivo: PropTypes.bool.isRequired,
  tituloActivo: PropTypes.bool.isRequired,
  botonVerReservas: PropTypes.bool.isRequired,
};

export function ListCardCruceros({ data, botonCrearActivo, tituloActivo, botonVerReservas }) {
  // Usar el contexto para acceder al usuario
  const { usuario } = useUsuarioContext();

  console.log("Usuario desde el contexto:", usuario);

  // Estado para controlar la apertura del modal de Info Reservas
  const [openModalInfoReservas, setOpenModalInfoReservas] = useState(false);

  // Estado para configurar el id del crucero de la tarjeta seleccionada
  const [idCrucero, setIdCrucero] = useState(null);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h5"
          gutterBottom
          visibility={
            usuario.tipo === "admin" && botonCrearActivo === true
              ? "visible"
              : "hidden"
          }
        >
          <b>Lista de cruceros</b>
        </Typography>

        <Tooltip title="Crear">
          <Button
            style={{
              marginRight: "15px",
              backgroundColor: "#16537e",
              display:
                usuario.tipo === "admin" &&
                botonCrearActivo === true &&
                tituloActivo === true
                  ? "flex"
                  : "none",
            }}
            component={Link}
            to="/admin/crucero/crear"
            variant="contained"
            endIcon={<AddIcon />}
          >
            Crear
          </Button>
        </Tooltip>
      </Box>

      <Grid container sx={{ p: 2 }} spacing={3}>
        {/* ()=>{} */}
        {data &&
          data.map((item) => (
            <Grid size={4} key={item.idCrucero}>
              <Card className="tarjetaCrucero">
                <CardHeader
                  className="cardHeader"
                  sx={{ p: 0 }}
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: 8,
                  }}
                  title={item.nombre}
                />
                <Typography variant="body2" color="text.secondary">
                  <span></span>
                </Typography>

                <CardMedia
                  // className="card"
                  sx={{ height: 250 }}
                  component="img"
                  image={item.foto}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    <span>
                      <b>Barco: </b> {item.barco.nombre}
                    </span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <span>
                      <b>Cantidad de Días: </b> {item.cantDias}
                    </span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <span>
                      <b>Puerto de salida: </b>
                      {item.puertosItinerario &&
                      item.puertosItinerario.length > 0
                        ? item.puertosItinerario[0].puerto.nombre
                        : "No hay puertos disponibles"}
                    </span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <span>
                      <b>Precios desde: </b>
                      {item.fechasPreciosHabitaciones &&
                      item.fechasPreciosHabitaciones.length > 0
                        ? `$${
                            item.fechasPreciosHabitaciones.reduce(
                              (min, current) => {
                                // Comparar los precios y devolver el más bajo
                                return parseFloat(current.precio) <
                                  parseFloat(min.precio)
                                  ? current
                                  : min;
                              }
                            ).precio
                          } (por habitación)`
                        : "No hay precios disponibles"}
                    </span>
                  </Typography>
                </CardContent>

                <CardActions
                  disableSpacing
                  sx={{
                    backgroundColor: (theme) => theme.palette.action.focus,
                    color: (theme) => theme.palette.common.white,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Typography variant="body2" color="text.secondary">
                      {/* Verificación de que hayan fechas asignadas
                      antes de acceder al primer elemento */}
                      <b>Próxima salida: </b>
                      {/* {console.log("Fecha asignada: ",item.fechasAsignadas[0])} */}
                      {item.fechasAsignadas && item.fechasAsignadas.length > 0
                        ? format(
                            addDays(item.fechasAsignadas[0], 1),
                            "dd/MM/yyyy"
                          )
                        : "No hay fechas asignadas"}
                    </Typography>
                    <IconButton
                      component={Link}
                      to={`/crucero/${item.idCrucero}`}
                      aria-label="Detalle"
                      sx={{ marginLeft: "auto" }}
                    >
                      <Info />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
              <br />

              {/* Botón ver reservas crucero*/}
              <Grid size={6} sm={4} spacing={1}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    backgroundColor: "#16537e",
                    display:
                    usuario.tipo === "admin" &&
                    botonCrearActivo === true &&
                    tituloActivo === true
                      ? "flex"
                      : "none",
                  }}
                  onClick={() => {
                    setIdCrucero(item.idCrucero);
                    console.log("ID del crucero:", item.idCrucero);
                    setOpenModalInfoReservas(true);
                  }}
                >
                  Ver reservas
                </Button>
              </Grid>
            </Grid>
          ))}
      </Grid>

      <ModalInfoReservas
        open={openModalInfoReservas}
        handleClose={() => setOpenModalInfoReservas(false)}
        idCrucero={idCrucero}
      />
    </>
  );
}
