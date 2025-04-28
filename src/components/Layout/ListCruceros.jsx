import React from 'react';
import { useEffect, useState } from 'react';
import { ListCardCruceros } from './ListCardCruceros';
import CruceroService from '../../services/CrucerosService';
import {Box,Typography} from "@mui/material";
import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

// Validaciones de los props del componente
ListCruceros.propTypes = {
  searchQuery: PropTypes.object, 
  botonCrearActivo: PropTypes.bool.isRequired,
  tituloActivo: PropTypes.bool.isRequired,
  botonVerReservas: PropTypes.bool.isRequired,
};

// Cuando no se envía el prop searchQuery, se establece un valor vacio ({}) por defecto
export function ListCruceros({searchQuery = {}, botonCrearActivo = false, tituloActivo = false, botonVerReservas = false}) {

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
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h5">
          <b>Cargando</b>
        </Typography>
      </Box>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  // Filtrar los cruceros con los valores de búsqueda
  // Se usa una ternaria para saber si se envió
  // el prop de searchQuery como parámetro
  const filteredCruceros =
    searchQuery.destino || searchQuery.puerto || searchQuery.fecha
      ? data?.filter((crucero) => {
          //Búsqueda de crucero por nombre (destino)
          const matchesDestino =
            searchQuery.destino && crucero.nombre
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

  // Si hay búsqueda y no hay resultados
  if (searchQuery.destino || searchQuery.puerto || searchQuery.fecha) {
    if (filteredCruceros.length === 0) {
      return (
        <Box sx={{ textAlign: "center", color: "white" }}>
          <Typography variant="h5" gutterBottom>
            <b>No hay cruceros con los filtros especificados</b>
          </Typography>
        </Box>
      );
    }
  }

  // Ordenar por fecha , según el valor de searchQuery.ordenFecha
  if (searchQuery.ordenFecha) {
    filteredCruceros.sort((a, b) => {
      const fechaA = new Date(a.fechasAsignadas[0]);
      const fechaB = new Date(b.fechasAsignadas[b.fechasAsignadas.length - 1]);
      return searchQuery.ordenFecha === "Más cercana"
        ? fechaA - fechaB
        : fechaB - fechaA;
    });
  }

  // Ordenar por precio , según el valor de searchQuery.ordenPrecio
  if (searchQuery.ordenPrecio) {
    filteredCruceros.sort((a, b) => {

      // Obtener el precio más bajo de cada crucero mediante reduce
      const precioA = a.fechasPreciosHabitaciones.reduce((min, current) => {
        return parseFloat(current.precio) < parseFloat(min.precio) ? current : min;
      }, a.fechasPreciosHabitaciones[0]).precio;
      
      const precioB = b.fechasPreciosHabitaciones.reduce((min, current) => {
        return parseFloat(current.precio) < parseFloat(min.precio) ? current : min;
      }, b.fechasPreciosHabitaciones[0]).precio;

      // Ordenar de acuerdo al valor de "ordenPrecio"
      return searchQuery.ordenPrecio === "Menor a mayor"
        ? precioA - precioB
        : precioB - precioA;
    });
  }

  // Renderizar los cruceros filtrados o todos si no hay filtro
  return (
    <ListCardCruceros
      // data={filteredCruceros.length > 0 ? filteredCruceros : data}
      data={filteredCruceros.length > 0 ? filteredCruceros : data}
      botonCrearActivo={botonCrearActivo}
      tituloActivo={tituloActivo}
      botonVerReservas={botonVerReservas}
    />
  );

}
