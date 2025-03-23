<?php
//localhost:81/crucerosadventure/barco
class itinerarioPuerto
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $itinerarioPuertoModel = new ItinerarioPuertoModel();
            //Método del modelo
            $result = $itinerarioPuertoModel->all();
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
            $itinerario = new ItinerarioPuertoModel();
            //Acción del modelo a ejecutar
            $result = $itinerario->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    

    // DELETE eliminar (ESTO ES SOLO PARA EL FRONTEND Y ELIMINAR DATOS BASURA EN BD)
    public function delete($id)
    {
        try {
            $response = new Response();
            $itinerarioPuertoModel = new ItinerarioPuertoModel();

            $result = $itinerarioPuertoModel->delete($id);
            $response->toJSON($result);
        
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
