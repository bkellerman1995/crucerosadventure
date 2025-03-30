<?php
class ItinerarioPuertoModel
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
            $vSQL = "SELECT * from itinerario_puerto order by idItinerario asc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($idItinerario, $dia, $idPuerto)
    {
        try {

            $vSql = "SELECT * FROM itinerario_puerto
                    where idItinerario=$idItinerario and dia=$dia and idPuerto=$idPuerto;";

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

    public function getPuertosItinerario($id)
    {
        try {

            //Obtener el nombre los detalles de cada puerto
            //en el itinerario
            $puertoModel = new PuertoModel();

            $vSql = "SELECT * FROM itinerario_puerto
                    where idItinerario=$id order by dia desc;";
            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            // Si hay resultados, recorrerlos y extrear la información de cada
            // puerto relacionado al itinerario
            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    $puerto = $puertoModel->get($row->idPuerto);
                    $row->puerto = $puerto;
                }


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
    public function create ($objeto)
    {
        try {

            $vResultado = $this->get($objeto->idItinerario, $objeto->dia, $objeto->idPuerto);

            if ($vResultado ==null){
                $sql = "Insert into itinerario_puerto (idItinerario, dia, idPuerto, descripcion, estado) 
                Values ('$objeto->idItinerario', '$objeto->dia','$objeto->idPuerto','$objeto->descripcion', '$objeto->estado')";
    
            } else {
                $sql = "UPDATE itinerario_puerto SET descripcion = '$objeto->descripcion'
                WHERE idItinerario = $objeto->idItinerario AND dia = $objeto->dia AND idPuerto = $objeto->idPuerto;";
            }

            //Ejecutar la consulta
            $vResultado=$this->enlace->executeSQL_DML($sql);

            //Retornar itinerario
            return $this->get($objeto->idItinerario, $objeto->dia, $objeto->idPuerto);

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
