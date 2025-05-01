<?php

use Firebase\JWT\JWT;

class UsuarioModel
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

            // Consulta SQL
            $vSQL = "SELECT * FROM usuario ORDER BY idUsuario DESC;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            // Retornar los datos sin agregar campos extra
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }


    /**
     * Obtener un crucero
     * @param $id del crucero
     * @return $vresultado - Objeto crucero
     */
    //
    public function get($id)
    {
        try {

            // Consulta SQL
            $vSql = "SELECT * FROM usuario WHERE idUsuario=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }

    }
    public function login($objeto)
	{
		try {

			$vSql = "SELECT * from usuario where correcoEletronico='$objeto->email'";

			//Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL($vSql);
			if (is_object($vResultado[0])) {
				$user = $vResultado[0];
				if (password_verify($objeto->password, $user->password)) {
					$usuario = $this->get($user->id);
					if (!empty($usuario)) {
						// Datos para el token JWT
						$data = [
							'id' => $usuario->id,
							'email' => $usuario->email,
							'rol' => $usuario->rol,
							'iat' => time(),  // Hora de emisión
							'exp' => time() + 3600 // Expiración en 1 hora
						];

						// Generar el token JWT
						$jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');

						// Enviar el token como respuesta
						return $jwt_token;
					}
				}
			} else {
				return false;
			}
		} catch (Exception $e) {
			handleException($e);
		}
	}

    public function create($objeto)
	{
		try {
			if (isset($objeto->password) && $objeto->password != null) {
				$crypt = password_hash($objeto->password, PASSWORD_BCRYPT);
				$objeto->password = $crypt;
			}
			//Consulta sql            
			$vSql = "Insert into user (name,email,password,rol_id)" .
				" Values ('$objeto->name','$objeto->email','$objeto->password',$objeto->rol_id)";

			//Ejecutar la consulta
			$vResultado = $this->enlace->executeSQL_DML_last($vSql);
			// Retornar el objeto creado
			return $this->get($vResultado);
		} catch (Exception $e) {
			handleException($e);
		}
	}
}
