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
            $result = $cruceroFechaModel->getCruceroFecha($id);
            //Dar respuesta
            $response->toJSON($result);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Solicitud para obtener la fecha limite de pagos (tabla crucero_fecha) 
    public function obtenerFechaLimitePagos ()
    {
        try {
            $response = new Response();

            //Obtener los parámetros de la solicitud GET
            $idCrucero = isset($_GET['idCrucero']) ? $_GET['idCrucero'] : null;
            $fechaSeleccionada = isset($_GET['fechaSeleccionada']) ? $_GET['fechaSeleccionada'] : null;
            
            //Instancia modelo
            $cruceroFechaModel = new CruceroFechaModel();
            
            //Método del modelo
            //Si los parámetros idCrucero y fecha están presentes, pasarlos al método del modelo
            if ($idCrucero && $fechaSeleccionada) {
                $result = $cruceroFechaModel->getFechaLimitePagos($idCrucero, $fechaSeleccionada);

                // Si la respuesta es vacía, devolver un mensaje indicando que no hay habitaciones disponibles
                if (empty($result)) {
                    $response->toJSON(["message" => "No hay habitaciones disponibles para esta fecha."]);
                    http_response_code(404); // Código 404 para indicar que no se encontraron resultados
                    return;
                }
            }

            //Si los parámetros idCrucero y fecha no están presentes en el GET, simplemente ejecutar 
            //llamar al método all del modelo
            else {
                $result = $cruceroFechaModel->all();
            }

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
