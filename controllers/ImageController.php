<?php
//class Genre
class image{
    //POST Crear
    public function create()
    {
        try {

            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputFILE = $request->getBody();
            //Instancia del modelo
            $movie = new ImageModel();
            //Acción del modelo a ejecutar
            $result = $movie->uploadFile($inputFILE);
           
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}