<?php
class PuertoModel
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

            $paisModel = new PaisModel();
            //Consulta SQL
            $vSQL = "SELECT * from puerto order by idPuerto desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    
                    //Obtener el nombre del pais
                    if (!empty($row->idPais)) {
                        $pais = $paisModel -> get($row->idPais);
                        $row->pais = $pais;
                    }
                }
            }

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            
            //Obtener el pais de cada puerto
            $paisModel = new PaisModel();
            $vSql = "SELECT * FROM puerto
                    where idPuerto='$id';";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            //Extrar el objeto pais relacionado a este puerto
            $pais = $paisModel->get($vResultado->idPais);
            $vResultado->pais = $pais;

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

}
