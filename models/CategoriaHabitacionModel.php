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
                    where idcategoriaHabitacion='$id';";

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
 
    public function getCantidadHabitacionesxCategoria()
    {
        try {
            // Consulta para obtener todas las categorías y su conteo de habitaciones
            $vSql = "
                SELECT c.idCategoriaHabitacion,
                       c.nombre AS nombreCategoria,
                       COUNT(h.idHabitacion) AS cantidadHabitaciones
                FROM categoriahabitacion c
                LEFT JOIN habitacion h
                       ON c.idCategoriaHabitacion = h.idCategoriaHabitacion
                GROUP BY c.idCategoriaHabitacion, c.nombre
            ";
    
            // Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSql);
    
            // Retornar todos los registros obtenidos
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    

}
