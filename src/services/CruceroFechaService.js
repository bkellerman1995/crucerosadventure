import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'crucerofecha';
console.log ('BASE_URL: ', BASE_URL);


class CruceroFechaService {
  //Definición para llamar al API y obtener el listado de los itinerarios

  //Lista de todos los cruceros con su respectiva fecha.
  //localhost:81/crucerosadventure/cruceroFecha
  getCruceroPorFecha() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un cruceroFecha por su id
  //localhost:81/crucerosadventure/cruceroFecha/{id}
  getCruceroPorFechaByID(cruceroFechaID) {
    console.log("BASE_URL CRUCEROFECHA: ", BASE_URL + "/" + cruceroFechaID);
    console.log("crucero_fecha ID: ", cruceroFechaID);
    return axios.get(BASE_URL + "/" + cruceroFechaID);
  }

  //Crear fechaCrucero
  createFechaCrucero(cruceroFecha) {
    return axios.post(BASE_URL, JSON.stringify(cruceroFecha));
  }

  updateFechaCrucero(cruceroFecha) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(cruceroFecha),
    });
  }

  //Borrar itinerario (SOLO PARA EFECTOS DEL FRONTEND y no tener datos basura en la base de datos)
  deleteItinerario(cruceroFechaID) {
    console.log("BASE_URL DELETE CRUCEROFECHA: ", BASE_URL + "/" + cruceroFechaID);
    console.log("Crucero Fecha ID a eliminar: ", cruceroFechaID);
    return axios.delete(BASE_URL + "/" + cruceroFechaID);
  }
}

export default new CruceroFechaService()