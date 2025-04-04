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

            //Obtener el crucero por fecha especifica
            $cruceroFechaModel = new cruceroFechaModel();

            //Obtener el crucero
            $cruceroModel = new CruceroModel();

            //Obtener el itinerario
            $itinerarioPuestoModel = new ItinerarioPuertoModel();

            // Consulta SQL
            $vSQL = "SELECT * FROM reserva ORDER BY idReserva DESC;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            // Si hay resultados, recorrerlos y extraer los
            //valores

            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente

                    if (!empty($row->idCruceroFecha)) {

                        //Extraer el crucero basado en la fecha de la reserva ()
                        $cruceroFecha = $cruceroFechaModel->getCruceroFecha($row->idCruceroFecha);
                        $crucero = $cruceroModel -> get($cruceroFecha->idCrucero);
                        $row->crucero = $crucero->nombre;

                        //Extraer la fecha de inicio del crucero
                        //y cambiarle el formato a Y-m-d
                        $fechaInicio = new DateTime($cruceroFecha->fechaSalida);
                        $fechaInicioFormateada = $fechaInicio->modify("+1 day");
                        $fechaInicioFormateada = $fechaInicio->format('Y-m-d');
                        $row->fechaInicio = $fechaInicioFormateada;

                        //Extraer la información de los puertos
                        // del itinerario
                        $puertos = $itinerarioPuestoModel->getPuertosItinerario($crucero->idItinerario);
                        $row->puertos = $puertos;

                        
                        //Calcular la fecha final del crucero
                        //Cambiar el valor de la fecha inicial (viene como string)
                        //a datetime
                        $dias = $crucero->cantDias;
                        //clonar la fecha de inicio ya que el modify afecta las
                        //dos variables (fechaFinal y fechaInicio) por lo que ambas
                        //fechaInicio se modifica de igual manera.
                        $fechaFinal = (clone $fechaInicio)->modify("+$dias days");
                        $fechaFinalFormateada = $fechaFinal->format('Y-m-d');
                        $row->fechaFinal = $fechaFinalFormateada;

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


            //Obtener el crucero por fecha especifica
            $cruceroFechaModel = new cruceroFechaModel();
            
            //Obtener el crucero
            $cruceroModel = new CruceroModel();

            //Obtener el itinerario
            $itinerarioPuertoModel = new ItinerarioPuertoModel();

            //Obtener informacion de habitacion por fecha
            $cruceroFechaModel = new CruceroFechaModel();

            $vSql = "SELECT * FROM reserva WHERE idReserva='$id';";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            //Extraer el crucero basado en la fecha de la reserva ()
            $cruceroFecha = $cruceroFechaModel->getCruceroFecha($vResultado->idCruceroFecha);
            $crucero = $cruceroModel->get($cruceroFecha->idCrucero);
            $vResultado->nombreCrucero = $crucero->nombre;

            //Extraer la información de los puertos
            // del itinerario
            $puertos = $itinerarioPuertoModel->getPuertosItinerario($crucero->idItinerario);
            $vResultado->itinerarioPuertos = $puertos;

            //Extraer la fecha de inicio del crucero
            //y cambiarle el formato a Y-m-d
            $fechaInicio = new DateTime($cruceroFecha->fechaSalida);
            $fechaInicioFormateada = $fechaInicio -> modify ("+1 day");
            $fechaInicioFormateada = $fechaInicio->format('Y-m-d');
            $vResultado->fechaInicio = $fechaInicioFormateada;

            //Calcular la fecha final del crucero (fechaInicio + cantDias)
            //cambiar el formato de la fecaFinal a d-m-Y
            $dias = $crucero->cantDias;
            $fechaFinal = $fechaInicio->modify("+$dias days");
            $fechaFinal->format('d-m-Y');
            $vResultado->fechaFinal = $fechaFinal;

            //Extraer el detalle de las habitaciones reservadas
            $habitaciones = $cruceroModel->get($cruceroFecha->idCrucero)->habitaciones;
            $vResultado->habitaciones = $habitaciones;

            //variable totalHabitaciones para acumular el total a pagar por habitaciones
            $totalHabitaciones = 0;
            //Calcular el total a pagar por todas las habitaciones de la reserva
            foreach ($vResultado->habitaciones as &$habitacion) { // Referencia para modificar el objeto
                $vSql = "SELECT precioHabitacion from crucero_fecha WHERE idCrucero='$cruceroFecha->idCrucero' and fechaSalida = '$vResultado->fechaInicio' order by idCruceroFecha desc;";
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
            $complementos = $cruceroModel->getComplementosPorCrucero($cruceroFecha->idCrucero);
            $vResultado->complementos = $complementos;
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }

}
