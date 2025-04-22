import React from "react";
import {useState} from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { motion } from "framer-motion";
import {ListCruceros} from "../Layout/ListCruceros";

export function Home() {

  //Estado para manejar la búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  //Función para manejar la búsqueda
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  
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
          position: "absolute",
          width: "110%",
          marginLeft: -30,
          height: "175vh", // Hace que el video cubra toda la altura de la pantalla
          top: 0,
          left: 0,
          zIndex: -1, // Para poner el video en el fondo
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

      {/* animacion del titulo */}
      {/* <motion.div
        initial={{ opacity: 0 }} // Empieza con el texto invisible
        animate={{ opacity: 1 }} // Luego lo hace completamente visible
        transition={{ delay: 1.5, duration: 1.5 }} // Retraso de 1 segundo antes de la animación y dura 1 segundo
      > */}
      {/* Titulo  */}
      <Box
      // sx={{
      //   backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
      //   color: "white", // Color del texto blanco
      //   borderRadius: 2,
      //   padding: 1,
      //   marginTop: 15, // Separación con el título
      //   width: "40%",
      //   margin: "0 auto",
      //   textAlign: "center", // Alinear el texto al centro
      // }}
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
      {/* </motion.div> */}

      {/* animacion de introduccion al negocio */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 2 }} // Este tiene un retraso de 2 segundos para que aparezca después
      > */}
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
      {/* </motion.div> */}

      {/* animacion de subitulo de "Echa un vistazo ..." al negocio */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[40px] font-bold capitalize"
        transition={{ delay: 4, duration: 1.5 }} // Este tiene un retraso de 2 segundos para que aparezca después
      > */}
      <Typography
        component="h1"
        variant="subtitle4"
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
        <TextField
          label="Buscar Crucero por destino"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: "40%",
            maxWidth: "350px",
            backgroundColor: "white",
            // "& .MuiOutlinedInput-root": {
            //   backgroundColor: "white",
            // },
          }}
        />

        <TextField
          label="Buscar Crucero por puerto de salida"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: "40%",
            maxWidth: "350px",
            backgroundColor: "white",
            // "& .MuiOutlinedInput-root": {
            //   backgroundColor: "white",
            // },
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Buscar Crucero por puerto de salida"
            variant="outlined"
            fullWidth
            // value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: "40%",
              maxWidth: "350px",
              backgroundColor: "white",
              // "& .MuiOutlinedInput-root": {
              //   backgroundColor: "white",
              // },
            }}
          />
        </LocalizationProvider>
      </Box>

      {/* </motion.div> */}

      {/* animacion de los cards del crucero */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1.5, ease: "easeOut" }}
      >
        <ListCruceros />
      </motion.div>
    </Container>
  );
}
