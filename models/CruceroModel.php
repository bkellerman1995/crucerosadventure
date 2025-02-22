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

            //Crear un objeto de tipo ImagenModel para poder cargar las imagenes
            $imagenM = new ImagenModel();
            //Consulta SQL
            $vSQL = "SELECT * from crucero order by idCrucero desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Incluir imagenes
            if (!empty($vResultado) && is_array($vResultado)) {
                for ($i = 0; $i < count($vResultado); $i++) {
                    $vResultado[$i]->imagen = $imagenM->getImageMovie(($vResultado[$i]->id));
                }
            }

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

}
