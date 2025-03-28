<?php
class PrecioHabitacionFechaModel
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
            $vSQL = "SELECT * from precio_habitacion_fecha order by idPrecioHabitacion asc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($idPrecioHabitacion)
    {
        try {
            //Consulta sql
            //Identificador autoincrementable
            $vSql = "SELECT * FROM precio_habitacion_fecha WHERE idPrecioHabitacion=$idPrecioHabitacion";

            //Ejecutar la consulta
            //Obtener ultimo insert
            $idItinerario=$this->enlace->executeSQL_DML_last($vSql);

            //Retornar itinerario
            return $this->get($idPrecioHabitacion);

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

            $sql = "INSERT INTO precio_habitacion_fecha (idCruceroFecha, idHabitacion, precio) 
                        VALUES ('$objeto->idCruceroFecha', '$objeto->idHabitacion', '$objeto->precio')";
            //Ejecutar la consulta
            $idPrecioHabitacion = $this->enlace->executeSQL_DML_last($sql);

            //Retornar precio
            return $this->get($idPrecioHabitacion);

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
