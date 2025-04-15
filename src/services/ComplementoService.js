import axios from "axios";

//Esta declaracion lanza undefined
const BASE_URL = import.meta.env.VITE_BASE_URL + "complemento";
console.log("BASE_URL: ", BASE_URL);

class ComplementoService {
  //Definición para llamar al API y obtener el listado de los cruceros}

  //Lista de todos los complementos.
  //localhost:81/crucerosadventure/complemento
  getComplementos() {
    return axios.get(BASE_URL, {
      validateStatus: (status) => {
        // Maneja los errores (4xx y 5xx) dentro del .then() en el componente React.
        // return status < 500 
        return status < 500;
      }
    });
  }

  //Obtener la informacion de un complemento por su id
  //localhost:81/crucerosadventure/complemento/{id}
  getComplementobyId(complementoID) {
    console.log("Respuesta desde el API", BASE_URL + "/" + complementoID);
    return axios.get(BASE_URL + "/" + complementoID);
  }

  //Crear complemento
  createComplemento(complemento) {
    return axios.post(BASE_URL, JSON.stringify(complemento));
  }

  // Actualizar complemento
  //localhost:81/crucerosadventure/complemento
  update(complemento) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(complemento),
    });
  }

}

export default new ComplementoService();