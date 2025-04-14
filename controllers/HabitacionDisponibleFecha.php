<?php
//localhost:81/crucerosadventure/barco
class habitacionDisponibleFecha
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();

            //Instancia modelo
            $habitacionDisponibleFecha = new HabitacionDisponibleFechaModel();

            //Método del modelo
            $result = $habitacionDisponibleFecha->all();

            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function obtenerHabitacionesDisponibles()
    {
        try {
            $response = new Response();

            //Obtener los parámetros de la solicitud GET
            $idCrucero = isset($_GET['idCrucero']) ? $_GET['idCrucero'] : null;
            $fechaSeleccionada = isset($_GET['fechaSeleccionada']) ? $_GET['fechaSeleccionada'] : null;
            //Instancia modelo
            $habitacionDisponibleFecha = new HabitacionDisponibleFechaModel();
            
            //Método del modelo
            //Si los parámetros idCrucero y fecha están presentes, pasarlos al método del modelo
            if ($idCrucero && $fechaSeleccionada) {
                $result = $habitacionDisponibleFecha->getDisponibilidadPorFecha($idCrucero, $fechaSeleccionada);

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
                $result = $habitacionDisponibleFecha->all();
            }

            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST para insertar todos los precios 
    //de las habitaciones por fecha
    public function create()
    {
        try {

            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            var_dump($inputJSON);


            // Verificar si $inputJSON es un arreglo, si no lo es, convertirlo
            if (!is_array($inputJSON)) {
                // Convertir el objeto stdClass en un arreglo de objetos
                $inputJSON = (array) $inputJSON;
            }
            //Instancia del modelo
            $habitacionDisponibleFecha = new HabitacionDisponibleFechaModel();

            // Recorrer cada objeto del arreglo y pasar los datos al modelo para insertarlos en la base de datos
            foreach ($inputJSON as $habitacionDisponible) {
                // Asegurarse de que cada objeto tenga los campos necesarios
                if (isset($habitacionDisponible->idHabitacion, $habitacionDisponible->idCruceroFecha, $habitacionDisponible->disponible)) {

                    // Llamada al modelo para insertar la disponibilidad de la habitación en X fecha
                    $result = $habitacionDisponibleFecha->create($habitacionDisponible);

                    if (!$result) {
                        throw new Exception("Hubo un error al insertar la disponibilidad de la habitación con idHabitacion: " . $habitacionDisponible['idHabitacion']);
                    }
                }
            }
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //POST para actualizar todas las habitaciones
    // seleccionadas como no disponibles
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $habitacionDisponibleFecha = new HabitacionDisponibleFechaModel();
            //Acción del modelo a ejecutar
            $result = $habitacionDisponibleFecha->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
}
