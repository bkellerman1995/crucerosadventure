import axios from "axios";

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + "reservacomplemento";
console.log("BASE_URL: ", BASE_URL);

class ReservaComplementoService {
  //Definición para llamar al API y obtener el listado de los cruceros}

  //Lista de todos los complementos asignados a una reserva.
  //localhost:81/crucerosadventure/reservacomplemento
  getComplementosReserva() {
    return axios.get(BASE_URL, {});
  }

  //Agregar complemento en reserva
  agregarComplementoReserva(complemento) {
    return axios.post(BASE_URL, JSON.stringify(complemento));
  }

  //Quitar complemento de una reserva (SOLO PARA EFECTOS DEL FRONTEND y no tener datos basura en la base de datos)
  quitarComplementoReserva(reservaID) {
    console.log("BASE_URL DELETE complemento(s) de reserva: ", BASE_URL + "/" + reservaID);
    console.log("Eliminar complementos de reserva ID: ", reservaID);
    return axios.delete(BASE_URL + "/" + reservaID);
  }
}

export default new ReservaComplementoService();