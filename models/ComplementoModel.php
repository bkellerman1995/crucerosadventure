<?php

// require_once 'CategoriaHabitacionModel.php';
class ComplementoModel
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
            
            //Consulta para obtener complementos
            $vSQL = "SELECT * FROM complemento where estado = 1 order by idComplemento desc;";
            
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener un complemento
     * @param $id del complemento
     * @return $vresultado - Objeto complemento
     */
    //
    public function get($id)
    {
        try {

            //Consulta para obtener complemento por ID
            // $vSql = "SELECT * FROM complemento where estado = 1 and idComplemento=$id";

            $vSql = "SELECT * FROM complemento where idComplemento=$id";

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
    public function create($objeto)
    {
        try {

            $sql = "Insert into complemento (nombre, descripcion, precio, precioAplicado, estado) 
        VALUES ('$objeto->nombre', '$objeto->descripcion', '$objeto->precio', '$objeto->precioAplicado','$objeto->estado')";

            // Ejecutar la consulta y obtener el ID del complemento insertado
            $idComplemento = $this->enlace->executeSQL_DML_last($sql);

            // Retornar el complemento creado
            return $this->get($idComplemento);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function update($objeto)
    {
        try {


            $sql = "UPDATE complemento 
                SET nombre = '$objeto->nombre',
                    descripcion = '$objeto->descripcion',
                    precio = '$objeto->precio',
                    precioAplicado = '$objeto->precioAplicado',
                    estado = '$objeto->estado'
                WHERE idComplemento = '$objeto->idComplemento'";

            // Consulta SQL para actualizar un complemento

            // Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);

            // Retornar complemento actualizado
            return $this->get($objeto->idComplemento);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function delete($idComplemento)
    {
        try {
            $vSQL = "DELETE FROM complemento WHERE idComplemento = $idComplemento;";
            $this->enlace->executeSQL_DML($vSQL);
            return ["success" => true, "message" => "Complemento eliminado correctamente"];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}