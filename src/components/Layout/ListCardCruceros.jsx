import React from "react";
//import { useEffect, useState } from 'react';
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
import {format} from 'date-fns';

ListCardCruceros.propTypes = {
  data: PropTypes.array,
};

export function ListCardCruceros({ data }) {
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" gutterBottom>
          Cruceros disponibles
        </Typography>
        <Tooltip title="Crear">
          <Button
            style={{ marginRight: "15px", backgroundColor: "#16537e" }}
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
              <Card>
                <CardHeader
                  className="cardHeader"
                  sx={{ p: 0 }}
                  style={{ textAlign: "center", fontWeight: "bold" }}
                  title={item.nombre}
                />
                <Typography variant="body2" color="text.secondary">
                  <span>
                    <br></br>
                  </span>
                </Typography>

                <CardMedia
                  className="imagen"
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {/* Verificación de que hayan fechas asignadas
                      antes de acceder al primer elemento */}
                      <b>Próxima salida: </b>
                      {/* {console.log("Fecha asignada: ",item.fechasAsignadas[0])} */}
                      {item.fechasAsignadas && item.fechasAsignadas.length > 0
                        ? format(item.fechasAsignadas[0],"dd/MM/yyyy")
                        : "No hay fechas asignadas"}
                    </Typography>
                    <IconButton
                      component={Link}
                      to={`/crucero/${item.idCrucero}`}
                      aria-label="Detalle"
                      sx={{ marginLeft:"auto" }}
                    >
                      <Info />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  );
}
