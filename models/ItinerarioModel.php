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
 
}
