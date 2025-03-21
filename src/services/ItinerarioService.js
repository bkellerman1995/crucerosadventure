import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'itinerario';
console.log ('BASE_URL: ', BASE_URL);


class ItinerarioService {
  //Definición para llamar al API y obtener el listado de los itinerarios

  //Lista de todos los itinerarios.
  //localhost:81/crucerosadventure/itinerario
  getItinerarios() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un itinerario por su id
  //localhost:81/crucerosadventure/itinerario/{id}
  getItinerarioByID(itinerarioID) {
    console.log('BASE_URL ITINERARIO: ', BASE_URL+ '/'+ itinerarioID);
    console.log('itinerario ID: ', itinerarioID);
    return axios.get(BASE_URL + "/" + itinerarioID);
    
  }

  //Crear itinerario
  createItinerario(itinerario) {
    return axios.post(BASE_URL, JSON.stringify(itinerario));
  }
  
  updateItinerario(itinerario) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(itinerario)

    })
  }

  //Borrar itinerario (SOLO PARA EFECTOS DEL FRONTEND y no tener datos basura en la base de datos)
  deleteItinerario(itinerarioID) {
    console.log('BASE_URL DELETE ITINERARIO: ', BASE_URL + '/' + itinerarioID);
    console.log('itinerario ID a eliminar: ', itinerarioID);
    return axios.delete(BASE_URL + '/' + itinerarioID);
  }
}

export default new ItinerarioService  ()