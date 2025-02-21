<?php
//localhost:81/crucerosadventure/barco
class puerto
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $puertoModel = new PuertoModel();
            //Método del modelo
            $result = $puertoModel->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
