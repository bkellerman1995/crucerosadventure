import React from "react";
//import { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { Info } from "@mui/icons-material";
import PropTypes from "prop-types";

ListCardCruceros.propTypes = {
  data: PropTypes.array,
};

export function ListCardCruceros({ data }) {

  
  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {/* ()=>{} */}
      {data &&
        data.map((item) => (
          <Grid size={4} key={item.idCrucero}>
            <Card>
              <CardHeader
                sx={{
                  p: 0,
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  color: (theme) => theme.palette.common.black,
                }}
                style={{ textAlign: "center" }}
                title={item.nombre}
                subheader={
                  <span>
                    <br></br>
                    <b>Fecha de salida:</b> <br></br>
                    {item.fechaSalida}
                  </span>
                }
              />

              <CardMedia
                sx={{ height: 250 }}
                component="img"
                image={item.foto}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <span>
                    <b>Barco: </b> {item.barco.descripcion}
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
                <IconButton
                  component={Link}
                  to={`/crucero/${item.idCrucero}`}
                  aria-label="Detalle"
                  sx={{ ml: "auto" }}
                >
                  <Info />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
