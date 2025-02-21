<?php
class BarcoModel
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
            $vSQL = "SELECT b.descripcion, b.capacidadHuesped,COUNT(h.idHabitacion) AS canHabitaciones
            FROM barco b LEFT JOIN habitacion h ON b.idbarco = h.idbarco GROUP BY b.idbarco
            order by b.idbarco desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
 
}
