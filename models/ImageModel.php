<?php
class ImageModel
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
            $file = $object['foto'];
            $barco_id = $object['barco_id'];
    
            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];
    
            if (!empty($fileName)) {
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $newFileName = "barco-" . uniqid() . "." . $fileActExt;
    
                if (in_array($fileActExt, $this->valid_extensions)) {
                    if (!file_exists($this->upload_path . $newFileName)) {
                        if ($fileSize < 2000000 && $fileError == 0) {
    
                            $relativePath = $this->upload_path . $newFileName;
                            $fullPath = realpath($relativePath); // ruta absoluta necesaria para file_get_contents
    
                            // 1. Mover archivo a /uploads
                            if (move_uploaded_file($tempPath, $relativePath)) {
    
                                // 2. Leer como binario (BLOB)
                                $imageData = file_get_contents($fullPath);
                                $imageData = addslashes($imageData); // escapar para SQL
    
                                // 3. Insertar el binario en la base de datos
                                $sql = "UPDATE barco SET foto = '$imageData' WHERE idbarco = $barco_id";
                                $resultado = $this->enlace->executeSQL_DML($sql);
    
                                if ($resultado > 0) {
                                    return ['success' => true, 'message' => 'Imagen guardada como BLOB desde carpeta'];
                                } else {
                                    return ['success' => false, 'message' => 'Error al guardar BLOB en base de datos'];
                                }
    
                            } else {
                                return ['success' => false, 'message' => 'Error al mover archivo a carpeta'];
                            }
    
                        } else {
                            return ['success' => false, 'message' => 'Archivo inválido o muy grande'];
                        }
                    } else {
                        return ['success' => false, 'message' => 'Archivo ya existe'];
                    }
                } else {
                    return ['success' => false, 'message' => 'Extensión no permitida'];
                }
            }
    
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Excepción: ' . $e->getMessage()];
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