import axios from 'axios';

//Esta declaracion lanza undefined
//const BASE_URL = import.meta.env.VITE_BASE_URL + 'habitacion';
//console.log ('BASE_URL: ', BASE_URL);


class CruceroService {
    //Definición para llamar al API y obtener el listado de los cruceros}
    
    //Lista de todos los cruceros.
    //localhost:81/crucerosadventure/crucero
    getCruceros() {
        return axios.get('http://localhost:81/crucerosadventure/crucero');
    }

    getMovieById(cruceroId){
        return axios.get('http://localhost:81/crucerosadventure/crucero/' + cruceroId);
      }

}

export default new CruceroService()