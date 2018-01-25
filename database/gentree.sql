-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema gentree
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema gentree
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gentree` DEFAULT CHARACTER SET utf8 ;
USE `gentree` ;

-- -----------------------------------------------------
-- Table `gentree`.`person`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gentree`.`person` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `sex` INT NULL,
  `born` DATE NULL,
  `death` DATE NULL,
  `bornplace` VARCHAR(45) NULL,
  `job` VARCHAR(45) NULL,
  `prename` VARCHAR(20) NULL,
  `comment` VARCHAR(45) NULL,
  `father_id` INT NULL,
  `mother_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_person_person1_idx` (`father_id` ASC),
  INDEX `fk_person_person2_idx` (`mother_id` ASC),
  CONSTRAINT `fk_person_person1`
    FOREIGN KEY (`father_id`)
    REFERENCES `gentree`.`person` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_person_person2`
    FOREIGN KEY (`mother_id`)
    REFERENCES `gentree`.`person` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gentree`.`place`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gentree`.`place` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `country` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gentree`.`living`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gentree`.`living` (
  `place_id` INT NOT NULL,
  `person_id` INT NOT NULL,
  `begin` DATE NULL,
  `end` DATE NULL,
  `street` VARCHAR(45) NULL,
  INDEX `fk_place_has_person_person1_idx` (`person_id` ASC),
  INDEX `fk_place_has_person_place1_idx` (`place_id` ASC),
  CONSTRAINT `fk_place_has_person_place1`
    FOREIGN KEY (`place_id`)
    REFERENCES `gentree`.`place` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_place_has_person_person1`
    FOREIGN KEY (`person_id`)
    REFERENCES `gentree`.`person` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gentree`.`relationship`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gentree`.`relationship` (
  `wife_id` INT NOT NULL,
  `husband_id` INT NOT NULL,
  `marrige` DATE NULL,
  `divorce` DATE NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_person_has_person_person2_idx` (`husband_id` ASC),
  INDEX `fk_person_has_person_person1_idx` (`wife_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_person_has_person_person1`
    FOREIGN KEY (`wife_id`)
    REFERENCES `gentree`.`person` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_person_has_person_person2`
    FOREIGN KEY (`husband_id`)
    REFERENCES `gentree`.`person` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
