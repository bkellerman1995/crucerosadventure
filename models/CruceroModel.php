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
            $vSQL = "SELECT * FROM crucero ORDER BY idCrucero DESC;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            // Si hay resultados, recorrerlos y convertir el BLOB
            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }

                    $barco = $barcoModel->get($row->idBarco);
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

            $vSql = "SELECT * FROM crucero WHERE idCrucero='$id';";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            // Convertir el BLOB en base64 si tiene contenido
            if (!empty($vResultado->foto)) {
                $vResultado->foto = "data:image/jpeg;base64," . base64_encode($vResultado->foto);
            }

            //Extrar el objeto barco relacionado a este crucero
            $barco = $barcoModel->get($vResultado->idBarco);
            $vResultado->barco = $barco;

            //Extrar el objeto itinerario relacionado a este crucero
            $itinerario = $itinerarioModel->get($vResultado->idItinerario);
            $vResultado->itinerario = $itinerario;

            //Extraer la información de los puertos del itinerario
            $puertos = $itinerarioModel->getPuertosItinerario($vResultado->idItinerario);
            $vResultado->puertos = $puertos;

            //Extraer las diferentes fechas en las que se oferta el crucero
            //junto con el precio de las habitaciones
            $fechasPreciosHabitaciones = $this->getFechasPreciosHabitaciones($id);
            $vResultado->fechasPreciosHabitaciones = $fechasPreciosHabitaciones;

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }

    public function getFechasPreciosHabitaciones($id)
    {
        try {
            //Obtener las fechas y precios de las habitaciones
            $vSql = "SELECT * FROM crucero_fecha WHERE idCrucero='$id';";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            // Si hay resultados, recorrerlos y extrear la información de cada
            // fecha relacionada al crucero
            if (!empty($vResultado) && is_array($vResultado)) {
                
            }

            //Retornar la respuesta
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
