<?php
class ImageBarcoModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Subir imagen de un barco registrado
    public function uploadFile($object)
    {
        try {
            $file = $object['file'];
            $barco_id = $object['barco_id'];
            
            // Obtener la información del archivo
            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];

            if (!empty($fileName)) {
                // Crear un nombre único para el archivo
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $fileName = "barco-" . uniqid() . "." . $fileActExt;
                
                // Validar el tipo de archivo
                if (in_array($fileActExt, $this->valid_extensions)) {
                    // Validar que no sobrepase el tamaño
                    if ($fileSize < 2000000 && $fileError == 0) {
                        // Moverlo a la carpeta del servidor del API
                        if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                            // Insertar la imagen en la BD
                            $sql = "INSERT INTO barco (idbarco, foto) VALUES ($barco_id, '$fileName')";
                            $vResultado = $this->enlace->executeSQL_DML($sql);
                            if ($vResultado > 0) {
                                return 'Imagen guardada exitosamente';
                            }
                            return false;
                        }
                    }
                }
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    // Obtener la imagen de un barco
    public function getImageBarco($idBarco)
    {
        try {
            // Consulta SQL
            $vSql = "SELECT foto FROM barco WHERE idbarco = $idBarco";
            
            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!empty($vResultado)) {
                return $vResultado[0];
            }
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}