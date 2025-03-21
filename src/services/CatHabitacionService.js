import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'categoriahabitacion';
console.log ('BASE_URL: ', BASE_URL);

class CatHabitacionService {
    //Definición para llamar al API y obtener el listado de las categorias de habitacion}
    
    //Lista de todas las categorias de habitacion.
    //localhost:81/crucerosadventure/categoriahabitacion
    getCatHabitaciones() {
        return axios.get(BASE_URL);
    }

    //Obtener la informacion de una categoria de habitacion por su id
    //localhost:81/crucerosadventure/categoriahabitacion/{id}
    getCatHabitacionById(CatHabitacionesId){
        console.log('BASE_URL CATEGORIA_HABITACIONES: ', BASE_URL+ '/'+ CatHabitacionesId);
        console.log('CatHabitacionesId: ', CatHabitacionesId);
        return axios.get(BASE_URL + '/'+ CatHabitacionesId);
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

export default new CatHabitacionService()