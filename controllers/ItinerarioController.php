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

    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $tinerario = new ItinerarioModel();
            //Acción del modelo a ejecutar
            $result = $tinerario->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // DELETE eliminar
    public function delete($id)
    {
        try {
            $response = new Response();
            $itinerarioModel = new ItinerarioModel();

            $result = $itinerarioModel->delete($id);
            $response->toJSON($result);
        
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
