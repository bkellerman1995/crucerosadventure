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
}
