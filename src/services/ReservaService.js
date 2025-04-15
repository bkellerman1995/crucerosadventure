import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'reserva';
console.log ('BASE_URL: ', BASE_URL);


class ReservaService {
    //Definición para llamar al API y obtener el listado de los cruceros}
    
    //Lista de todas las reservas.
    //localhost:81/crucerosadventure/reserva
    getReservas() {
        return axios.get(BASE_URL);
    }

    //Obtener la informacion de una habitacion por su id
    //localhost:81/crucerosadventure/reserva/{id}
    getReservaById(ReservaId){
        console.log('BASE_URL RESERVA: ', BASE_URL+ '/'+ ReservaId);
        console.log('ReservaId: ', ReservaId);
        return axios.get(BASE_URL + '/'+ ReservaId);
    }

    // crear Reserva
    createReserva (reserva) {
      return axios.post(BASE_URL, JSON.stringify(reserva));
    }

    // actualizar reserva
    updateReserva(reserva) {
        return axios({
          method: "put",
          url: BASE_URL,
          data: JSON.stringify(reserva),
        });
      }

}

export default new ReservaService()