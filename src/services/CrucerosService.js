import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

class CruceroService {
    //Definición para llamar al API y obtener el listado de los cruceros}
    //localhost:81/crucerosadventure/crucero

    getCruceros() {
        return axios.get(BASE_URL);
    }
}

export default new CruceroService()