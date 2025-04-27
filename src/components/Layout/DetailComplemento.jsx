import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Grid from "@mui/material/Grid";
import ComplementoService from "../../services/ComplementoService";
import { CircularProgress } from "@mui/material";

export function DetailComplemento() {
  const { id } = useParams();

  // Estado para el API
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ComplementoService.getComplementobyId(id)
      .then((response) => {
        setData(response.data);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error);
        setLoaded(true);
      });
  }, [id]);

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
    if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <Grid container spacing={2}>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data.nombre+"a"}
            </Typography>
            <Typography
              variant="subtitle2"
              component="h2"
              gutterBottom
            ></Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Descripción:
              </Box>{" "}
              {data.descripcion}
              <br></br>
              <br></br>
            </Typography>
            <ListItemButton>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    Precio: {data.precio}
                  </>
                }
              />
            </ListItemButton>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
