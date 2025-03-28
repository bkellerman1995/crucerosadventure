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
            $vSQL = "SELECT * FROM crucero_fecha ORDER BY idCruceroFecha asc;";
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

            $vSql = "SELECT * FROM crucero_fecha WHERE idCruceroFecha=$idCruceroFecha";

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

            $vSql = "SELECT fechaSalida FROM crucero_fecha WHERE idCruceroFecha=$idCruceroFecha";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = new DateTime ($vResultado[0]);
            
            }

            //Retornar la respuesta (id de crucero Fecha)
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }

    public function getFechasPreciosHabitaciones($id)
    {
        try {

            //Obtener las fechas y precios de las habitaciones
            $vSql = "SELECT * FROM crucero_fecha WHERE idCrucero=$id order by idCruceroFecha desc;";

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

    public function create($objeto)
    {
        try {
            //Consulta sql
            //Identificador autoincrementable
            $sql = "Insert into crucero_fecha (estado) Values ('$objeto->estado')";

            //Ejecutar la consulta
            //Obtener ultimo insert
            $idCruceroFecha=$this->enlace->executeSQL_DML_last($sql);

            //Retornar itinerario
            return $this->getCruceroFecha($idCruceroFecha);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function updateCruceroFecha($cruceroFecha)
    {
        try {
            //Consulta sql
            $sql = "Update crucero_fecha SET idCrucero =$cruceroFecha->cruceroID, 
            fechaSalida = '$cruceroFecha->fechaInicioFormateada', 
            fechaLimitePagos = '$cruceroFecha->fechaLimitePagosFormateada', 
            estado = $cruceroFecha->estado
            Where idCruceroFecha = $cruceroFecha->idCruceroFecha;";

            //Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);

            //Retornar crucero
            return $this->getCruceroFecha($cruceroFecha->idCruceroFecha);

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
