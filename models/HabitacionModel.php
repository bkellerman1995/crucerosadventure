<?php

// require_once 'CategoriaHabitacionModel.php';
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

            //Obtener la categoriaHabitacion
            $catHabitacionModel = new CategoriaHabitacionModel();

            $vSql = "SELECT * FROM habitacion
                    where idHabitacion=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            //Extrar el objeto CategoriaHabitacion relacionado a esta habitacion
            $cathabitacion = $catHabitacionModel->get($vResultado->idcategoriaHabitacion);
            $vResultado->cathabitacion = $cathabitacion;

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getHabitacionesCrucero($id)
    {
        try {

            //Variable modelo para almacenar la lista de 
            //habitaciones del crucero
            $habitacionesM = new HabitacionModel();

            //Obtener el barco relacionado al crucero
            $barcoModel = new BarcoModel();
            $vSql = "SELECT * FROM habitacion
                    where idBarco='$id' order by idHabitacion desc;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado) && is_array($vResultado)) {

                //Retornar la respuesta
                return $vResultado;
            }


        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getHuespedesHabitacion($id)
    {
        try {

            $vSql = "SELECT * FROM huesped
                    where idHabitacion='$id' order by idhuesped desc;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado) && is_array($vResultado)) {

                //Retornar la respuesta
                return $vResultado;
            }
        } catch (Exception $e) {
            handleException($e);
        }

    }
}