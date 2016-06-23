-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema dpd
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dpd
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dpd` DEFAULT CHARACTER SET utf8 ;
USE `dpd` ;

-- -----------------------------------------------------
-- Table `dpd`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dpd`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dpd`.`screen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dpd`.`screen` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(85) NOT NULL,
  `description` VARCHAR(255) NULL,
  `location` VARCHAR(255) NULL,
  `slideshow_id` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dpd`.`slideshow`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dpd`.`slideshow` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dpd`.`content`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dpd`.`content` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `duration` INT NULL,
  `link` VARCHAR(255) NOT NULL,
  `type` ENUM('image', 'video', 'tweet') NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_content_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_content_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `dpd`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dpd`.`slideshow_has_content`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dpd`.`slideshow_has_content` (
  `slideshow_id` INT NOT NULL,
  `content_id` INT NOT NULL,
  `order` INT NULL,
  PRIMARY KEY (`slideshow_id`, `content_id`),
  INDEX `fk_slideshow_has_content_content1_idx` (`content_id` ASC),
  INDEX `fk_slideshow_has_content_slideshow1_idx` (`slideshow_id` ASC),
  CONSTRAINT `fk_slideshow_has_content_slideshow1`
    FOREIGN KEY (`slideshow_id`)
    REFERENCES `dpd`.`slideshow` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_slideshow_has_content_content1`
    FOREIGN KEY (`content_id`)
    REFERENCES `dpd`.`content` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
