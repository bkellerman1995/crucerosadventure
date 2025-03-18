import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'puerto';
console.log ('BASE_URL: ', BASE_URL);


class PuertoService {
  //Definición para llamar al API y obtener el listado de los barco}

  //Lista de todos los puertos.
  //localhost:81/crucerosadventure/habitacion
  getPuertos() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un barco por su id
  //localhost:81/crucerosadventure/barco/{id}
  getPuertoById(puertoId) {
    console.log('BASE_URL BARCO: ', BASE_URL+ '/'+ puertoId);
    console.log('barco ID: ', puertoId);
    return axios.get(BASE_URL + "/" + puertoId);
    
  }
  createPuerto(puerto) {
    return axios.post(BASE_URL, JSON.stringify(puerto));
  }
  
  updatePuerto(puerto) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(puerto)

    })
  }
}

export default new PuertoService()