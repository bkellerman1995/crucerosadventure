<?php
class UsuarioModel
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

            // Consulta SQL
            $vSQL = "SELECT * FROM usuario ORDER BY idUsuario DESC;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            // Retornar los datos sin agregar campos extra
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }


    /**
     * Obtener un crucero
     * @param $id del crucero
     * @return $vresultado - Objeto crucero
     */
    //
    public function get($id)
    {
        try {

            // Consulta SQL
            $vSql = "SELECT * FROM usuario WHERE idUsuario=$id;";

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

}
