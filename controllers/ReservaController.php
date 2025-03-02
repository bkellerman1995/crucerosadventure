<?php
//localhost:81/crucerosadventure/reserva
class reserva
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $reservaModel = new ReservaModel();
            //Método del modelo
            $result = $reservaModel->all();
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
            $reservaModel = new ReservaModel();
            //Acción del modelo a ejecutar
            $result = $reservaModel->get($id);
            //Dar respuesta
            $response->toJSON($result);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
