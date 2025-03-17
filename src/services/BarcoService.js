import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'barco';
console.log ('BASE_URL: ', BASE_URL);


class BarcoService {
  //Definición para llamar al API y obtener el listado de los barco}

  //Lista de todas las habitaciones.
  //localhost:81/crucerosadventure/habitacion
  getBarcos() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un barco por su id
  //localhost:81/crucerosadventure/barco/{id}
  getBarcobyId(barcoId) {
    console.log('BASE_URL BARCO: ', BASE_URL+ '/'+ barcoId);
    console.log('barco ID: ', barcoId);
    return axios.get(BASE_URL + "/" + barcoId);
    
  }
  createBarco(Barco) {
    return axios.post(BASE_URL, JSON.stringify(Barco));
  }
  
  updateBarco(Barco) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Barco)

    })
  }
}

export default new BarcoService()