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

            //Obtener el crucero
            $cruceroModel = new CruceroModel();

            //Obtener el itinerario
            $itinerarioModel = new ItinerarioModel();

            //Obtener informacion de habitacion por fecha
            $cruceroFechaModel = new CruceroFechaModel();

            $vSql = "SELECT * FROM reserva WHERE idReserva='$id';";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            //Extraer el nombre del crucero de la reserva
            $crucero = $cruceroModel->get($vResultado->idCrucero);
            $vResultado->nombreCrucero = $crucero->nombre;

            //Extraer la información de los puertos
            // del itinerario
            $puertos = $itinerarioModel->getPuertosItinerario($crucero->idItinerario);
            $vResultado->itinerarioPuertos = $puertos;

            //Extraer la fecha de inicio del crucero
            //y cambiarle el formato a d-m-Y
            $fechaInicio = new DateTime($vResultado->fechaInicio);
            $fechaInicio->format('d-m-Y');

            //Calcular la fecha final del crucero (fechaInicio + cantDias)
            //cambiar el formato de la fecaFinal a d-m-Y
            $dias = $crucero->cantDias;
            $fechaFinal = $fechaInicio->modify("+$dias days");
            $fechaFinal->format('d-m-Y');
            $vResultado->fechaFinal = $fechaFinal;

            //Extraer el detalle de las habitaciones reservadas
            $habitaciones = $cruceroModel->get($vResultado->idCrucero)->habitaciones;
            $vResultado->habitaciones = $habitaciones;

            //variable totalHabitaciones para acumular el total a pagar por habitaciones
            $totalHabitaciones = 0;
            //Calcular el total a pagar por todas las habitaciones de la reserva
            foreach ($vResultado->habitaciones as &$habitacion) { // Referencia para modificar el objeto
                $vSql = "SELECT precioHabitacion from crucero_fecha WHERE idCrucero='$vResultado->idCrucero' and fechaSalida = '$vResultado->fechaInicio' order by idCruceroFecha desc;";
                $resultado = $this->enlace->executeSQL($vSql);

                // Verificar que la consulta devolvió resultados válidos
                $precioPagar = (!empty($resultado) && isset($resultado[0]->precioHabitacion)) ? $resultado[0]->precioHabitacion : 0;

                // Asignar el valor correctamente
                $habitacion->precio = $precioPagar;

                //Sumar al total de pagar para las habitaciones
                $totalHabitaciones += $precioPagar;
            }
            //Asignar el total a pagar por las habitaciones
            $vResultado->totalHabitaciones = $totalHabitaciones;

            //Extraer la información de los complementos del crucero
            $complementos = $cruceroModel->getComplementosPorCrucero($vResultado->idCrucero);
            $vResultado->complementos = $complementos;
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }

}
