<?php
class ReservaModel
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

            //Obtener el nombre del crucero
            $cruceroModel = new CruceroModel();

            //Obtener el itinerario
            $itinerarioModel = new ItinerarioModel();

            // Consulta SQL
            $vSQL = "SELECT * FROM reserva ORDER BY idReserva DESC;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            // Si hay resultados, recorrerlos y extrar los
            //valores de

            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente

                    if (!empty($row->idCrucero) && !empty($row->idCrucero)) {

                        //Extraer el nombre del crucero de la reserva
                        $crucero = $cruceroModel->get($row->idCrucero);
                        $row->crucero = $crucero->nombre;

                        //Extraer la información de los puertos
                        // del itinerario
                        $puertos = $itinerarioModel->getPuertosItinerario($crucero->idItinerario);
                        $row->puertos = $puertos;

                        //Extraer la fecha de inicio del crucero
                        $fechaInicio = new DateTime($row->fechaInicio);
                        $fechaInicio->format('d-m-Y');
                        //Calcular la fecha final del crucero
                        //Cambiar el valor de la fecha inicial (viene como string)
                        //a datetime
                        $dias = $crucero->cantDias;
                        $fechaFinal = $fechaInicio->modify("+$dias days");
                        $fechaFinal->format('d-m-Y');
                        $row->fechaFinal = $fechaFinal;

                    }
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

            //Obtener el nombre del crucero
            $cruceroModel = new CruceroModel();

            //Obtener el itinerario
            $itinerarioModel = new ItinerarioModel();

            $vSql = "SELECT * FROM reserva WHERE idReserva='$id';";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            //Extraer el nombre del crucero de la reserva
            $crucero = $cruceroModel->get($vResultado->idCrucero);
            $vResultado->crucero = $crucero->nombre;

            //Extraer la información de los puertos
            // del itinerario
            $puertos = $itinerarioModel->getPuertosItinerario($crucero->idItinerario);
            $vResultado->puertos = $puertos;

            //Extraer la fecha de inicio del crucero
            $fechaInicio = new DateTime($vResultado->fechaInicio);
            $fechaInicio->format('d-m-Y');
            //Calcular la fecha final del crucero
            //Cambiar el valor de la fecha inicial (viene como string)
            //a datetime
            $dias = $crucero->cantDias;
            $fechaFinal = $fechaInicio->modify("+$dias days");
            $fechaFinal->format('d-m-Y');
            $vResultado->fechaFinal = $fechaFinal;

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }

}
