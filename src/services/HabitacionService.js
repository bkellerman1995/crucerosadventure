import axios from 'axios';

//Esta declaracion lanza undefined
//const BASE_URL = import.meta.env.VITE_BASE_URL + 'habitacion';
//console.log ('BASE_URL: ', BASE_URL);


class HabitacionService {
    //Definición para llamar al API y obtener el listado de los cruceros}
    
    //Lista de todas las habitaciones.
    //localhost:81/crucerosadventure/habitacion
    getHabitaciones() {
        return axios.get('http://localhost:81/crucerosadventure/habitacion');
    }
}

export default new HabitacionService()