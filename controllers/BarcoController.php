<?php
//localhost:81/crucerosadventure/barco
class barco
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $barcoM = new BarcoModel();
            //Método del modelo
            $result = $barcoM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    // //GET Obtener 
    // public function get($id)
    // {
    //     try {
    //         $response = new Response();
    //         //Instancia del modelo
    //         $movie = new MovieModel();
    //         //Acción del modelo a ejecutar
    //         $result = $movie->get($id);
    //         //Dar respuesta
    //         $response->toJSON($result);
    //     } catch (Exception $e) {
    //         handleException($e);
    //     }
    // }
    // //Obtener peliculas por tienda
    // public function moviesByShopRental($idShopRental)
    // {
    //     try {
    //         $response = new Response();
    //         //Instancia del modelo
    //         $movie = new MovieModel();
    //         //Acción del modelo a ejecutar
    //         $result = $movie->moviesByShopRental($idShopRental);
    //         //Dar respuesta
    //         $response->toJSON($result);
    //     } catch (Exception $e) {
    //         handleException($e);
    //     }
    // }
    // //Obtener cantidad de peliculas por genero
    
    // public function getCountByGenre($param)
    // {
    //     try {
    //         $response = new Response();
    //         //Instancia del modelo
    //         $movie = new MovieModel();
    //         //Acción del modelo a ejecutar
    //         $result = $movie->getCountByGenre($param);
    //         //Dar respuesta
    //         $response->toJSON($result);
    //     } catch (Exception $e) {
    //         handleException($e);
    //     }
    // }
    // //POST Crear
    // public function create()
    // {
    //     try {
            
    //     } catch (Exception $e) {
    //         handleException($e);
    //     }
    // }
    // //PUT actualizar
    // public function update()
    // {
    //     try {
           
    //     } catch (Exception $e) {
    //         handleException($e);
    //     }
    // }
}
