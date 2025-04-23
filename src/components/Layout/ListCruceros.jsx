import React from 'react';
import { useEffect, useState } from 'react';
import { ListCardCruceros } from './ListCardCruceros';
import CruceroService from '../../services/CrucerosService';
import {Box,Typography} from "@mui/material";
import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

// Validaciones de los props del componente
ListCruceros.propTypes = {
  searchQuery: PropTypes.object
};


export function ListCruceros({searchQuery}) {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de cruceros al cargar el componente
  useEffect(() => {
    CruceroService.getCruceros()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof SyntaxError) {
          setError(error);
          setLoaded(false);
        }
      });
  }, []);

  if (!loaded) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress style={{ color: "green" }} />
        <Typography variant="h5" gutterBottom style={{ color: "white" }}>
          <b>Cargando</b>
        </Typography>
      </Box>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  // Filtrar los cruceros con los valores de búsqueda
  // Se usa una ternaria para saber si se envió
  // el prop de searchQuery como parámetro
  const filteredCruceros = searchQuery
    ? data?.filter((crucero) => {
        //Búsqueda de crucero por nombre (destino)
        const matchesDestino =
          searchQuery.destino 
          && crucero.nombre
            ? crucero.nombre
                .toLowerCase()
                .includes(searchQuery.destino.toLowerCase())
            : false;

        //Búsqueda de crucero por puerto salida (primer puerto de itinerario)
        const matchesPuerto =
          searchQuery.puerto &&
          crucero.puertosItinerario &&
          crucero.puertosItinerario[0] &&
          crucero.puertosItinerario[0].puerto
            ? crucero.puertosItinerario[0].puerto.nombre
                .toLowerCase()
                .includes(searchQuery.puerto.toLowerCase())
            : false;

        // Búsqueda de crucero por fecha
        const matchesFecha =
          searchQuery.fecha &&
          crucero.fechasAsignadas &&
          crucero.fechasAsignadas.length > 0
            ? crucero.fechasAsignadas[0] === searchQuery.fecha
            : false;

        return matchesDestino || matchesPuerto || matchesFecha;
      })
    : data; // Si no hay searchQuery, no se filtra y se usan todos los cruceros

  // Si no hay resultados de búsqueda, muestra todos los cruceros
  if (filteredCruceros.length === 0) {
    return <ListCardCruceros data={data} />;
  }

  return (
    <>
      <ListCardCruceros data={filteredCruceros} />
    </>
  );
}
