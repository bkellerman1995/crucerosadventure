import axios from "axios";

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + "huesped";
console.log("BASE_URL: ", BASE_URL);

class HuespedService {
  //Definición para llamar al API y obtener el listado de los cruceros}

  //Lista de todos los huéspedes.
  //localhost:81/crucerosadventure/huesped
  getHuespedes() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un huesped por su id
  //localhost:81/crucerosadventure/huesped/{id}
  getHuespedById(huespedID) {
    console.log("BASE_URL HUESPED: ", BASE_URL + "/" + huespedID);
    console.log("HuespedID: ", huespedID);
    return axios.get(BASE_URL + "/" + huespedID);
  }

  createHuesped(huesped) {
    return axios.post(BASE_URL, JSON.stringify(huesped));
  }

  updateHuesped(huesped) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(huesped),
    });
  }

  //Borrar huesped (SOLO PARA EFECTOS DEL FRONTEND y no tener datos basura en la base de datos)
  deleteHuesped (huespedID) {
    console.log("BASE_URL DELETE HUESPED: ", BASE_URL + "/" + huespedID);
    console.log("huesped ID a eliminar: ", huespedID);
    return axios.delete(BASE_URL + "/" + huespedID);
  }
}

export default new HuespedService();
