<?php
//localhost:81/crucerosadventure/reserva
class usuario
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $usuarioModel = new UsuarioModel();
            //Método del modelo
            $result = $usuarioModel->all();
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
            $usuarioModel = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $usuarioModel->get($id);
            //Dar respuesta
            $response->toJSON($result);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
