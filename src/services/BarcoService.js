import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'barco';
console.log ('BASE_URL: ', BASE_URL);


class BarcoService {
  //Definición para llamar al API y obtener el listado de los cruceros}

  //Lista de todas las habitaciones.
  //localhost:81/crucerosadventure/habitacion
  getBarcos() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un barco por su id
  //localhost:81/crucerosadventure/barco/{id}
  getBarco(cruceroId) {
    return axios.get(BASE_URL + cruceroId);
  }
}

export default new BarcoService()