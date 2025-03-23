import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'itinerariopuerto';
console.log ('BASE_URL: ', BASE_URL);


class ItinerarioPuertoService {
  //Definición para llamar al API y obtener el listado de los itinerarios

  //Lista de todos los itinerarios con su puerto.
  //localhost:81/crucerosadventure/itinerariopuerto
  getItinerarioPuerto() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un itinerarioPuerto por su id
  //localhost:81/crucerosadventure/itinerariopuerto/{id}
  getItinerarioByID(itinerarioPuertoID) {
    console.log("BASE_URL ITINERARIO: ", BASE_URL + "/" + itinerarioPuertoID);
    console.log("itinerario ID: ", itinerarioPuertoID);
    return axios.get(BASE_URL + "/" + itinerarioPuertoID);
  }

  //Agregar puerto al itinerario
  agregarPuertoItinerario(puerto) {
    return axios.post(BASE_URL, JSON.stringify(puerto));
  }

  updateItinerario(itinerario) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(itinerario),
    });
  }

  //Borrar itinerario (SOLO PARA EFECTOS DEL FRONTEND y no tener datos basura en la base de datos)
  deleteItinerario(itinerarioID) {
    console.log("BASE_URL DELETE ITINERARIO: ", BASE_URL + "/" + itinerarioID);
    console.log("itinerario ID a eliminar: ", itinerarioID);
    return axios.delete(BASE_URL + "/" + itinerarioID);
  }
}

export default new ItinerarioPuertoService()