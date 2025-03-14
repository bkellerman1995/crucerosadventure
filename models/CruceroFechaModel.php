<?php
class cruceroFechaModel
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
            $vSQL = "SELECT * FROM crucero_fecha ORDER BY idCruceroFecha DESC;";
                        //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

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
    public function getCruceroFecha ($idCruceroFecha)
    {
        try {

            $vSql = "SELECT * FROM crucero_fecha WHERE idCruceroFecha='$idCruceroFecha'";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            //Retornar la respuesta (id del Crucero)
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }

    public function getFechaDeCruceroFecha($idCruceroFecha)
    {
        try {

            $vSql = "SELECT fechaSalida FROM crucero_fecha WHERE idCruceroFecha='$idCruceroFecha'";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = new DateTime ($vResultado[0]);
            
            }

            //Retornar la respuesta (id del Crucero)
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }

    public function getFechasPreciosHabitaciones($id)
    {
        try {

            //Obtener las fechas y precios de las habitaciones
            $vSql = "SELECT * FROM crucero_fecha WHERE idCrucero='$id' order by idCruceroFecha desc;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            // Si hay resultados, recorrerlos y extrear la información de cada
            // fecha relacionada al crucero
            if (!empty($vResultado) && is_array($vResultado)) {

                //Retornar la respuesta
                return $vResultado;
            }

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
