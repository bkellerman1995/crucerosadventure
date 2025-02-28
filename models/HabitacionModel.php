<?php
class HabitacionModel
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
            //Consulta SQL
            $vSQL = "SELECT * FROM habitacion order by idHabitacion desc;";
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
            $barcoM=new BarcoModel();
            $catHabitacionM=new CategoriaHabitacionModel();
            $vSql = "SELECT * FROM habitacion
                    where idHabitacion=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if(!empty($vResultado)){
                $vResultado=$vResultado[0];
                //Barco
                $vResultado->barco=$barcoM->get(($vResultado->id));
                //CategoriaHabitacion
                $catHabitacion=$catHabitacionM->get($vResultado->catHabitacion_id);
                $vResultado->catHabitacion=$catHabitacion;
            }

            
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
 
}
