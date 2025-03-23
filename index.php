<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
require_once "middleware/AuthMiddleware.php";


/***--- Agregar todos los modelos*/
require_once "models/BarcoModel.php";
require_once "models/HabitacionModel.php";
require_once "models/PuertoModel.php";
require_once "models/ItinerarioModel.php";
require_once "models/ItinerarioPuertoModel.php";
require_once "models/CruceroModel.php";
require_once "models/CategoriaHabitacionModel.php";
require_once "models/PaisModel.php";
require_once "models/ReservaModel.php";
require_once "models/CruceroFechaModel.php";
require_once "models/ImageModel.php";
require_once "models/ItinerarioModel.php";

/***--- Agregar todos los controladores*/
require_once "controllers/BarcoController.php";
require_once "controllers/HabitacionController.php";
require_once "controllers/PuertoController.php";
require_once "controllers/ItinerarioController.php";
require_once "controllers/CruceroController.php";
require_once "controllers/CategoriaHabitacionController.php";
require_once "controllers/ReservaController.php";
require_once "controllers/ImageController.php";
require_once "controllers/ItinerarioController.php";
require_once "controllers/ItinerarioPuertoController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();


