CREATE DATABASE  IF NOT EXISTS `crucerosadventure` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `crucerosadventure`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: crucerosadventure
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `barco`
--

DROP TABLE IF EXISTS `barco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barco` (
  `idbarco` int(11) NOT NULL,
  `descripcion` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `capacidadHuesped` int(11) DEFAULT NULL,
  `idHabitacion` int(11) NOT NULL,
  PRIMARY KEY (`idbarco`,`idHabitacion`),
  KEY `fk_barco_habitacion_idx` (`idHabitacion`),
  CONSTRAINT `fk_barco_habitacion` FOREIGN KEY (`idHabitacion`) REFERENCES `habitacion` (`idHabitacion`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barco`
--

LOCK TABLES `barco` WRITE;
/*!40000 ALTER TABLE `barco` DISABLE KEYS */;
INSERT INTO `barco` (`idbarco`, `descripcion`, `capacidadHuesped`, `idHabitacion`) VALUES (1,'Prueba1',2000,1),(2,'Prueba2',2500,2);
/*!40000 ALTER TABLE `barco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriahabitacion`
--

DROP TABLE IF EXISTS `categoriahabitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriahabitacion` (
  `idcategoriaHabitacion` int(4) NOT NULL,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcategoriaHabitacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriahabitacion`
--

LOCK TABLES `categoriahabitacion` WRITE;
/*!40000 ALTER TABLE `categoriahabitacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoriahabitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complementocrucero`
--

DROP TABLE IF EXISTS `complementocrucero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complementocrucero` (
  `idComplemento` int(11) NOT NULL,
  `nombre` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `descripcion` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `precioAplicado` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`idComplemento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complementocrucero`
--

LOCK TABLES `complementocrucero` WRITE;
/*!40000 ALTER TABLE `complementocrucero` DISABLE KEYS */;
/*!40000 ALTER TABLE `complementocrucero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crucero`
--

DROP TABLE IF EXISTS `crucero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crucero` (
  `idCrucero` int(11) NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `cantDias` int(11) DEFAULT NULL,
  `idBarco` int(11) NOT NULL,
  `idItinerario` varchar(15) NOT NULL,
  `barco_idHabitacion` int(11) NOT NULL,
  `idComplemento` int(11) NOT NULL,
  PRIMARY KEY (`idCrucero`,`idItinerario`,`idBarco`,`barco_idHabitacion`,`idComplemento`),
  KEY `fk_crucero_itinerario1_idx` (`idItinerario`),
  KEY `fk_crucero_barco1_idx` (`idBarco`,`barco_idHabitacion`),
  KEY `fk_crucero_complementocrucero1_idx` (`idComplemento`),
  CONSTRAINT `fk_crucero_barco1` FOREIGN KEY (`idBarco`, `barco_idHabitacion`) REFERENCES `barco` (`idbarco`, `idHabitacion`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_crucero_complementocrucero1` FOREIGN KEY (`idComplemento`) REFERENCES `complementocrucero` (`idComplemento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_crucero_itinerario1` FOREIGN KEY (`idItinerario`) REFERENCES `itinerario` (`idItinerario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crucero`
--

LOCK TABLES `crucero` WRITE;
/*!40000 ALTER TABLE `crucero` DISABLE KEYS */;
/*!40000 ALTER TABLE `crucero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitacion`
--

DROP TABLE IF EXISTS `habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitacion` (
  `idHabitacion` int(11) NOT NULL,
  `Nombre` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Descripcion` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `minHuesped` int(11) DEFAULT NULL,
  `maxHuesped` int(11) DEFAULT NULL,
  `tamanno` int(11) DEFAULT NULL,
  `idcategoriaHabitacion` int(4) NOT NULL,
  `idHuesped` varchar(15) NOT NULL,
  PRIMARY KEY (`idHabitacion`,`idcategoriaHabitacion`,`idHuesped`),
  KEY `fk_habitacion_categoriaHabitacion1_idx` (`idcategoriaHabitacion`),
  KEY `fk_habitacion_huesped1_idx` (`idHuesped`),
  CONSTRAINT `fk_habitacion_categoriaHabitacion1` FOREIGN KEY (`idcategoriaHabitacion`) REFERENCES `categoriahabitacion` (`idcategoriaHabitacion`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_habitacion_huesped1` FOREIGN KEY (`idHuesped`) REFERENCES `huesped` (`idhuesped`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitacion`
--

LOCK TABLES `habitacion` WRITE;
/*!40000 ALTER TABLE `habitacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `habitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `huesped`
--

DROP TABLE IF EXISTS `huesped`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `huesped` (
  `idhuesped` varchar(15) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idhuesped`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `huesped`
--

LOCK TABLES `huesped` WRITE;
/*!40000 ALTER TABLE `huesped` DISABLE KEYS */;
/*!40000 ALTER TABLE `huesped` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itinerario`
--

DROP TABLE IF EXISTS `itinerario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itinerario` (
  `idItinerario` varchar(15) NOT NULL,
  `horarioLlegada` datetime DEFAULT NULL,
  `horarioSalida` datetime DEFAULT NULL,
  `idPuerto` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`idItinerario`,`idPuerto`),
  KEY `fk_itinerario_puerto1_idx` (`idPuerto`),
  CONSTRAINT `fk_itinerario_puerto1` FOREIGN KEY (`idPuerto`) REFERENCES `puerto` (`idPuerto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itinerario`
--

LOCK TABLES `itinerario` WRITE;
/*!40000 ALTER TABLE `itinerario` DISABLE KEYS */;
/*!40000 ALTER TABLE `itinerario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puerto`
--

DROP TABLE IF EXISTS `puerto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puerto` (
  `idPuerto` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Nombre` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Pais` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`idPuerto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puerto`
--

LOCK TABLES `puerto` WRITE;
/*!40000 ALTER TABLE `puerto` DISABLE KEYS */;
/*!40000 ALTER TABLE `puerto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `idReserva` varchar(10) NOT NULL,
  `idUsuario` varchar(5) NOT NULL,
  `fechaInicio` datetime DEFAULT NULL,
  `cantHabitaciones` int(4) DEFAULT NULL,
  `cantidadHuespedes` int(4) DEFAULT NULL,
  `totalPagarHabitaciones` decimal(10,0) DEFAULT NULL,
  `subTotal` decimal(10,0) DEFAULT NULL,
  `impuestos` double DEFAULT NULL,
  `tarifa` double DEFAULT NULL,
  `precioTotal` decimal(10,0) DEFAULT NULL,
  `estado` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idReserva`,`idUsuario`),
  KEY `fk_Reserva_usuario1_idx` (`idUsuario`),
  CONSTRAINT `fk_Reserva_usuario1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` varchar(5) NOT NULL,
  `Cedula` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Nombre` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Telefono` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Correo` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `Pais` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Contrasenna` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Tipo` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-15 16:51:47
