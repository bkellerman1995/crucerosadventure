<?php
//localhost:81/crucerosadventure/barco
class preciohabitacionfecha
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $precioHabitacionFecha = new PrecioHabitacionFechaModel();
            //Método del modelo
            $result = $precioHabitacionFecha->all();
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
            $precioHabitacionFechaModel = new PrecioHabitacionFechaModel();

            // Recorrer cada objeto del arreglo y pasar los datos al modelo para insertarlos en la base de datos
            foreach ($inputJSON as $precio) {
                // Asegurarse de que cada objeto tenga los campos necesarios
                if (isset($precio->idCruceroFecha, $precio->idHabitacion, $precio->precio)) {

                    // Llamada al modelo para insertar el precio de la habitación
                    $result = $precioHabitacionFechaModel->create($precio);

                    if (!$result) {
                        throw new Exception("Hubo un error al insertar el precio de la habitación con idHabitacion: " . $precio['idHabitacion']);
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
