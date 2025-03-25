<?php
//localhost:81/crucerosadventure/crucero
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

    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $crucero = new CruceroModel();
            //Acción del modelo a ejecutar
            $result = $crucero->create($inputJSON);
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
            $cruceroModel = new CruceroModel();
            //Acción del modelo a ejecutar
            $result = $cruceroModel->get($id);
            //Dar respuesta
            $response->toJSON($result);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Actualizar el Crucero
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $crucero = new CruceroModel();
            //Acción del modelo a ejecutar
            $result = $crucero->updateCrucero($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

}
