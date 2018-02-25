DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO competencia (nombre) VALUES ('¿Cuál es la mejor película?'), ('¿Qué drama te hizo llorar más?'), ('¿Cuál es la peli más bizarra?');

ALTER TABLE competencia
	ADD COLUMN `genero_id` INT(11) UNSIGNED,
	ADD CONSTRAINT `genero_id_fk`
	FOREIGN KEY (`genero_id`)
	REFERENCES genero(`id`);

ALTER TABLE competencia
	ADD COLUMN `director_id` INT(11) UNSIGNED,
	ADD CONSTRAINT `director_id_fk`
	FOREIGN KEY (`director_id`)
	REFERENCES director(`id`);

ALTER TABLE competencia
	ADD COLUMN `actor_id` INT(11) UNSIGNED,
	ADD CONSTRAINT `actor_id_fk`
	FOREIGN KEY (`actor_id`)
	REFERENCES actor(`id`);