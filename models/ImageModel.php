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
            $file = $object['file'];
            $barco_id = intval($object['barco_id']);
    
            // Verificar que existe archivo
            if (empty($file['name']) || $file['error'] !== UPLOAD_ERR_OK) {
                return json_encode([
                    "success" => false,
                    "error" => "Archivo no válido o no enviado"
                ]);
            }
    
            // Validaciones
            $fileName = basename($file['name']);
            $fileSize = $file['size'];
            $fileTmp = $file['tmp_name'];
            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];
    
            if (!in_array($fileExt, $allowed)) {
                return json_encode([
                    "success" => false,
                    "error" => "Extensión de archivo no permitida"
                ]);
            }
    
            if ($fileSize > 2 * 1024 * 1024) {
                return json_encode([
                    "success" => false,
                    "error" => "El archivo excede el tamaño máximo permitido (2MB)"
                ]);
            }
    
            // Generar nombre único para el archivo
            $uniqueFileName = 'barco-' . uniqid() . '.' . $fileExt;
            $uploadPath = $this->upload_path . $uniqueFileName;
    
            // Mover archivo a carpeta /uploads
            if (!move_uploaded_file($fileTmp, $uploadPath)) {
                return json_encode([
                    "success" => false,
                    "error" => "Error al mover el archivo al servidor"
                ]);
            }
    
            // Leer el contenido binario del archivo guardado
            $imageData = file_get_contents($uploadPath);
            $imageData = $this->enlace->escape_string($imageData); // Escapar binario
    
            // Guardar el contenido binario en la base de datos como BLOB
            $sql = "UPDATE barco SET foto = '$imageData' WHERE idbarco = $barco_id";
            $resultado = $this->enlace->executeSQL_DML($sql);
    
            if ($resultado > 0) {
                return json_encode([
                    "success" => true,
                    "message" => "Imagen subida y guardada en la base de datos (BLOB)",
                    "file" => $uniqueFileName
                ]);
            } else {
                return json_encode([
                    "success" => false,
                    "error" => "Error al guardar la imagen en la base de datos"
                ]);
            }
        } catch (Exception $e) {
            return json_encode([
                "success" => false,
                "error" => "Excepción: " . $e->getMessage()
            ]);
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