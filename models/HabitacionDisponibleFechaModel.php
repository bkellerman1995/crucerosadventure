<?php
class HabitacionDisponibleFechaModel
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
            $vSQL = "SELECT * from habitacion_disponible order by idHabitacionDisponible asc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($idHabitacionDisponible)
    {
        try {
            //Consulta sql
            //Identificador autoincrementable
            $vSql = "SELECT * FROM habitacion_disponible WHERE idHabitacionDisponible=$idHabitacionDisponible";

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }    /**
         * Crear itinerario
         * @param $objeto itinerario a insertar
         * @return $this->get($idItinerario) - Objeto itinerario
         */
    //
    public function create($objeto)
    {
        try {

            $sql = "INSERT INTO habitacion_disponible (idHabitacion, idCruceroFecha, disponible) 
                        VALUES ('$objeto->idHabitacion', '$objeto->idCruceroFecha', '$objeto->disponible')";
            //Ejecutar la consulta
            $idHabitacionDisponible = $this->enlace->executeSQL_DML_last($sql);

            //Retornar disponibilidad habitacion
            return $this->get($idHabitacionDisponible);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Obtener las fechas disponibles por fecha del crucero
    public function getDisponibilidadPorFecha($idCrucero, $fecha)
    {
        try {
            //Consulta sql
            $vSql = "SELECT 
                        h.idHabitacion, 
                        h.nombre, 
                        h.descripcion,
                        phf.precio    
                    FROM habitacion h
                    JOIN habitacion_disponible hd ON h.idHabitacion = hd.idHabitacion
                    JOIN precio_habitacion_fecha phf ON h.idHabitacion = phf.idHabitacion
                    JOIN crucero_fecha cf ON phf.idCruceroFecha = cf.idCruceroFecha
                    WHERE hd.idCruceroFecha = cf.idCruceroFecha
                        AND cf.idCrucero = $idCrucero            -- Filtra por el ID del crucero
                        AND cf.fechaSalida = '$fecha'          -- Filtra por la fecha de salida
                        AND hd.disponible = 1;";

            //Ejecutar la consulta
            // $vResultado = $this->enlace->executeSQL($vSql, [$idCrucero, $fecha]);
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
