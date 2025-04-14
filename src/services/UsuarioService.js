import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuario';

class UsuarioService {
  getUsuarios() {
    return axios.get(BASE_URL);
  }
  getUsuarioById(usuarioID) {
    return axios.get(BASE_URL + '/' + usuarioID);
  }

  loginUsuario (usuario) {
    return axios.post(BASE_URL + '/login/', JSON.stringify(usuario));
  }
}

export default new UsuarioService();