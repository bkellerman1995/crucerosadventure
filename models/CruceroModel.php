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

                if ($vResultado->idItinerario != null) {
                    //Extrar el objeto itinerario relacionado a este crucero
                    $itinerario = $itinerarioModel->get($vResultado->idItinerario);
                    $vResultado->itinerario = $itinerario;  
                }
                else {
                    $vResultado->itinerario = "";
                }


                //Extraer la información de los puertos del itinerario
                // $puertos = $itinerarioModel->getPuertosItinerario($vResultado->idItinerario);
                // $vResultado->puertos = $puertos;

                //Extraer las diferentes fechas en las que se oferta el crucero
                //junto con el precio de las habitaciones
                $fechasPreciosHabitaciones = $this->getFechasPreciosHabitaciones($vResultado->idCrucero);
                $vResultado->fechasPreciosHabitaciones = $fechasPreciosHabitaciones;

                //Extraer las habitaciones que estan ligadas al crucero (barco)
                $habitacionModel = new HabitacionModel();
                $habitacionesCrucero = $habitacionModel->getHabitacionesCrucero($vResultado->idbarco);
                $vResultado->habitaciones = $habitacionesCrucero;

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

                //Retornar la respuesta
                return $vResultado;
            }
        } catch (Exception $e) {
            handleException($e);
        }

    }

    public function getFechasPreciosHabitaciones($id)
    {
        try {

            //Obtener las fechas y precios de las habitaciones
            $vSql = "SELECT * FROM crucero_fecha WHERE idCrucero=$id order by idCruceroFecha desc;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            // Si hay resultados, recorrerlos y extrear la información de cada
            // fecha relacionada al crucero
            if (!empty($vResultado) && is_array($vResultado)) {

                //Retornar la respuesta
                return $vResultado;
            }

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
            '$objeto->cantDias',  '$objeto->idbarco',1)";
            //Ejecutar la consulta
            //Obtener ultimo insert
            $idCrucero=$this->enlace->executeSQL_DML_last($sql);

            //Retornar crucero
            return $this->get($idCrucero);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}