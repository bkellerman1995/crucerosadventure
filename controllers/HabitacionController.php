<?php
//localhost:81/crucerosadventure/habitacion
class habitacion
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $habitacionModel = new HabitacionModel();
            //Método del modelo
            $result = $habitacionModel->all();
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
            $habitacion = new HabitacionModel();
            //Acción del modelo a ejecutar
            $result = $habitacion->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
