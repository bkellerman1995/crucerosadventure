import axios from "axios";

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + "crucero";
console.log("BASE_URL: ", BASE_URL);

class CruceroService {
  //Definición para llamar al API y obtener el listado de los cruceros}

  //Lista de todos los cruceros.
  //localhost:81/crucerosadventure/crucero
  getCruceros() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un crucero por su id
  //localhost:81/crucerosadventure/crucero/{id}
  getCrucerobyId(cruceroId) {
    return axios.get(BASE_URL + "/" + cruceroId);
  }

  //Crear crucero
  createCrucero(crucero) {
    return axios.post(BASE_URL, JSON.stringify(crucero));
  }

  // Actualizar crucero con Itinerario
  //localhost:81/crucerosadventure/crucero
  update(crucero) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(crucero), 
    });
  }
}

export default new CruceroService();