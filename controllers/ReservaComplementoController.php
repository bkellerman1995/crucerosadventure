<?php
//localhost:81/crucerosadventure/habitacion
class reservaComplemento
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $reservaComplementoModel = new ReservaComplementoModel();
            //Método del modelo
            $result = $reservaComplementoModel->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener 
    public function get($idReserva)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $reservaComplementoModel = new ReservaComplementoModel();
            //Acción del modelo a ejecutar
            $result = $reservaComplementoModel->get($idReserva);
            //Dar respuesta
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $reservaComplementoModel = new ReservaComplementoModel();
            //Acción del modelo a ejecutar
            $result = $reservaComplementoModel->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    // DELETE eliminar (ESTO ES SOLO PARA EL FRONTEND Y ELIMINAR DATOS BASURA EN BD) 
    public function delete($idReserva)
    {
        try {
            $response = new Response();
            $reservaComplementoModel = new ReservaComplementoModel();

            $result = $reservaComplementoModel->delete($idReserva);
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
