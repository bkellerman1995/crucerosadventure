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
    
}
