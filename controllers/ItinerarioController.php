<?php
//localhost:81/crucerosadventure/barco
class itinerario
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $itinerarioModel = new ItinerarioModel();
            //Método del modelo
            $result = $itinerarioModel->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
