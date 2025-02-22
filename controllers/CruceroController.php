<?php
//localhost:81/crucerosadventure/barco
class crucero
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $cruceroModel = new CruceroModel();
            //Método del modelo
            $result = $cruceroModel->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
