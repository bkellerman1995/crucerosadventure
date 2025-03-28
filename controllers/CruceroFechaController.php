<?php
//localhost:81/crucerosadventure/cruceroFecha
class cruceroFecha
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $cruceroFechaModel = new CruceroFechaModel();
            //Método del modelo
            $result = $cruceroFechaModel->all();
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
            $cruceroFechaModel = new CruceroFechaModel();
            //Acción del modelo a ejecutar
            $result = $cruceroFechaModel->get($id);
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
            $cruceroFecha = new cruceroFechaModel();
            //Acción del modelo a ejecutar
            $result = $cruceroFecha->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Actualizar cruceroFecha
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $crucero = new cruceroFechaModel();
            //Acción del modelo a ejecutar
            $result = $crucero->updateCruceroFecha($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
