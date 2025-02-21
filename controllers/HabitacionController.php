<?php
//localhost:81/crucerosadventure/barco
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
}
