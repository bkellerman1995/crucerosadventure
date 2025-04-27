<?php
//localhost:81/crucerosadventure/habitacion
class complemento
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $complementoModel = new ComplementoModel();
            //Método del modelo
            $result = $complementoModel->all();
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
            $complementoModel = new ComplementoModel();
            //Acción del modelo a ejecutar
            $result = $complementoModel->get($id);
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
            $complemento = new ComplementoModel();
            //Acción del modelo a ejecutar
            $result = $complemento->create($inputJSON);
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
            $complemento = new ComplementoModel();
            //Acción del modelo a ejecutar
            $result = $complemento->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // DELETE eliminar (ESTO ES SOLO PARA EL FRONTEND Y ELIMINAR DATOS BASURA EN BD) 
    public function delete($idHabitacion)
    {
        try {
            $response = new Response();
            $huespedModel = new HuespedModel();

            $result = $huespedModel->delete($idHabitacion);
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
