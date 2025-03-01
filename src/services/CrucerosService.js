import axios from 'axios';

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + 'crucero';
console.log ('BASE_URL: ', BASE_URL);


class CruceroService {
    //Definición para llamar al API y obtener el listado de los cruceros}
    
    //Lista de todos los cruceros.
    //localhost:81/crucerosadventure/crucero
    getCruceros() {
        return axios.get(BASE_URL);
    }

    //Obtener la informacion de un crucero por su id
    //localhost:81/crucerosadventure/crucero/{id}
    getCrucero(cruceroId){
        return axios.get(BASE_URL + cruceroId);

      }

}

export default new CruceroService()