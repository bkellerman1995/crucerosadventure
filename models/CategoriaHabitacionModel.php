<?php
class CategoriaHabitacionModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar Categorias de habitaciones
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT * FROM categoriahabitacion order by idcategoriaHabitacion desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener una categoria de habitacion
     * @param $id de la categoria habitacion
     * @return $vresultado - Objeto categoriahabitacion
     */
    //
    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM categoriahabitacion
                    where idcategoriaHabitacion=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if(!empty($vResultado)){
                $vResultado=$vResultado[0];
            }

            
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
 
}
