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
            
            //Obtener la categoriaHabitacion
            $catHabitacionModel = new CategoriaHabitacionModel();

            //Procedimiento almacenado ObtenerHabitaciones
            $vSQL = "CALL ObtenerHabitaciones()";
            
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta

            // Si hay resultados, recorrer la lista 
            // de resultados y extraar la 
            // categoria de la habitación (Nombre)
            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    
                    //Codificar lfoto en formato base64
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }

                    // if (!empty($row->idcategoriaHabitacion)) {
                    //     $row->categoriaHabitacion = $catHabitacionModel->get($row->idcategoriaHabitacion)->nombre;
                    // }

                }
            }

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

            // $vSql = "SELECT * FROM habitacion where idHabitacion='$id'";
            
            $vSql = "CALL ObtenerHabitacionPorID($id)";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];

               // Convertir el BLOB en base64 si tiene contenido
                $vResultado->foto = "data:image/jpeg;base64," . base64_encode($vResultado->foto);

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

    //Obtener las habitaciones de un crucero 
    //por medio del id del barco
    public function getHabitacionesCrucero($id)
    {
        try {

            //Variable modelo para almacenar la lista de 
            //habitaciones del crucero
            $habitacionesM = new HabitacionModel();

            //Obtener el barco relacionado al crucero
            $barcoModel = new BarcoModel();
            $vSql = "SELECT * FROM habitacion
                    where idBarco='$id' order by idHabitacion asc;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado) && is_array($vResultado)) {
                foreach ($vResultado as &$row) { // Usar referencia para modificar el array directamente
                    
                    //Codificar lfoto en formato base64
                    if (!empty($row->foto)) {
                        $row->foto = "data:image/jpeg;base64," . base64_encode($row->foto);
                    }

                    // if (!empty($row->idcategoriaHabitacion)) {
                    //     $row->categoriaHabitacion = $catHabitacionModel->get($row->idcategoriaHabitacion)->nombre;
                    // }

                }
                //Retornar la respuesta
                return $vResultado;
            }


        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Obtener la cantidad de huespedes por habitacion 
    //por medio del id del barco
    public function getHuespedesHabitacion($id)
    {
        try {

            $vSql = "SELECT 
                        hab.idHabitacion,
                        hab.Nombre,          
                        COUNT(hues.idHuesped) AS cantHuesped
                    FROM 
                        habitacion hab 
                    LEFT JOIN   
                        huesped hues ON hab.idHabitacion = hues.idHabitacion
                    WHERE 
                        hab.idbarco = '$id'
                    GROUP BY 
                        hab.idHabitacion, hab.Nombre
                    ORDER BY 
                        hab.idHabitacion DESC;";

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

    public function create($objeto)
    {
        try {

            $sql = "Insert into habitacion (nombre, descripcion, minHuesped, maxHuesped, tamanno, idcategoriaHabitacion, idbarco, foto, estado) 
        VALUES ('$objeto->nombre', '$objeto->descripcion', '$objeto->minhuesped', '$objeto->maxhuesped', '$objeto->tamanno', '$objeto->idcategoriaHabitacion', 
        '$objeto->idbarco', LOAD_FILE('$objeto->fotoRuta'),'$objeto->estado')";

            // Ejecutar la consulta y obtener el ID de la habitacion insertada
            $idHabitacion = $this->enlace->executeSQL_DML_last($sql);

            // Retornar la habitacion creada
            return $this->get($idHabitacion);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($objeto)
    {
        try {
            // Consulta SQL para actualizar una habitacion

            $sql = "UPDATE habitacion 
            SET nombre = '$objeto->nombre',
                descripcion = '$objeto->descripcion',
                minHuesped = '$objeto->minHuesped',
                maxHuesped = '$objeto->maxHuesped',
                tamanno = '$objeto->tamanno',
                idcategoriaHabitacion = '$objeto->idcategoriaHabitacion',
                idbarco = '$objeto->idbarco',
                foto = LOAD_FILE('$objeto->fotoRuta'),
                estado = '$objeto->estado'
            WHERE idHabitacion = '$objeto->idHabitacion'";

            // Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);

            // Retornar habitacion actualizado
            return $this->get($objeto->idHabitacion);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}