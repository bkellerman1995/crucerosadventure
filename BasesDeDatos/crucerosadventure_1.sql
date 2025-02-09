-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema crucerosadventure
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema crucerosadventure
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `crucerosadventure` DEFAULT CHARACTER SET utf8mb4 ;
USE `crucerosadventure` ;

-- -----------------------------------------------------
-- Table `crucerosadventure`.`categoriaHabitacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`categoriaHabitacion` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`categoriaHabitacion` (
  `idcategoriaHabitacion` INT(4) NOT NULL,
  `descripcion` NVARCHAR(45) NULL,
  PRIMARY KEY (`idcategoriaHabitacion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`huesped`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`huesped` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`huesped` (
  `idhuesped` NVARCHAR(15) NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`idhuesped`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`habitacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`habitacion` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`habitacion` (
  `idHabitacion` INT(11) NOT NULL,
  `Nombre` VARCHAR(15) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `Descripcion` VARCHAR(50) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `minHuesped` INT(11) NULL DEFAULT NULL,
  `maxHuesped` INT(11) NULL DEFAULT NULL,
  `tamanno` INT(11) NULL DEFAULT NULL,
  `idcategoriaHabitacion` INT(4) NOT NULL,
  `idHuesped` NVARCHAR(15) NOT NULL,
  PRIMARY KEY (`idHabitacion`, `idcategoriaHabitacion`, `idHuesped`),
  INDEX `fk_habitacion_categoriaHabitacion1_idx` (`idcategoriaHabitacion` ASC) VISIBLE,
  INDEX `fk_habitacion_huesped1_idx` (`idHuesped` ASC) VISIBLE,
  CONSTRAINT `fk_habitacion_categoriaHabitacion1`
    FOREIGN KEY (`idcategoriaHabitacion`)
    REFERENCES `crucerosadventure`.`categoriaHabitacion` (`idcategoriaHabitacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_habitacion_huesped1`
    FOREIGN KEY (`idHuesped`)
    REFERENCES `crucerosadventure`.`huesped` (`idhuesped`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`barco`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`barco` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`barco` (
  `idbarco` INT(11) NOT NULL,
  `descripcion` VARCHAR(20) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `capacidadHuesped` INT(11) NULL DEFAULT NULL,
  `idHabitacion` INT(11) NOT NULL,
  PRIMARY KEY (`idbarco`, `idHabitacion`),
  INDEX `fk_barco_habitacion_idx` (`idHabitacion` ASC) VISIBLE,
  CONSTRAINT `fk_barco_habitacion`
    FOREIGN KEY (`idHabitacion`)
    REFERENCES `crucerosadventure`.`habitacion` (`idHabitacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`complementocrucero`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`complementocrucero` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`complementocrucero` (
  `idComplemento` INT(11) NOT NULL,
  `nombre` VARCHAR(10) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `descripcion` VARCHAR(30) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `precio` INT(11) NULL DEFAULT NULL,
  `precioAplicado` DECIMAL(10,0) NULL DEFAULT NULL,
  PRIMARY KEY (`idComplemento`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`puerto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`puerto` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`puerto` (
  `idPuerto` VARCHAR(5) CHARACTER SET 'utf8' NOT NULL,
  `Nombre` VARCHAR(20) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `Pais` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  PRIMARY KEY (`idPuerto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`itinerario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`itinerario` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`itinerario` (
  `idItinerario` NVARCHAR(15) NOT NULL,
  `horarioLlegada` DATETIME NULL DEFAULT NULL,
  `horarioSalida` DATETIME NULL DEFAULT NULL,
  `idPuerto` VARCHAR(5) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`idItinerario`, `idPuerto`),
  INDEX `fk_itinerario_puerto1_idx` (`idPuerto` ASC) VISIBLE,
  CONSTRAINT `fk_itinerario_puerto1`
    FOREIGN KEY (`idPuerto`)
    REFERENCES `crucerosadventure`.`puerto` (`idPuerto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`crucero`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`crucero` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`crucero` (
  `idCrucero` INT(11) NOT NULL,
  `nombre` VARCHAR(30) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `foto` LONGBLOB NULL DEFAULT NULL,
  `cantDias` INT(11) NULL DEFAULT NULL,
  `idBarco` INT(11) NULL DEFAULT NULL,
  `idItinerario` NVARCHAR(15) NOT NULL,
  `idbarco` INT(11) NOT NULL,
  `barco_idHabitacion` INT(11) NOT NULL,
  `idComplemento` INT(11) NOT NULL,
  PRIMARY KEY (`idCrucero`, `idItinerario`, `idbarco`, `barco_idHabitacion`, `idComplemento`),
  INDEX `fk_crucero_itinerario1_idx` (`idItinerario` ASC) VISIBLE,
  INDEX `fk_crucero_barco1_idx` (`idbarco` ASC, `barco_idHabitacion` ASC) VISIBLE,
  INDEX `fk_crucero_complementocrucero1_idx` (`idComplemento` ASC) VISIBLE,
  CONSTRAINT `fk_crucero_itinerario1`
    FOREIGN KEY (`idItinerario`)
    REFERENCES `crucerosadventure`.`itinerario` (`idItinerario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_crucero_barco1`
    FOREIGN KEY (`idbarco` , `barco_idHabitacion`)
    REFERENCES `crucerosadventure`.`barco` (`idbarco` , `idHabitacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_crucero_complementocrucero1`
    FOREIGN KEY (`idComplemento`)
    REFERENCES `crucerosadventure`.`complementocrucero` (`idComplemento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`usuario` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`usuario` (
  `idUsuario` VARCHAR(5) NOT NULL,
  `Cedula` VARCHAR(15) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `Nombre` VARCHAR(10) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `Telefono` VARCHAR(10) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `Correo` VARCHAR(20) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `FechaNacimiento` DATE NULL DEFAULT NULL,
  `Pais` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `Contrasenna` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `Tipo` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`idUsuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `crucerosadventure`.`Reserva`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `crucerosadventure`.`Reserva` ;

CREATE TABLE IF NOT EXISTS `crucerosadventure`.`Reserva` (
  `idReserva` VARCHAR(10) NOT NULL,
  `idUsuario` VARCHAR(5) NOT NULL,
  `fechaInicio` DATETIME NULL,
  `cantHabitaciones` INT(4) NULL,
  `cantidadHuespedes` INT(4) NULL,
  `totalPagarHabitaciones` DECIMAL(10,0) NULL,
  `subTotal` DECIMAL(10,0) NULL,
  `impuestos` DOUBLE NULL,
  `tarifa` DOUBLE NULL,
  `precioTotal` DECIMAL(10,0) NULL,
  `estado` VARCHAR(10) NULL,
  PRIMARY KEY (`idReserva`, `idUsuario`),
  INDEX `fk_Reserva_usuario1_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_Reserva_usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `crucerosadventure`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
