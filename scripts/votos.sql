DROP TABLE IF EXISTS `voto`;

CREATE TABLE `voto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `competencia_id` INT NOT NULL,
  `pelicula_id` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_competencia_id` FOREIGN KEY (`competencia_id`)
  REFERENCES competencia(`id`),
  CONSTRAINT `fk_pelicula_id` FOREIGN KEY (`pelicula_id`)
  REFERENCES pelicula(`id`)
);