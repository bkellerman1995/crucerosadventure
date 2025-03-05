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
            $vSQL = "SELECT b.idbarco,b.descripcion, b.capacidadHuesped,COUNT(h.idHabitacion) AS cantHabitaciones
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

        /*Obtener */
        public function get($id)
        {
            try {
                //Consulta sql               
                $vSQL = "SELECT b.idbarco,b.descripcion, b.capacidadHuesped,COUNT(h.idHabitacion) AS cantHabitaciones
                FROM barco b LEFT JOIN habitacion h ON b.idbarco = h.idbarco where b.idbarco = $id
                GROUP BY b.idbarco
                order by b.idbarco desc;";

                // Ejecutar la consulta
                $vResultado = $this->enlace->ExecuteSQL($vSQL);

                if (!empty($vResultado)) {
                    // Retornar el objeto
                    return $vResultado[0];
                    
                }
                return $vResultado;

            } catch (Exception $e) {
                handleException($e);
            }
        }
 
}
