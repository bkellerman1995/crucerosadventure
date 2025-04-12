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
            $vSQL = "SELECT * FROM complemento where estado = 1 order by idComplemento asc;";
            
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
            $vSql = "SELECT * FROM complemento where estado = 1 and idComplemento=$id";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;
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