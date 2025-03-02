<?php
//localhost:81/crucerosadventure/Usuario
class Usuario
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $barcoM = new UsuarioModel();
            //Método del modelo
            $result = $barcoM->all();
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
            $barco = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $barco->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
