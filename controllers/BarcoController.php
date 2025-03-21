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

    //GET Obtener 
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $barco = new BarcoModel();
            //Acción del modelo a ejecutar
            $result = $barco->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET habitaciones por barco
    public function getByBarco($idBarco)
    {
        try {
            $response = new Response();
            $habitacionModel = new HabitacionModel();
            $result = $habitacionModel->getHabitacionesCrucero($idBarco);
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
            $barco = new BarcoModel();
            //Acción del modelo a ejecutar
            $result = $barco->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //PUT actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $barco = new BarcoModel();
            //Acción del modelo a ejecutar
            $result = $barco->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
