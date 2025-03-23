<?php
//class Genre
class image{
    //POST Crear
    public function create()
    {
        try {
            /* $file=null;
            if (isset($_FILES['file'])){
                $file = $_FILES['file'];
            } */
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            // Construir manualmente el array esperado por el modelo
            $inputFILE = [
                'foto' => $_FILES['file'],
                'barco_id' => $_POST['barco_id']
            ];

            //Instancia del modelo
            $barco = new ImageModel();
            //Acción del modelo a ejecutar
            $result = $barco->uploadFile($inputFILE);
           
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
