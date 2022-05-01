CREATE DATABASE  IF NOT EXISTS `dbnewnsa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbnewnsa`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: dbnewnsa
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cnpj` varchar(255) DEFAULT NULL,
  `courses` json NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `street` varchar(255) NOT NULL,
  `number` int NOT NULL,
  `district` varchar(255) NOT NULL,
  `complement` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
INSERT INTO `institution` VALUES (8,'ETEC Prof Eudécio Luiz Vicente3',NULL,'[{\"name\": \"Ensino médio integrado ao Técnico de desenvolvimento de sistemas\", \"period\": \"matutino\", \"lessons\": {\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}, \"classTheme\": [[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]}]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','2022-04-26 14:42:25'),(9,'ETEC Prof Eudécio Luiz Vicente4',NULL,'[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','0000-00-00 00:00:00'),(11,'ETEC Prof Eudécio Luiz Vicente5',NULL,'[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','0000-00-00 00:00:00'),(22,'ETEC Prof Eudécio Luiz Vicente','62.823.257/0055-93','[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Lucelia','0000-00-00 00:00:00','2022-04-19 15:05:33'),(24,'ETEC Carlos Eduardo zzz','79.504.227/0001-24','[{\"name\": \"Ensino médio integrado ao Técnico de desenvolvimento de sistemas\", \"period\": \"matutino\", \"lessons\": {\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\", \"7\": \"\", \"8\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\", \"7\": \"\", \"8\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\", \"7\": \"\", \"8\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\", \"7\": \"\", \"8\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\", \"7\": \"\", \"8\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\", \"7\": \"\", \"8\": \"\"}}, \"classTheme\": [[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]}]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','2022-04-26 14:54:08','2022-04-26 14:55:08');
/*!40000 ALTER TABLE `institution` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-01 16:39:57
