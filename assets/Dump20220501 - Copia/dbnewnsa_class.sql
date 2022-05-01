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
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idInstitution` int DEFAULT NULL,
  `period` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `schoolYear` int NOT NULL,
  `teachers` json NOT NULL,
  `students` json NOT NULL,
  `lessons` json NOT NULL,
  `block` varchar(10) NOT NULL,
  `classNumber` int NOT NULL,
  `classTheme` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Class_fk0` (`idInstitution`) USING BTREE,
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`idInstitution`) REFERENCES `institution` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (5,8,'Matutino','Ensino médio integrado ao Técnico de desenvolvimento de sistemas',3,'[]','[]','{\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}','E',4,'[[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]','2022-04-30 19:49:13','2022-04-30 19:49:13');
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
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
