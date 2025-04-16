<?php

// require_once 'CategoriaHabitacionModel.php';
class ReservaComplementoModel
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
            
            //Consulta para obtener complementos agregados a las reservas
            $vSQL = "SELECT * FROM reserva_complemento order by idReserva,idComplemento asc;";
            
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener los complementos de una reserva
     * @param $id del complemento
     * @return $vresultado - Objeto complemento
     */
    //
    public function get($idReserva)
    {
        try {

            //Consulta para obtener complementos por reserva
            $vSql = "SELECT
                    rc.idComplemento,
                    c.nombre, 
                    c.precio,
                    rc.cantidad
                 FROM 
                    reserva_complemento rc
                 JOIN 
                    complemento c ON rc.idComplemento = c.idComplemento
                 WHERE 
                    rc.idReserva = $idReserva
                 order by rc.idComplemento desc";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto)
    {
        try {

            $sql = "INSERT INTO reserva_complemento (idReserva, idComplemento, cantidad) 
            VALUES ('$objeto->idReserva', '$objeto->idComplemento', '$objeto->cantidad');";

            $idReserva = $this->enlace->executeSQL_DML_last($sql);

            // Retornar el complemento agregado a la reserva
            return $this->get($idReserva);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function delete($idReserva)
    {
        try {
            $vSQL = "DELETE FROM reserva_complemento WHERE idReserva = $idReserva;";
            $this->enlace->executeSQL_DML($vSQL);
            return ["success" => true, "message" => "Complemento desligado de la reserva correctamente"];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}