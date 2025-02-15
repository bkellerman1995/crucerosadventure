import React from 'react';
import { useEffect, useState } from 'react';
import { ListCardMovies } from './ListCardMovies';
import CrucerosService from '../../services/CrucerosService';

export function ListMovies() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de cruceros disponibles
  useEffect(() => {
    CrucerosService.getCruceros
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
          throw new Error("Respuesta no válida del servidor")
        }
      });
  },[]);
  if(!loaded) return <p>Cargando..</p>
  if(error) return <p>Error: {error.message}</p>

 
}
