import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'habitaciondisponiblefecha';
console.log ('BASE_URL: ', BASE_URL);


class HabitacionDisponibleFecha {
  //Lista de disponibilidad de todas las habitaciones por fecha
  //por fecha
  //localhost:81/crucerosadventure/habitaciondisponiblefecha
  getDisponibilidadHabitacionPorFecha() {
    return axios.get(BASE_URL);
  }

  //Obtener la informacion de la disponibilidad de habitación por fecha
  //localhost:81/crucerosadventure/habitaciondisponiblefecha/{id}
  getDisponibilidadHabitacionPorFechaByID(habitaciondisponiblefechaID) {
    console.log("BASE_URL habitacionDisponible: ", BASE_URL + "/" + habitaciondisponiblefechaID);
    console.log("habitacionDisponible ID: ", habitaciondisponiblefechaID);
    return axios.get(BASE_URL + "/" + habitaciondisponiblefechaID);
  }

  //Agregar disponibilidad de una habitacion por fecha
  agregarDisponibilidadHabitacionFecha(disponibilidadhabitacionfecha) {
    return axios.post(BASE_URL, JSON.stringify(disponibilidadhabitacionfecha));
  }

}

export default new HabitacionDisponibleFecha()