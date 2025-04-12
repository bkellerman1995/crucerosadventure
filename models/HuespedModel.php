<?php

// require_once 'CategoriaHabitacionModel.php';
class HuespedModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar habitaciones
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        try {
            

            //Consulta para obtener huespedes
            $vSQL = "SELECT * FROM huesped where estado = 1 order by idHuesped asc;";
            
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener una habitacion
     * @param $id de la habitacion
     * @return $vresultado - Objeto habitacion
     */
    //
    public function get($id)
    {
        try {

            //Consulta para obtener huesped por ID
            $vSql = "SELECT * FROM huesped where estado = 1 and idHuesped=$id";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto)
    {
        try {

            $sql = "INSERT INTO huesped (nombre, apellido1, apellido2, telefono, idHabitacion,estado) 
            VALUES ('$objeto->nombre', '$objeto->apellido1', '$objeto->apellido2', '$objeto->telefono', '$objeto->idHabitacion', 
            '$objeto->estado')";

            // Ejecutar la consulta y obtener el ID del huesped insertado
            $idHuesped = $this->enlace->executeSQL_DML_last($sql);

            // Retornar el huesped creado
            return $this->get($idHuesped);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($objeto)
    {
        try {
            // Consulta SQL para actualizar una habitacion

            $sql = "UPDATE huesped 
            SET nombre = '$objeto->nombre',
                apellido1 = '$objeto->apellido1',
                apellido2 = '$objeto->apellido2',
                telefono = '$objeto->telefono',
                idHabitacion = '$objeto->idHabitacion',
                estado = '$objeto->estado'
            WHERE idHuesped = '$objeto->idHuesped'";

            // Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);

            // Retornar habitacion actualizado
            return $this->get($objeto->idHuesped);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $vSQL = "DELETE FROM huesped WHERE idHuesped = $id;";
            $this->enlace->executeSQL_DML($vSQL);
            return ["success" => true, "message" => "Huesped eliminado correctamente"];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}