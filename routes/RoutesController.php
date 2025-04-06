<?php
class RoutesController
{
    public function index()
    {
        // Habilitar CORS para todas las solicitudes
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        // Manejar solicitud OPTIONS (preflight)
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        //include "routes/routes.php";
        if (isset($_SERVER['REQUEST_URI']) && !empty($_SERVER['REQUEST_URI'])) {
            //Gestion de imagenes
            if (strpos($_SERVER['REQUEST_URI'], '/uploads/') === 0) {
                $filePath = __DIR__ . $_SERVER['REQUEST_URI'];
                
                // Verificar si el archivo existe
                if (file_exists($filePath)) {
                    header('Content-Type: ' . mime_content_type($filePath));
                    readfile($filePath);
                    exit;
                } else {
                    http_response_code(404);
                    echo 'Archivo no encontrado.';
                }
            }
            //FIN Gestion de imagenes

            // CÓDIGO ESPECÍFICO PARA HABITACIONDISPONIBLE FECHA
            // Obtener la URL completa
            $requestUri = $_SERVER['REQUEST_URI'];

            // Separar la ruta de los parámetros de la URL usando parse_url
            $parsedUrl = parse_url($requestUri);
            $path = $parsedUrl['path'];  // resultado '/crucerosadventure/habitaciondisponiblefecha'
            $query = isset($parsedUrl['query']) ? $parsedUrl['query'] : '';  // Los parámetros de la consulta

            // Convertir los parámetros de la consulta en un array
            parse_str($query, $queryParams);  // $queryParams es un array con 'idCrucero' y 'fechaSeleccionada'

            // Verificar la ruta y procesar los parámetros
            $routesArray = explode("/", $path);
            $routesArray = array_filter($routesArray);  // Limpiar el array de posibles valores vacíos

            // Verificar si la ruta es 'habitaciondisponiblefecha'
            if (count($routesArray) >= 2 && $routesArray[2] == 'habitaciondisponiblefecha') {

                //Verificar si el método es GET
                if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                    $controller = 'habitacionDisponibleFecha';  // Especificar el controlador
                    $action = 'obtenerHabitacionesDisponibles';  // Especificar la acción para obtener las habitaciones
                    $idCrucero = isset($queryParams['idCrucero']) ? $queryParams['idCrucero'] : null;
                    $fechaSeleccionada = isset($queryParams['fechaSeleccionada']) ? $queryParams['fechaSeleccionada'] : null;

                    // Si los parámetros están presentes, se ejecuta la acción
                    if ($idCrucero && $fechaSeleccionada) {
                        $response = new $controller();
                        $response->$action($idCrucero, $fechaSeleccionada);  // Pasar los parámetros al controlador
                    } else {
                        // Si faltan parámetros
                        $json = array(
                            'status' => 400,
                            'result' => 'Faltan parámetros (idCrucero, fechaSeleccionada)'
                        );
                        echo json_encode($json, http_response_code($json["status"]));
                    }
                    return;
                }

            }

            if (count($routesArray) < 2) {
                $json = array(
                    'status' => 404,
                    'result' => 'Controlador no especificado'
                );
                echo json_encode($json, http_response_code($json["status"]));
                return;
            }

            
            //CÓDIGO PARA EL RESTO DE LAS RUTAS DINÁMICAS

            if (isset($_SERVER['REQUEST_METHOD'])) {
                $controller = $routesArray[2] ?? null;
                $action = $routesArray[3] ?? null;
                $param1 = $routesArray[4] ?? null;
                $param2 = $routesArray[5] ?? null;
                if ($controller) {
                    try {
                        if (class_exists($controller)) {
                            $response = new $controller();
                            switch ($_SERVER['REQUEST_METHOD']) {
                                case 'GET':
                                    if ($param1 && $param2) {
                                        $response->$action($param1, $param2);
                                    } elseif ($param1 && !isset($action)) {
                                        $response->get($param1);
                                    } elseif ($param1 && isset($action)) {
                                        $response->$action($param1);
                                    } elseif (!isset($action)) {
                                        $response->index();
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } elseif (count($routesArray) == 3) {
                                            $response->get($action);
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        // Llamar a la acción index si no hay acción ni parámetro
                                        $response->index();
                                    }
                                    break;

                                case 'POST':
                                case 'OPTIONS':
                                    if ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->create();
                                    }
                                    break;

                                case 'PUT':
                                case 'PATCH':
                                    if ($param1) {
                                        $response->update($param1);
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->update();
                                    }
                                    break;

                                    case 'DELETE':
                                        // Ajustar la forma en que se obtiene el ID
                                        if (!$param1 && is_numeric($action)) {
                                            $param1 = $action; // Si la acción es un número, es el ID
                                            $action = null; // Limpiar acción para evitar errores
                                        }
                
                                        if ($param1) {
                                            if (method_exists($response, "delete")) {
                                                $response->delete($param1);
                                            } else {
                                                echo json_encode([
                                                    'status' => 404,
                                                    'result' => "Método 'delete' no encontrado en el controlador"
                                                ], http_response_code(404));
                                            }
                                        } else {
                                            echo json_encode([
                                                "status" => 400,
                                                "result" => "ID no proporcionado"
                                            ], http_response_code(400));
                                        }
                                        break;

                                default:
                                    $json = array(
                                        'status' => 405,
                                        'result' => 'Método HTTP no permitido'
                                    );
                                    echo json_encode($json, http_response_code($json["status"]));
                                    break;
                            }
                        } else {
                            $json = array(
                                'status' => 404,
                                'result' => 'Controlador no encontrado'
                            );
                            echo json_encode($json, http_response_code($json["status"]));
                        }
                    } catch (\Throwable $th) {
                        $json = array(
                            'status' => 404,
                            'result' => $th->getMessage()
                        );
                        echo json_encode($json, http_response_code($json["status"]));
                    }
                } else {
                    $json = array(
                        'status' => 404,
                        'result' => 'Controlador o acción no especificados'
                    );
                    echo json_encode($json, http_response_code($json["status"]));
                }
            }
        }
    }
}
