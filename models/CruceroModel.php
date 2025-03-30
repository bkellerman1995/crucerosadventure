<?php
class CruceroModel
{
    //Conectarse a la BD
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar barcos
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        try {

            //Obtener el nombre del barco
            $barcoModel = new BarcoModel();


            // Consulta SQL
            $vSQL = "SELECT * FROM crucero where estado = 1 ORDER BY idCrucero asc;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            // Si hay resultados, recorrerlos y convertir la foto en BLOB
            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }

                    $barco = $barcoModel->get($row->idbarco);
                    $row->barco = $barco;
                }
            }

            // Retornar los datos sin agregar campos extra
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }


    /**
     * Obtener un crucero
     * @param $id del crucero
     * @return $vresultado - Objeto crucero
     */
    //
    public function get($id)
    {
        try {

            //Obtener el barco
            $barcoModel = new BarcoModel();

            //Obtener el itinerario
            $itinerarioModel = new ItinerarioModel();

            //Variable para obtener los puertos del itinerari
            $itinerarioPuertosModel = new ItinerarioPuertoModel();

            $vSql = "SELECT * FROM crucero WHERE idCrucero=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];

                // Convertir el BLOB en base64 si tiene contenido
                if (!empty($vResultado->foto)) {
                    $vResultado->foto = "data:image/jpeg;base64," . base64_encode($vResultado->foto);
                }

                //Extrar el objeto barco relacionado a este crucero
                $barco = $barcoModel->get($vResultado->idbarco);
                $vResultado->barco = $barco;

                //Revisar los puertos asignados al itinerario (si existe)

                if ($vResultado->idItinerario != null) {
                    //Extrar el objeto itinerario relacionado a este crucero
                    $itinerario = $itinerarioModel->get($vResultado->idItinerario);
                    $vResultado->itinerario = $itinerario;

                    //Extraer la información de los puertos del itinerario
                    $puertosItinerario = $itinerarioPuertosModel->getPuertosItinerario($vResultado->idItinerario);
                    $vResultado->puertosItinerario = $puertosItinerario;
                }
                else {
                    $vResultado->itinerario = "";
                    $vResultado->puertos = "";
                }

                //Extraer las habitaciones que estan ligadas al crucero (barco)
                $habitacionModel = new HabitacionModel();
                $habitacionesCrucero = $habitacionModel->getHabitacionesCrucero($vResultado->idbarco);
                $vResultado->habitaciones = $habitacionesCrucero;

                //Extraer las diferentes fechas en las que se oferta el crucero
                //junto con el precio de las habitaciones
                foreach ($vResultado->habitaciones as &$habitacion) { // Referencia para modificar el objeto
                    $vSql = "SELECT COUNT(idHuesped) AS cantHuesped FROM huesped WHERE idHabitacion = $habitacion->idHabitacion;";
                    $resultado = $this->enlace->executeSQL($vSql);

                    // Verificar que la consulta devolvió resultados válidos
                    $cantHuespedes = (!empty($resultado) && isset($resultado[0]->cantHuesped)) ? $resultado[0]->cantHuesped : 0;

                    // Asignar el valor correctamente
                    $habitacion->cantHuespedes = $cantHuespedes;


                }

                // Obtener las fechas y precios de las habitaciones

                $fechasPreciosHabitaciones = $this->getFechasPreciosHabitaciones($vResultado->idCrucero, $vResultado->habitaciones);
                $vResultado->fechasPreciosHabitaciones = $fechasPreciosHabitaciones;

                //Recorrer la lista de habitaciones ($vResultado->habitaciones) para asignarle la
                //cantidad de huespedes que tiene cada habitacion. Por medio de un ciclo for 
                //se calcula la cantidad de huespedes por habitacion:
                //"SELECT COUNT(idHuesped) AS cantHuesped FROM huesped WHERE idHabitacion = $habitacion->idHabitacion;";
                //Y con esto se le asigna el valor que retorna cada iteración
                //de la consulta a la propiedad cantHuespedes de cada habitacion
                //En el JSON se veria asi:
                //    "habitaciones": [
                // {
                //     "idHabitacion": "1",
                //      --- VALORES TRUNCADOS ---
                //     "cantHuespedes": "6"
                // },
                // {
                //     "idHabitacion": "2",
                //      --- VALORES TRUNCADOS ---
                //     "cantHuespedes": "3"
                foreach ($vResultado->habitaciones as &$habitacion) { // Referencia para modificar el objeto
                    $vSql = "SELECT COUNT(idHuesped) AS cantHuesped FROM huesped WHERE idHabitacion = $habitacion->idHabitacion;";
                    $resultado = $this->enlace->executeSQL($vSql);

                    // Verificar que la consulta devolvió resultados válidos
                    $cantHuespedes = (!empty($resultado) && isset($resultado[0]->cantHuesped)) ? $resultado[0]->cantHuesped : 0;

                    // Asignar el valor correctamente
                    $habitacion->cantHuespedes = $cantHuespedes;


                }

                //Chequear si el crucero tiene fechaSalida asignada
                $vResultado->fechaAsignada = $this->chequearCruceroFechaByCrucero($id);


                //Retornar la respuesta
                return $vResultado;
            }
        } catch (Exception $e) {
            handleException($e);
        }

    }

    //Chequear si el crucero tiene fechaSalida asignada
    public function chequearCruceroFechaByCrucero($idCrucero)
    {
        try {

            $vSql = "SELECT * FROM crucero_fecha WHERE idCrucero = $idCrucero;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0]->fechaSalida;

                return $vResultado;
            }

        } catch (Exception $e) {
            handleException($e);
        }

    }
    public function getFechasPreciosHabitaciones($id, $habitaciones)
    {
        try {

            // Consulta SQL para obtener las fechas y los precios de las habitaciones
            $vSql = "SELECT cf.idCruceroFecha, cf.fechaSalida, phf.idHabitacion, phf.precio
                 FROM crucero_fecha cf
                 LEFT JOIN precio_habitacion_fecha phf ON cf.idCruceroFecha = phf.idCruceroFecha
                 WHERE cf.idCrucero = $id
                 ORDER BY cf.fechaSalida DESC";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            return $vResultado;

            //Recorrer la tabla de precio_habitacion con todas las coincidencias
            //de idCruceroFecha asignadas al crucero
            // if (!empty($vResultado) && is_array($vResultado)) {

            //     //Recorrer todas las habitaciones del crucero e ir mapeando los 
            //     //precios asignados según la fecha 
            //     //Extraer las habitaciones que estan ligadas al crucero (barco)
            //     foreach ($habitaciones as &$habitacion) {
            //         // Buscar el precio correspondiente para cada habitación en cada fecha
            //         foreach ($vResultado as $fechaPrecio) {
            //             if ($habitacion->idHabitacion == $fechaPrecio->idHabitacion) {
            //                 // Asignar el precio a la propiedad 'precios' de la habitación
            //                 $habitacion->precios[$fechaPrecio->idCruceroFecha] = $fechaPrecio->precio;
            //             }
            //         }

            //         //Retornar la respuesta
            //         return $vResultado;
            //     }
            // }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener complementos por crucero*/
    public function getComplementosPorCrucero($id)
    {
        try {
            //Consulta sql               
            $vSQL = "SELECT * FROM crucerosadventure.crucero_complemento where idCrucero = $id order by 
            idComplemento DESC;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            //Retornar el array de complementos.
            foreach ($vResultado as &$complemento) { // Usar referencia para modificar el array directamente
                $vSql = "SELECT * from complemento WHERE idComplemento='$complemento->idComplemento' order by idComplemento desc;";
                $resultado = $this->enlace->executeSQL($vSql);

                // Verificar que la consulta devolvió resultados válidos
                $complemento = (!empty($resultado) && isset($resultado[0])) ? $resultado[0] : null;

            }

            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

        /**
     * Crear itinerario
     * @param $objeto itinerario a insertar
     * @return $this->get($idItinerario) - Objeto itinerario
     */
    //
    public function create($objeto)
    {
        try {
            //Consulta sql
            //Identificador autoincrementable
            $sql = "Insert into crucero (nombre,foto, cantDias,idbarco,estado) 
            Values ('$objeto->nombre',LOAD_FILE('$objeto->fotoRuta'), 
            '$objeto->cantDias','$objeto->idbarco',1)";
            //Ejecutar la consulta
            //Obtener ultimo insert
            $idCrucero=$this->enlace->executeSQL_DML_last($sql);

            //Retornar crucero
            return $this->get($idCrucero);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function updateCrucero($crucero)
    {
        try {
            //Consulta sql
            $sql = "Update crucero SET idItinerario =$crucero->idItinerario
            Where idCrucero = $crucero->idCrucero;";

            //Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);

            //Retornar crucero
            return $this->get($crucero->idCrucero);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }
}