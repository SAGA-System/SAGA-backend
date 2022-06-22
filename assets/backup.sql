-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: dbnewnsa
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bulletin`
--

DROP TABLE IF EXISTS `bulletin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bulletin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTeacher` int NOT NULL,
  `grade1Bim` varchar(10) DEFAULT NULL,
  `grade2Bim` varchar(10) DEFAULT NULL,
  `grade3Bim` varchar(10) DEFAULT NULL,
  `grade4Bim` varchar(10) DEFAULT NULL,
  `gradeFinal` varchar(10) DEFAULT NULL,
  `totalClasses` int DEFAULT NULL,
  `classesGiven` int DEFAULT NULL,
  `absence` int DEFAULT NULL,
  `frequency` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `idStudentClasses` int NOT NULL,
  `evaluations1Bim` json DEFAULT NULL,
  `evaluations2Bim` json DEFAULT NULL,
  `evaluations3Bim` json DEFAULT NULL,
  `evaluations4Bim` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bulletin_ibfk_1` (`idStudentClasses`) USING BTREE,
  KEY `Bulletin_ibfk_2` (`idTeacher`) USING BTREE,
  CONSTRAINT `bulletin_ibfk_1` FOREIGN KEY (`idStudentClasses`) REFERENCES `studentclasses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bulletin_ibfk_2` FOREIGN KEY (`idTeacher`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulletin`
--

LOCK TABLES `bulletin` WRITE;
/*!40000 ALTER TABLE `bulletin` DISABLE KEYS */;
/*!40000 ALTER TABLE `bulletin` ENABLE KEYS */;
UNLOCK TABLES;

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
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`idInstitution`) REFERENCES `institution` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (5,8,'Matutino','Ensino médio integrado ao Técnico de desenvolvimento de sistemas',3,'[]','[]','{\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}','E',4,'[[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]','2022-04-30 19:49:13','2022-04-30 19:49:13'),(6,8,'Matutino','Ensino médio integrado ao Técnico de desenvolvimento de sistemas',3,'[]','[]','{\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}','E',1,'[[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]','2022-05-08 01:52:56','2022-05-08 01:52:56'),(8,24,'Matutino','Ensino médio integrado ao Técnico de desenvolvimento de sistemas',3,'[{\"id\": 50, \"gang\": \"A\", \"name\": \"professor pedro sgorlon\", \"classTheme\": \"Banco de dados III\"}]','[{\"ra\": \"51521541\", \"gang\": \"A\", \"name\": \"João Pedro Costa\", \"idUser\": 51}, {\"ra\": \"5152154175\", \"gang\": \"B\", \"name\": \"victor\", \"idUser\": 56}]','{\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}','E',4,'[{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"geografia\", \"totalClasses\": 100}, {\"name\": \"tcc\", \"totalClasses\": 100}]','2022-05-08 20:05:58','2022-05-21 21:59:40'),(9,24,'Matutino','Ensino médio integrado ao Técnico de desenvolvimento de sistemas',3,'[]','[{\"ra\": \"5959595\", \"gang\": \"A\", \"name\": \"allan\", \"idUser\": 66}, {\"ra\": \"51521541\", \"gang\": \"B\", \"name\": \"João Pedro Costa\", \"idUser\": 51}]','{\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}','E',3,'[{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"geografia\", \"totalClasses\": 100}, {\"name\": \"tcc\", \"totalClasses\": 100}]','2022-05-15 20:58:21','2022-05-21 21:59:27');
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idSchoolCall` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `method` varchar(255) NOT NULL,
  `instruments` varchar(255) NOT NULL,
  `grades` json NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idSchoolCall` (`idSchoolCall`),
  CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`idSchoolCall`) REFERENCES `schoolcalls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
INSERT INTO `evaluations` VALUES (1,22,'Teste avaliação 3','Avaliação escrita','AC, CO, RR','[{\"name\": \"victor\", \"grade\": \"MB\", \"idUser\": 56}, {\"name\": \"João Pedro Costa\", \"grade\": \"B\", \"idUser\": 51}]','2022-06-05 13:28:15','2022-06-05 17:53:24'),(3,22,'Teste avaliação 2','Avaliação escrita','AC, CO','[{\"name\": \"victor\", \"grade\": \"MB\", \"idUser\": 56}, {\"name\": \"João Pedro Costa\", \"grade\": \"B\", \"idUser\": 51}]','2022-06-05 17:06:23','2022-06-05 17:08:17');
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `file` blob NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Files_fk0` (`idUser`) USING BTREE,
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

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
  `bimDates` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
INSERT INTO `institution` VALUES (8,'ETEC Prof Eudécio Luiz Vicente3',NULL,'[{\"name\": \"Ensino médio integrado ao Técnico de desenvolvimento de sistemas\", \"period\": \"matutino\", \"lessons\": {\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}, \"classTheme\": [[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]}]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','2022-04-26 14:42:25','[]'),(9,'ETEC Prof Eudécio Luiz Vicente4',NULL,'[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','0000-00-00 00:00:00','null'),(11,'ETEC Prof Eudécio Luiz Vicente5',NULL,'[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','0000-00-00 00:00:00','null'),(22,'ETEC Prof Eudécio Luiz Vicente','62.823.257/0055-93','[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Lucelia','0000-00-00 00:00:00','2022-04-19 15:05:33','null'),(24,'ETEC Carlos Eduardo zzz','79.504.227/0001-24','[{\"name\": \"Ensino médio integrado ao Técnico de desenvolvimento de sistemas\", \"period\": \"matutino\", \"lessons\": {\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}, \"classTheme\": [[{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"artes\", \"totalClasses\": 100}, {\"name\": \"fisica\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"educação fisica\", \"totalClasses\": 100}, {\"name\": \"espanhol\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"geografia\", \"totalClasses\": 100}, {\"name\": \"tcc\", \"totalClasses\": 100}]]}]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','2022-04-26 14:54:08','2022-06-18 19:44:37','[{\"year\": 2022, \"firstBim\": {\"endDate\": \"2022-1-2\", \"startDate\": \"2022-1-1\"}, \"thirdBim\": {\"endDate\": \"2022-1-4\", \"startDate\": \"2022-1-3\"}, \"fourthBim\": {\"endDate\": \"2022-4-7\", \"startDate\": \"2022-2-4\"}, \"secondBim\": {\"endDate\": \"2022-1-3\", \"startDate\": \"2022-1-2\"}}, {\"year\": 2021, \"firstBim\": {\"endDate\": \"2022-1-2\", \"startDate\": \"2022-1-1\"}, \"thirdBim\": {\"endDate\": \"2022-1-4\", \"startDate\": \"2022-1-3\"}, \"fourthBim\": {\"endDate\": \"2022-1-5\", \"startDate\": \"2022-1-4\"}, \"secondBim\": {\"endDate\": \"2022-1-3\", \"startDate\": \"2022-1-2\"}}]');
/*!40000 ALTER TABLE `institution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'ADD_USERS','Adicionar novos usuários no sistema','2022-05-22 18:51:53','2022-05-22 18:51:53'),(2,'EDIT_USERS','Editar informações dos usuários','2022-05-22 18:52:19','2022-05-22 18:52:19'),(3,'EDIT_YOUR_USER','Editar informações do seu próprio usuário','2022-05-22 18:52:42','2022-05-22 18:52:42'),(4,'INACTIVATE_USERS','Inativar usuários do sistema','2022-05-22 18:53:06','2022-05-22 18:53:06'),(5,'DELETE_USERS','Deletar usuários do sistema','2022-05-22 18:53:30','2022-05-22 18:53:30'),(6,'LIST_USERS','Listar usuários do sistema','2022-05-22 18:54:23','2022-05-22 18:54:23'),(7,'LIST_STUDENTS','Listar todos os estudantes do sistema','2022-05-22 18:54:41','2022-05-22 18:54:41'),(8,'LIST_TEACHERS','Listar todos os professores do sistema','2022-05-22 18:55:02','2022-05-22 18:55:02'),(9,'EDIT_USER_PERMISSIONS','Editar permissões de um usuário','2022-05-22 18:55:37','2022-05-22 18:55:37'),(10,'CHANGE_CLASS_STUDENT','Mover o estudante de classe caso necessário','2022-05-22 18:56:26','2022-05-22 18:56:26'),(11,'ADD_PERMISSIONS','Adicionar permissões ao sistema','2022-05-22 18:56:53','2022-05-22 18:56:53'),(12,'CREATE_INSTITUTIONS','Criar instituições no sistema','2022-05-22 18:57:13','2022-05-22 18:57:13'),(13,'EDIT_INSTITUTIONS','Editar informações das instituições do sistema','2022-05-22 18:57:34','2022-05-22 18:57:34'),(14,'EDIT_YOUR_INSTITUTION','Editar informações da instituição a qual o usuário está vinculado','2022-05-22 18:58:05','2022-05-22 18:58:05'),(15,'INACTIVATE_INSTITUTIONS','Inativar instituições do sistema','2022-05-22 18:58:27','2022-05-22 18:58:27'),(16,'DELETE_INSTITUTION','Deletar instituições do sistema','2022-05-22 18:58:53','2022-05-22 18:58:53'),(17,'ADD_CLASSES','Adicionar classes escolares ao sistema','2022-05-22 18:59:36','2022-05-22 18:59:36'),(18,'EDIT_CLASSES','Editar informações das classes','2022-05-22 18:59:53','2022-05-22 18:59:53'),(19,'DELETE_CLASSES','Deletar classes da instituição','2022-05-22 19:00:17','2022-05-22 19:00:17');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schoolcalls`
--

DROP TABLE IF EXISTS `schoolcalls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schoolcalls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idClass` int NOT NULL,
  `classTheme` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  `absents` json NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `gang` varchar(255) NOT NULL,
  `bimester` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  KEY `idClass` (`idClass`),
  CONSTRAINT `schoolcalls_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `schoolcalls_ibfk_2` FOREIGN KEY (`idClass`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schoolcalls`
--

LOCK TABLES `schoolcalls` WRITE;
/*!40000 ALTER TABLE `schoolcalls` DISABLE KEYS */;
INSERT INTO `schoolcalls` VALUES (20,40,8,'lpl','2022-05-29 03:00:00','Aula de teste 2','[{\"absence\": 4, \"idStudent\": 18, \"justification\": \"\"}, {\"absence\": 1, \"idStudent\": 13, \"justification\": \"Atestado de covid\"}]','2022-05-29 19:07:49','2022-05-29 21:44:58','',0),(21,40,8,'lpl','2022-06-30 03:00:00','Aula de teste 2','[{\"absence\": 1, \"idStudent\": 13, \"justification\": \"Atestado de covid\"}]','2022-05-29 20:42:53','2022-05-29 21:44:58','',0),(22,40,8,'lpl','2022-07-01 03:00:00','Aula de teste 2','[{\"absence\": 4, \"idStudent\": 13, \"justification\": \"\"}]','2022-05-29 20:43:31','2022-06-05 18:39:02','',0),(33,40,8,'lpl','2022-06-05 03:00:00','Aula de teste 2','[{\"absence\": 2, \"idStudent\": 13, \"justification\": \"\"}]','2022-06-05 21:28:05','2022-06-05 21:28:11','A',0),(34,40,8,'lpl','2022-06-05 03:00:00','Aula de teste 2','[{\"absence\": 1, \"idStudent\": 18, \"justification\": \"\"}]','2022-06-05 21:30:23','2022-06-05 21:30:23','B',0),(35,40,8,'lpl','2022-06-05 03:00:00','Aula de teste 2','[{\"absence\": 2, \"idStudent\": 13, \"justification\": \"\"}, {\"absence\": 2, \"idStudent\": 18, \"justification\": \"\"}]','2022-06-05 21:33:10','2022-06-05 21:33:20','',0);
/*!40000 ALTER TABLE `schoolcalls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20220508184724-update-foreignKeys-for-delete-cascade.js'),('20220513133823-remove-foreign-key-in-students.js'),('20220515013502-add-new-column-to-users-table.js'),('20220519120858-new-pivot-table-studentClasses.js'),('20220521164121-move-frequencyColumn-to-studentClasses.js'),('20220529145145-new-table-schoolCalls.js'),('20220603101827-ajustment-in-evaluation-table.js'),('20220605180151-add-column-gang-in-schoolcall.js'),('20220618165532-edit-tables-to-integrate-bulletin.js'),('20220622114657-new-columns-in-bulletin.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentclasses`
--

DROP TABLE IF EXISTS `studentclasses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentclasses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idStudent` int NOT NULL,
  `idClass` int NOT NULL,
  `gang` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `frequency` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idStudent` (`idStudent`),
  KEY `idClass` (`idClass`),
  CONSTRAINT `studentclasses_ibfk_1` FOREIGN KEY (`idStudent`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentclasses_ibfk_2` FOREIGN KEY (`idClass`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentclasses`
--

LOCK TABLES `studentclasses` WRITE;
/*!40000 ALTER TABLE `studentclasses` DISABLE KEYS */;
INSERT INTO `studentclasses` VALUES (14,18,8,'B','2022-05-21 18:20:04','2022-06-05 21:33:20','[{\"name\": \"matemática\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 200}, {\"name\": \"lpl\", \"absence\": 53, \"classesGiven\": 246, \"totalClasses\": 200}, {\"name\": \"geografia\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 100}, {\"name\": \"tcc\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 100}]'),(15,13,8,'A','2022-05-21 18:20:36','2022-06-05 21:33:20','[{\"name\": \"matemática\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 200}, {\"name\": \"lpl\", \"absence\": 68, \"classesGiven\": 246, \"totalClasses\": 200}, {\"name\": \"geografia\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 100}, {\"name\": \"tcc\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 100}]'),(23,25,9,'A','2022-05-21 21:53:55','2022-05-21 21:55:33','[{\"name\": \"matemática\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 200}, {\"name\": \"lpl\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 200}, {\"name\": \"geografia\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 100}, {\"name\": \"tcc\", \"absence\": 0, \"classesGiven\": 0, \"totalClasses\": 100}]');
/*!40000 ALTER TABLE `studentclasses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `ra` varchar(255) NOT NULL,
  `schoolYear` int NOT NULL,
  `situation` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ra` (`ra`),
  KEY `Students_fk0` (`idUser`) USING BTREE,
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (13,51,'51521541',3,'cursando','2022-05-15 20:31:48','2022-05-15 20:49:32'),(18,56,'5152154175',3,'cursando','2022-05-21 15:38:53','2022-05-21 15:38:53'),(25,66,'5959595',3,'cursando','2022-05-21 21:53:55','2022-05-21 21:53:55');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `speciality` varchar(255) NOT NULL,
  `lessons` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Teachers_fk0` (`idUser`) USING BTREE,
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (3,50,'banco de dados','[]','2022-05-15 14:34:08','2022-05-15 14:34:08'),(6,59,'banco de dados, backend','[]','2022-05-21 18:54:40','2022-05-21 18:54:40');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userpermissions`
--

DROP TABLE IF EXISTS `userpermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpermissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idPermissions` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userPermissions_fk0` (`idUser`) USING BTREE,
  KEY `userPermissions_fk1` (`idPermissions`) USING BTREE,
  CONSTRAINT `userpermissions_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userpermissions_ibfk_2` FOREIGN KEY (`idPermissions`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpermissions`
--

LOCK TABLES `userpermissions` WRITE;
/*!40000 ALTER TABLE `userpermissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `userpermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idInstitution` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cpf` varchar(255) NOT NULL,
  `rg` varchar(255) NOT NULL,
  `allPermissions` json NOT NULL,
  `flowType` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `number` int NOT NULL,
  `district` varchar(255) NOT NULL,
  `complement` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `resetPassword` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `Users_fk0` (`idInstitution`) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idInstitution`) REFERENCES `institution` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (13,24,'Carlos Eduardo','$2b$10$A2HTibSsejJWi8IP7nv7Mu2F9Crx2uN6m6o6OObpqYp9CE1/JNsse','14274060063','600523123','[1]',4,'carloseduardozzz@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 01:59:34','2022-05-08 01:59:34',NULL),(14,24,'Carlos Eduardo','$2b$10$amkO663AUj6wE8H8zx1T.OeaPS8EdP3V3GSjjnvZpzYfjkXg30E4C','03578846040','600523123','[1]',4,'carloseduardozzzasda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 02:16:25','2022-05-08 02:16:25',NULL),(40,24,'Carlos Eduardo t','$2b$10$E40AD2ERNZHMAqY0hD6nCOpyfrDz0fK/s2IDFPS3OUlp0MQknZV0G','31544698008','600523123','[1]',1,'cadadrlosgfgfdfda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 20:19:39','2022-05-08 20:19:39',NULL),(42,24,'Carlos Eduardo t','$2b$10$C6W0x5PB1NPFrTpB.8.w4.6.igOb4bpaZdrzFlZShI1yek7ag8Vbm','85548968076','600523123','[1]',1,'cadadrlosgfgfdafda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 20:22:30','2022-05-08 20:22:30',NULL),(43,24,'Carlos Eduardo t','$2b$10$W8dr6hG0B6jvYeqjXdMTMObar1beuibvVm/O8ShDXXx7l3Dap0NNK','37237291009','600523123','[1]',1,'cadadrlosgfgfdafasdda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 20:25:52','2022-05-08 20:25:52',NULL),(44,24,'Carlos Eduardo t','$2b$10$vMBgmQWbgArpX7u/Qk7vRu0u06heRMjR9MnbJz2lfg4s.e3o7nHeG','57257559082','600523123','[1]',1,'cadadrlasdosgfgfdafasdda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 20:27:14','2022-05-08 20:27:14',NULL),(45,24,'Carlos Eduardo t','$2b$10$tiwgkSNJLdNrW630jYX9Ve5zjYvII.Ea2Kmay5ynd.GvlOGpphNiW','16561882016','600523123','[1]',1,'cadadsdadrlasdosgfgfdafasdda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 20:27:42','2022-05-08 20:27:42',NULL),(46,24,'Carlos Eduardo t','$2b$10$J3PPwfIqZN1yu61e.JdZMuF0idkTcIjRGT2YVZasWnGlhGeG1smqK','45936739090','600523123','[1]',1,'cadadsdadrlasdofsafassgfgfdafasdda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 20:28:23','2022-05-08 20:28:23',NULL),(50,24,'professor pedro sgorlon','$2b$10$RXDQkOhDPCaDLYdIsqzCu.FZ.dy0zHh.VRZU2y7brdkmeoFgGuIzu','59822500076','856989859','[1]',4,'penavin309@dufeed.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-15 14:34:08','2022-05-15 14:56:03',NULL),(51,24,'João Pedro Costa','$2b$10$aisCLuY32lZZDMC9rNCoX.uQh1.51e9mrpcmu/X..dzZPVqgIsnu.','93496185082','856989859','[1]',6,'wawapa3877@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-15 20:31:48','2022-05-15 21:12:48','{\"token\": \"5ad62c7abb4ddcb6b6597b0201950f059b6e302e\", \"expiresIn\": \"2022-05-15T18:50:49.236Z\"}'),(56,24,'victor','$2b$10$gsSFiyUDQ5oEqqqFN7D9N.VUj7ZtHwOoprHsDSrn77Dfqz0xW.XIW','93025203072','856989859','[1]',6,'wawapa387gg7@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-21 15:38:53','2022-05-21 15:38:53',NULL),(59,24,'prof victor','$2b$10$Fa/xSwP0hzVwMdawQP2JR.UvIHwj09AjmfQEDtpNYHVTFCnDH1wWS','23934789064','856989859','[1]',4,'wawapa387ggasd7@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-21 18:54:40','2022-05-21 18:54:40',NULL),(66,24,'allan','$2b$10$CGwN..Agr80dXMsyohSTXu36gSQd6rN9giAEPCxXRNX9SBXTRJh1.','16727400024','856989859','[1]',6,'waw387ggasd7@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-21 21:53:55','2022-05-21 21:53:55',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-22 10:02:24
