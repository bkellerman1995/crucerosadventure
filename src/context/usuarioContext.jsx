import React, { createContext, useState, useEffect, useContext} from "react";
import UsuarioService from "../services/UsuarioService";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

//Crear el contexto
const UsuarioContext = createContext();

// Crear un proveedor para envolver los componentes que necesitan acceso al contexto
export default function UserProvider({ children }) {
  
  const [usuario, setUsuario] = useState(null);

  //useEffect para cargar el usuario por defecto desde la base
  // de datos. Para efectos del avance 5, solo se presenta el primer usuario
  useEffect(() => {
    UsuarioService.getUsuarios()
      .then((response) => {
        // OBTENER SOLO EL PRIMER USUARIO PARA EFECTOS DEL AVANCE 5
        const primerUsuario = response.data[0];
        setUsuario(primerUsuario);
        console.log("Usuario cargado:", primerUsuario);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios", error);
        toast.error("Hubo un error al obtener la información de usuario");
      });
  }, []);

  // Configurar el propTypes para el Provider
  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
 
  // Cargar el componente
  return (
    <UsuarioContext.Provider value = {{usuario}}>
        {children}
    </UsuarioContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUsuarioContext = () => useContext(UsuarioContext);


