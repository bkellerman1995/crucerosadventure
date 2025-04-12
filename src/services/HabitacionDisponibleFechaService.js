import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'habitaciondisponiblefecha';
console.log ('BASE_URL: ', BASE_URL);


class HabitacionDisponibleFecha {
  //Lista de disponibilidad de todas las habitaciones por fecha
  //localhost:81/crucerosadventure/habitaciondisponiblefecha
  getDisponibilidadHabitacionPorFecha() {
    return axios.get(BASE_URL);
  }

  getDisponibilidadHabitacionPorFechaByCrucero(idCrucero, fechaSeleccionada) {
    console.log("BASE_URL habitacionDisponible: ", BASE_URL);
    console.log("idCrucero: ", idCrucero, "fecha: ", fechaSeleccionada);

    return axios.get(BASE_URL, {
      params: {
        idCrucero: idCrucero,
        fechaSeleccionada: fechaSeleccionada,
      },
      validateStatus: (status) => {
        // Maneja los errores (4xx y 5xx) dentro del .then() en el componente React.
        // return status < 500 
        return status < 500;
      },
    });
  }

  //Obtener la informacion de la disponibilidad de habitación por fecha
  //localhost:81/crucerosadventure/habitaciondisponiblefecha/{id}
  getDisponibilidadHabitacionPorFechaByID(habitaciondisponiblefechaID) {
    console.log(
      "BASE_URL habitacionDisponible: ",
      BASE_URL + "/" + habitaciondisponiblefechaID
    );
    console.log("habitacionDisponible ID: ", habitaciondisponiblefechaID);
    return axios.get(BASE_URL + "/" + habitaciondisponiblefechaID);
  }

  //Agregar disponibilidad de una habitacion por fecha
  agregarDisponibilidadHabitacionFecha(disponibilidadhabitacionfecha) {
    return axios.post(BASE_URL, JSON.stringify(disponibilidadhabitacionfecha));
  }

  //Poner una habitación como no disponible una vez se reserva
  updateEstadoHabitacionFecha(Habitacion) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(Habitacion),
    });
  }
}

export default new HabitacionDisponibleFecha()