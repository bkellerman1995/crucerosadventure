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
            $vSQL = "SELECT b.idbarco,b.nombre,b.descripcion, b.capacidadHuesped,COUNT(h.idHabitacion) AS cantHabitaciones,
            b.foto FROM barco b LEFT JOIN habitacion h ON b.idbarco = h.idbarco GROUP BY b.idbarco
            order by b.idbarco desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    
                    //Codificar lfoto en formato base64
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }
                }
            }

            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

        /*Obtener barco*/
        public function get($id)
        {
            try {
                
                //Consulta sql               
                $vSQL = "SELECT b.idbarco,b.nombre,b.descripcion, b.capacidadHuesped,COUNT(h.idHabitacion) AS cantHabitaciones,
                b.foto FROM barco b LEFT JOIN habitacion h ON b.idbarco = h.idbarco where b.idbarco = $id
                GROUP BY b.idbarco
                order by b.idbarco desc;";

                // Ejecutar la consulta
                $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];

                //Codificar lfoto en formato base64
                if (!empty($vResultado->foto)) {
                    $vResultado->foto = "data:image/jpeg;base64," . base64_encode($vResultado->foto);
                }

                //Extrar la lista de habitaciones del barco
                $habitaciones = $this->getHabitacionesByIdBarco($vResultado->idbarco);
                $vResultado->habitaciones = $habitaciones;
                // Retornar el objeto
                return $vResultado;
                    
                }

            } catch (Exception $e) {
                handleException($e);
            }
        }

        /*Obtener habitaciones ligadas al barco*/
        public function getHabitacionesByIdBarco($id)
        {
            try {
                //Consulta sql               
                $vSQL = "SELECT * from habitacion where idbarco = $id order by idHabitacion desc";

                // Ejecutar la consulta
                $vResultado = $this->enlace->ExecuteSQL($vSQL);

                if (!empty($vResultado) && is_array($vResultado)) {
                    foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                        
                        //Codificar lfoto en formato base64
                        if (!empty($row->foto)) {
                            $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                        }
                    }
                }
            //Retornar la respuesta

            return $vResultado;

            } catch (Exception $e) {
                handleException($e);
            }
        }
 
}
