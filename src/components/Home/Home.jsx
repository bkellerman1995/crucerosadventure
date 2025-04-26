import React from "react";
import {useState} from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Select from "react-select";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { motion } from "framer-motion";
import {ListCruceros} from "../Layout/ListCruceros";
import dayjs from "dayjs";

export function Home() {
  //Estado para

  //Arreglo de opciones para ordenar las búsquedas
  const ordenarBusquedaFecha = ["Más cercana", "Más lejana"];

  //Arreglo de opciones para ordenar los precios
  const ordenarBusquedaPrecio = ["Menor a mayor", "Mayor a menor"];

  // Manejar los cambios en los selects
  const handleSelectChange = (e) => {
    const { name, value } = e;
    setSearchQuery({
      ...searchQuery,
      [name]: value,
    });
  };

  //Estilos personalizados para el select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#ADD8E6" // Color cuando se hace hover
        : state.isSelected
          ? "white" // Color cuando está seleccionado (blanco)
          : "white", // Color normal
      color: state.isSelected ? "black" : "black", // Asegura que el texto sea visible
      cursor: "pointer", // Cambia el cursor al pasar el mouse
      transition: "background-color 0.2s ease-in-out", // Suaviza la transición de color
    }),

    control: (provided) => ({
      ...provided,
      width: "250px",
      borderColor: "gray",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#16537e", // Cambia el borde cuando pasas el mouse
      },
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Asegura que el menú esté visible sobre otros elementos
    }),
  };

  //Estado para manejar la búsqueda
  const [searchQuery, setSearchQuery] = useState({
    destino: "",
    puerto: "",
    fecha: null,
    ordenFecha: "",
    ordenPrecio: "",
  });

  //Función para manejar la búsqueda (destino y puerto de salida)
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({
      ...searchQuery,
      [name]: value,
    });
    console.log("Valor de búsqueda: ", searchQuery);
  };

  //Función para manejar la búsqueda (fecha de salida)
  const handleDateChange = (newValue) => {
    const fechaFormateada = dayjs(newValue).format("YYYY-MM-DD");
    setSearchQuery({
      ...searchQuery,
      fecha: fechaFormateada,
    });
    console.log("Valor de búsqueda (fecha): ", fechaFormateada);
  };

  const handleCleanBusqueda = () => {
    // Esta función se ejecuta cuando el usuario hace clic en el botón de búsqueda
    setSearchQuery({
      destino: "",
      puerto: "",
      fecha: null,
    });
    console.log(
      "Datos del search query luego de limpiar búsqueda: ",
      searchQuery
    );
  };

  return (
    <Container
      maxWidth="100%"
      style={{
        position: "relative",
        padding: 0,
        margin: 0,
        minHeight: "100vh",
        // overflow: "hidden",
      }}
    >
      {/* Video de fondo o en la parte superior */}
      <div
        style={{
          position: "fixed",
          width: "110%",
          marginLeft: -30,
          height: "100vh", // Hace que el video cubra toda la altura de la pantalla
          top: 0,
          left: 0,
          zIndex: -1, // Para poner el video en el fondo
          flexGrow: 1,
        }}
      >
        <video
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          loop
          muted
        >
          <source src="../uploads/videoCrucero3.mp4" type="video/mp4" />
          El navegador no soporta el formato de video.
        </video>
      </div>

      {/* Titulo  */}
      <Box

      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          gutterBottom
          style={{
            color: "white",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
          }} // Aquí se aplica la sombra al texto }}
        >
          CRuceros Adventure
        </Typography>
      </Box>
      <br></br>

      {/* Introducción al negocio */}

      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
          color: "white", // Color del texto blanco
          borderRadius: 2,
          // marginTop: "30%",
          // marginBottom: 4, // Separación con el título
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          style={{
            color: "white",
            textShadow: "8px 8px 8px rgba(0, 0, 0, 1)",
          }}
        >
          Bienvenido a <strong>CRuceros Adventure</strong>, la mejor opción para
          disfrutar de un viaje inolvidable por el mar. Ofrecemos una amplia
          gama de cruceros a destinos impresionantes. Ya sea que estés buscando
          unas vacaciones relajantes o una aventura llena de emoción, tenemos el
          paquete perfecto para ti. ¡Embárcate con nosotros y crea recuerdos que
          durarán toda la vida!
        </Typography>
      </Box>

      <Typography
        component="h1"
        variant="subtitle6"
        align="center"
        gutterBottom
        style={{
          color: "white",
          textShadow: "2px 2px 8px rgba(0, 0, 0, 1)",
        }}
      >
        Abajo encontrarás nuestros cruceros disponibles
      </Typography>

      {/* Búsquedas */}
      <Box
        sx={{
          padding: 1.5,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
          width: "100%",
          gap: "1rem",
        }}
      >
        {/* Buscar crucero por destino (nombre) */}
        <TextField
          name="destino"
          label="Buscar crucero por destino"
          variant="outlined"
          fullWidth
          value={searchQuery.destino}
          onChange={handleSearchChange}
          sx={{
            width: "40%",
            maxWidth: "350px",
            backgroundColor: "white",
          }}
        />

        {/* Buscar crucero por puerto de salida (nombre) */}
        <TextField
          name="puerto"
          label="Buscar crucero por puerto de salida"
          variant="outlined"
          fullWidth
          value={searchQuery.puerto}
          onChange={handleSearchChange}
          sx={{
            width: "40%",
            maxWidth: "350px",
            backgroundColor: "white",
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Buscar crucero por fecha de salida"
            variant="outlined"
            format="DD/MM/YYYY"
            fullWidth
            value={searchQuery.fecha ? dayjs(searchQuery.fecha) : null}
            onChange={handleDateChange}
            sx={{
              width: "40%",
              maxWidth: "350px",
              backgroundColor: "white",
            }}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          type="submit"
          style={{
            backgroundColor: "#16537e",
          }}
          onClick={handleCleanBusqueda}
        >
          Limpiar búsqueda
        </Button>
      </Box>

      {/* Ordenamiento de búsqueda */}
      <Box
        sx={{
          padding: 1.5,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "2rem",
          width: "80%",
          gap: "1rem",
          backgroundColor: "gray",
          marginLeft: "auto", // Centrado horizontal
          marginRight: "auto", // Centrado horizontal
        }}
      >
        <Typography
          component="subtitle"
          variant="outlined"
          align="center"
          gutterBottom
          style={{
            color: "white",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
          }} // Aquí se aplica la sombra al texto }}
        >
          Fecha:
        </Typography>

        {/* Ordenamiento de búsqueda (por fecha) */}
        <Select
          options={ordenarBusquedaFecha.map((item) => ({
            label: item,
            value: item,
          }))}
          onChange={handleSelectChange}
          value={searchQuery.ordenFecha}
          placeholder="Seleccione una opción"
          styles={customStyles}
        />

        <Typography
          component="subtitle"
          variant="outlined"
          align="center"
          gutterBottom
          style={{
            color: "white",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
          }} // Aquí se aplica la sombra al texto }}
        >
          Precio:
        </Typography>

        {/* Ordenamiento de búsqueda (por precio) */}
        <Select
          options={ordenarBusquedaPrecio.map((item) => ({
            label: item,
            value: item,
          }))}
          onChange={handleSelectChange}
          value={searchQuery.ordenPrecio}
          placeholder="Seleccione una opción"
          styles={customStyles}
        />
      </Box>
      <br></br>

      {/* animacion de los cards del crucero */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 1.5, ease: "easeOut" }}
      >
        <ListCruceros
          searchQuery={{
            ...searchQuery,
            ordenFecha: searchQuery.ordenFecha, // "ascendente" o "descendente"
            ordenPrecio: searchQuery.ordenPrecio, // "ascendente" o "descendente"
          }}
        />{" "}
      </motion.div>
    </Container>
  );
}
