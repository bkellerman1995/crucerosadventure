<?php
//localhost:81/crucerosadventure/habitacion
class huesped
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $huespedModel = new HuespedModel();
            //Método del modelo
            $result = $huespedModel->all();
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
            $huespedModel = new HuespedModel();
            //Acción del modelo a ejecutar
            $result = $huespedModel->get($id);
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
            $huespedModel = new HuespedModel();
            //Acción del modelo a ejecutar
            $result = $huespedModel->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $huespedModel = new HuespedModel();
            //Acción del modelo a ejecutar
            $result = $huespedModel->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
