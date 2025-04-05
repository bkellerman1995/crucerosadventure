import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'preciohabitacionfecha';
console.log ('BASE_URL: ', BASE_URL);


class PrecioHabitacionFechaService {
  //Lista de todos los precios de las habitacions
  //por fecha
  //localhost:81/crucerosadventure/preciohabitacionfecha
  getPrecioHabitacionFecha() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de un precio de habitación por fecha
  //localhost:81/crucerosadventure/preciohabitacionfecha/{id}
  getPrecioHabitacionFechaByID(preciohabitacionfechaID) {
    console.log("BASE_URL precioHabitación: ", BASE_URL + "/" + preciohabitacionfechaID);
    console.log("precioHabitación ID: ", preciohabitacionfechaID);
    return axios.get(BASE_URL + "/" + preciohabitacionfechaID);
  }

  //Agregar precio de una habitacion por fecha
  agregarPrecioHabitacionFecha(preciohabitacionfecha) {
    return axios.post(BASE_URL, JSON.stringify(preciohabitacionfecha));
  }

}

export default new PrecioHabitacionFechaService()