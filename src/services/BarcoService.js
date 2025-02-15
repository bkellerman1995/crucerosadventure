import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'movie';
class BarcoService {
  //Definición para Llamar al API y obtener el listado de películas

  //Listas barcos
  //localhost:81/crucerosadventura/barco
  getBarcos() {
    return axios.get(BASE_URL);
  }

  // //Obtener pelicula
  // //localhost:81/apimovie/movie/1
  // getMovieById(MovieId){
  //   return axios.get(BASE_URL+'/'+MovieId);
  // }
  // //Obtener peliculas por tienda
  // //localhost:81/apimovie/movie/moviesByShopRental/1
  // getMovieByShopRental(ShopRentalId){
  //   return axios.get(BASE_URL+'/moviesByShopRental/'+ShopRentalId);
  // }
  // createMovie(Movie) {
  //   return axios.post(BASE_URL, JSON.stringify(Movie));
  // }
  
  // updateMovie(Movie) {
  //   return axios({
  //     method: 'put',
  //     url: BASE_URL,
  //     data: JSON.stringify(Movie)

  //   })
  // }
}
export default new BarcoService();
