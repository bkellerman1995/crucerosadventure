<?php
class ItinerarioModel
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
            $vSQL = "SELECT * from itinerario order by idPuerto desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {

            $vSql = "SELECT * FROM itinerario
                    where idItinerario=$id;";

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

    /**
     * Crear itinerario
     * @param $objeto itinerario a insertar
     * @return $this->get($idItinerario) - Objeto itinerario
     */
    //
    public function create($objeto)
    {
        try {
            //Consulta sql
            //Identificador autoincrementable
            $sql = "Insert into itinerario (estado) Values ('$objeto->estado')";

            //Ejecutar la consulta
            //Obtener ultimo insert
            $idItinerario=$this->enlace->executeSQL_DML_last($sql);

            //Retornar itinerario
            return $this->get($idItinerario);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $vSQL = "DELETE FROM itinerario WHERE idItinerario = $id;";
            $this->enlace->executeSQL_DML($vSQL);
            return ["success" => true, "message" => "Itinerario eliminado correctamente"];
        } catch (Exception $e) {
            handleException($e);
        }
    }

}
