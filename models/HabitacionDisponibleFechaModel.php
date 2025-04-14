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

    // Actualizar disponibilidad de habitación en habitacion_disponible
    public function update($objeto)
    {
        try {
            // Consulta SQL para actualizar una habitacion

            $sql = "UPDATE habitacion_disponible 
            SET   disponible = 0
            WHERE idHabitacion = '$objeto->idHabitacion'";

            // Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);

            // Retornar habitacion actualizado
            return $this->get($objeto->idHabitacion);
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
                        h.minHuesped,
                        h.maxHuesped,
                        h.idCategoriaHabitacion,
                        ch.nombre as nombreCategoria,
                        phf.precio    
                    FROM habitacion h
                    JOIN habitacion_disponible hd ON h.idHabitacion = hd.idHabitacion
                    JOIN precio_habitacion_fecha phf ON h.idHabitacion = phf.idHabitacion
                    JOIN crucero_fecha cf ON phf.idCruceroFecha = cf.idCruceroFecha
                    JOIN categoriahabitacion ch ON h.idcategoriaHabitacion = ch.idcategoriaHabitacion
                    WHERE hd.idCruceroFecha = cf.idCruceroFecha
                        AND cf.idCrucero = $idCrucero
                        AND cf.fechaSalida = '$fecha'    
                        AND hd.disponible = 1
                    order by idHabitacion desc";

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
