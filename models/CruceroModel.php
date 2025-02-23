<?php
class CruceroModel
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

            //Obtener el nombre del barco
            $barcoModel = new BarcoModel();
            // Consulta SQL
            $vSQL = "SELECT * FROM crucero ORDER BY idCrucero DESC;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            // Si hay resultados, recorrerlos y convertir el BLOB
            // if (!empty($vResultado) && is_array($vResultado)) {
            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }

                    $barco = $barcoModel->get($row->idBarco);
                    $row->barco = $barco;
                }
            }

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

            //Obtener el nombre del barco
            $barcoModel = new BarcoModel();

            $vSql = "SELECT * FROM crucero
                    where idCrucero=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

}
