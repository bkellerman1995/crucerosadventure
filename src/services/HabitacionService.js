import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'habitacion';
console.log ('BASE_URL: ', BASE_URL);


class HabitacionService {
    //Definición para llamar al API y obtener el listado de los cruceros}
    
    //Lista de todas las habitaciones.
    //localhost:81/crucerosadventure/habitacion
    getHabitaciones() {
        return axios.get(BASE_URL);
    }

    //Obtener la informacion de una habitacion por su id
    //localhost:81/crucerosadventure/crucero/{id}
    getHabitacionById(HabitacionesId){

        return axios.get(BASE_URL + HabitacionesId);
    }

    // createHabitacion(Habitacion) {
    //     return axios.post(BASE_URL, JSON.stringify(Habitacion));
    //   }
      
    //   updateHabitacion(Habitacion) {
    //     return axios({
    //       method: 'put',
    //       url: BASE_URL,
    //       data: JSON.stringify(Habitacion)
    
    //     })
    //   }
}

export default new HabitacionService()