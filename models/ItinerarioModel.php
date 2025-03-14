<?php
class ItinerarioModel
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
            //Consulta SQL
            $vSQL = "SELECT * from itinerario order by idPuerto desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {

            $vSql = "SELECT * FROM itinerario
                    where idItinerario=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }


            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getPuertosItinerario($id)
    {
        try {

            //Obtener el nombre los detalles de cada puerto
            //en el itinerario
            $puertoModel = new PuertoModel();

            $vSql = "SELECT * FROM itinerario_puerto
                    where idItinerario=$id;";
            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            // Si hay resultados, recorrerlos y extrear la información de cada
            // puerto relacionado al itinerario
            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    $puerto = $puertoModel->get($row->idPuerto);
                    $row->puerto = $puerto;
                }
            }

            //Retornar la respuesta
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
