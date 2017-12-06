DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO competencia (nombre) VALUES ('¿Cuál es la mejor película?'), ('¿Qué drama te hizo llorar más?'), ('¿Cuál es la peli más bizarra?');