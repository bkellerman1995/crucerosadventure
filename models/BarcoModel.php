<?php
class BarcoModel
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
            $vSQL = "SELECT b.idbarco,b.nombre,b.descripcion, b.capacidadHuesped,COUNT(h.idHabitacion) AS cantHabitaciones,
            b.foto FROM barco b LEFT JOIN habitacion h ON b.idbarco = h.idbarco GROUP BY b.idbarco
            order by b.idbarco desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente

                    //Codificar la foto en formato base64
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }
                }
            }

            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener barco*/
    public function get($id)
    {
        try {

            //Consulta sql               
            $vSQL = "SELECT b.idbarco,b.nombre,b.descripcion, b.capacidadHuesped,COUNT(h.idHabitacion) AS cantHabitaciones,
                b.foto FROM barco b LEFT JOIN habitacion h ON b.idbarco = h.idbarco where b.idbarco = $id
                GROUP BY b.idbarco
                order by b.idbarco desc;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];

                //Codificar lfoto en formato base64
                if (!empty($vResultado->foto)) {
                    $vResultado->foto = "data:image/jpeg;base64," . base64_encode($vResultado->foto);
                }

                //Extrar la lista de habitaciones del barco
                $habitaciones = $this->getHabitacionesByIdBarco($vResultado->idbarco);
                $vResultado->habitaciones = $habitaciones;
                // Retornar el objeto
                return $vResultado;

            }

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener habitaciones ligadas al barco*/
    public function getHabitacionesByIdBarco($id)
    {
        try {
            //Consulta sql               
            $vSQL = "SELECT * from habitacion where idbarco = $id order by idHabitacion desc";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente

                    //Codificar lfoto en formato base64
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }
                }
            }
            //Retornar la respuesta

            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Crear Barco
     * @param $objeto Barco  a insertar
     * @return $this->get($idbarco) - Objeto Barco
     */
    //
    public function create($objeto)
    {
        try {

            $sql = "Insert into barco (nombre, descripcion, capacidadHuesped, foto, estado) 
        VALUES ('$objeto->nombre', '$objeto->descripcion', '$objeto->capacidadHuesped', LOAD_FILE('$objeto->fotoRuta'),'$objeto->estado')";
            //"VALUES ('$objeto->nombre', '$objeto->descripcion', $objeto->capacidadHuesped, '$objeto->estado',
            //$nombreSanitizado = str_replace("\\", "\\\\", $objeto->foto);
            // Consulta SQL para insertar un barco
            // $sql = "INSERT INTO barco (nombre, descripcion, capacidadHuesped, estado, foto) " .
            //  "VALUES ('$objeto->nombre', '$objeto->descripcion', $objeto->capacidadHuesped, '$objeto->estado',
            // LOAD_FILE('" . $nombreSanitizado ."')";

            // Ejecutar la consulta y obtener el ID del barco insertado
            $idBarco = $this->enlace->executeSQL_DML_last($sql);

            // Retornar el barco creado
            return $this->get($idBarco);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Actualizar Barco
     * @param $objeto pelicula a barco
     * @return $this->get($idBarco) - Objeto Barco
     */
    //
    public function update($objeto)
    {
        try {
            // Consulta SQL para actualizar un barco

            $sql = "UPDATE barco 
            SET nombre = '$objeto->nombre',
                descripcion = '$objeto->descripcion',
                capacidadHuesped = '$objeto->capacidadHuesped',
                foto = LOAD_FILE('$objeto->fotoRuta'),
                estado = '$objeto->estado'
            WHERE idbarco = '$objeto->idbarco'";
    


           // $sql = "UPDATE barco SET nombre='$objeto->nombre'," .
               // "descripcion='$objeto->descripcion', capacidadHuesped=$objeto->capacidadHuesped, " .
               // "foto='$objeto->foto', estado='$objeto->estado' " .
               // "WHERE idbarco=$objeto->idbarco";

            // Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);

            // Retornar barco actualizado
            return $this->get($objeto->idbarco);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

