<?php
//localhost:81/crucerosadventure/categoriahabitacion
class categoriahabitacion
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $cathabitacionModel = new CategoriaHabitacionModel();
            //Método del modelo
            $result = $cathabitacionModel->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener 
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $cathabitacion = new CategoriaHabitacionModel();
            //Acción del modelo a ejecutar
            $result = $cathabitacion->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
