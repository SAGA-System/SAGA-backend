-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: db-saga.cklcydxq28la.us-east-1.rds.amazonaws.com    Database: dbsaga
-- ------------------------------------------------------
-- Server version	8.0.28

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20220508184724-update-foreignKeys-for-delete-cascade.js'),('20220513133823-remove-foreign-key-in-students.js'),('20220515013502-add-new-column-to-users-table.js'),('20220519120858-new-pivot-table-studentClasses.js'),('20220521164121-move-frequencyColumn-to-studentClasses.js'),('20220529145145-new-table-schoolCalls.js'),('20220603101827-ajustment-in-evaluation-table.js'),('20220605180151-add-column-gang-in-schoolcall.js'),('20220618165532-edit-tables-to-integrate-bulletin.js'),('20220622114657-new-columns-in-bulletin.js'),('20220711141124-delete-userpermissions-and-add-roles-and-permissionsroles-table.js'),('20220714170828-edit-evaluations-and-bulletin-tables.js'),('20220721142728-rename-column-in-school-calls.js'),('20220918181752-add-url-avatar-column-in-users-table.js'),('20220930103432-change-reset-password-type.js'),('20221011155518-create-tables-to-troubleshoot-database-structural-problems.js'),('20221014205226-removing-redundant-data.js'),('20221102135130-new-columns-in-user-table.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

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
  `idStudentClasses` int NOT NULL,
  `totalClasses` int DEFAULT NULL,
  `classesGiven` int DEFAULT NULL,
  `absence` int DEFAULT NULL,
  `frequency` decimal(10,0) DEFAULT NULL,
  `idInstitution` int NOT NULL,
  `classTheme` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bulletin_ibfk_1` (`idStudentClasses`) USING BTREE,
  KEY `Bulletin_ibfk_2` (`idTeacher`) USING BTREE,
  KEY `bulletin_ibfk_3` (`idInstitution`) USING BTREE,
  CONSTRAINT `bulletin_ibfk_1` FOREIGN KEY (`idTeacher`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bulletin_ibfk_2` FOREIGN KEY (`idStudentClasses`) REFERENCES `studentclasses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bulletin_ibfk_3` FOREIGN KEY (`idInstitution`) REFERENCES `institution` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulletin`
--

LOCK TABLES `bulletin` WRITE;
/*!40000 ALTER TABLE `bulletin` DISABLE KEYS */;
INSERT INTO `bulletin` VALUES (6,6,NULL,NULL,NULL,NULL,NULL,14,200,0,0,0,24,'matemática','2022-11-04 20:55:12','2022-11-04 20:55:12'),(7,6,NULL,NULL,NULL,NULL,NULL,14,200,0,0,0,24,'lpl','2022-11-04 20:55:13','2022-11-04 20:55:13'),(8,6,NULL,NULL,NULL,NULL,NULL,14,100,0,0,0,24,'geografia','2022-11-04 20:55:13','2022-11-04 20:55:13'),(9,3,NULL,NULL,NULL,NULL,NULL,14,100,0,0,0,24,'tcc','2022-11-04 20:55:13','2022-11-04 20:55:13'),(10,6,NULL,NULL,NULL,NULL,NULL,15,200,0,0,0,24,'matemática','2022-11-04 20:55:13','2022-11-04 20:55:13'),(11,3,NULL,NULL,NULL,NULL,NULL,15,200,0,0,0,24,'lpl','2022-11-04 20:55:14','2022-11-04 20:55:14'),(12,6,NULL,NULL,NULL,NULL,NULL,15,100,0,0,0,24,'geografia','2022-11-04 20:55:14','2022-11-04 20:55:14'),(13,3,NULL,NULL,NULL,NULL,NULL,15,100,0,0,0,24,'tcc','2022-11-04 20:55:15','2022-11-04 20:55:15'),(14,6,NULL,NULL,NULL,NULL,NULL,26,200,0,0,0,24,'matemática','2022-11-04 20:55:15','2022-11-04 20:55:15'),(15,6,NULL,NULL,NULL,NULL,NULL,26,200,0,0,0,24,'lpl','2022-11-04 20:55:15','2022-11-04 20:55:15'),(16,6,NULL,NULL,NULL,NULL,NULL,26,100,0,0,0,24,'geografia','2022-11-04 20:55:16','2022-11-04 20:55:16'),(17,3,NULL,NULL,NULL,NULL,NULL,26,100,0,0,0,24,'tcc','2022-11-04 20:55:16','2022-11-04 20:55:16');
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
  `idInstitution` int NOT NULL,
  `period` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `schoolYear` int NOT NULL,
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
INSERT INTO `class` VALUES (5,8,'Matutino','Ensino médio integrado ao Técnico de desenvolvimento de sistemas',3,'E',4,'[[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]','2022-04-30 19:49:13','2022-04-30 19:49:13'),(6,8,'Matutino','Ensino médio integrado ao Técnico de desenvolvimento de sistemas',3,'E',1,'[[\"matemática\", \"lpl\", \"ingles\", \"artes\"], [\"matemática\", \"lpl\", \"ingles\", \"Educação fisica\"], [\"matemática\", \"lpl\", \"ingles\", \"espanhol\"]]','2022-05-08 01:52:56','2022-05-08 01:52:56'),(8,24,'matutino','Ensino médio legal',3,'E',4,'[{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"geografia\", \"totalClasses\": 100}, {\"name\": \"tcc\", \"totalClasses\": 100}]','2022-05-08 20:05:58','2022-09-24 15:01:34');
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classLessons`
--

DROP TABLE IF EXISTS `classLessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classLessons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idClass` int NOT NULL,
  `monday` json NOT NULL,
  `tuesday` json NOT NULL,
  `wednesday` json NOT NULL,
  `thursday` json NOT NULL,
  `friday` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `classLessons_ibfk_1` (`idClass`),
  CONSTRAINT `classLessons_ibfk_1` FOREIGN KEY (`idClass`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classLessons`
--

LOCK TABLES `classLessons` WRITE;
/*!40000 ALTER TABLE `classLessons` DISABLE KEYS */;
INSERT INTO `classLessons` VALUES (1,8,'[{\"gang\": \"\", \"lesson\": 1, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 2, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 3, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 4, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 5, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 6, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}]','[{\"gang\": \"\", \"lesson\": 1, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 2, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 3, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 4, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 5, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 6, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}]','[{\"gang\": \"\", \"lesson\": 1, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 2, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 3, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 4, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 5, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 6, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}]','[{\"gang\": \"\", \"lesson\": 1, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 2, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 3, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 4, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 5, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 6, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}]','[{\"gang\": \"\", \"lesson\": 1, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 2, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 3, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 4, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 5, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}, {\"gang\": \"\", \"lesson\": 6, \"teacher\": {\"id\": 6, \"name\": \"prof victor\", \"idUser\": 59}, \"classTheme\": \"matemática\"}]','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `classLessons` ENABLE KEYS */;
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluations_ibfk_1` (`idSchoolCall`),
  CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`idSchoolCall`) REFERENCES `schoolcalls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frequency`
--

DROP TABLE IF EXISTS `frequency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frequency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idStudentClasses` int NOT NULL,
  `classTheme` varchar(255) NOT NULL,
  `totalClasses` int NOT NULL,
  `classGiven` int NOT NULL,
  `absence` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `frequency_ibfk_1` (`idStudentClasses`),
  CONSTRAINT `frequency_ibfk_1` FOREIGN KEY (`idStudentClasses`) REFERENCES `studentclasses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frequency`
--

LOCK TABLES `frequency` WRITE;
/*!40000 ALTER TABLE `frequency` DISABLE KEYS */;
INSERT INTO `frequency` VALUES (1,15,'matemática',200,0,0,'2022-11-04 19:56:12','2022-11-04 19:56:12'),(2,15,'lpl',200,0,0,'2022-11-04 19:56:12','2022-11-04 19:56:12'),(3,15,'geografia',100,0,0,'2022-11-04 19:56:12','2022-11-04 19:56:12'),(4,15,'tcc',100,0,0,'2022-11-04 19:56:12','2022-11-04 19:56:12'),(5,14,'matemática',200,0,0,'2022-11-04 19:56:17','2022-11-04 19:56:17'),(6,14,'lpl',200,0,0,'2022-11-04 19:56:17','2022-11-04 19:56:17'),(7,14,'geografia',100,0,0,'2022-11-04 19:56:17','2022-11-04 19:56:17'),(8,14,'tcc',100,0,0,'2022-11-04 19:56:17','2022-11-04 19:56:17'),(9,26,'matemática',200,0,0,'2022-11-04 19:56:22','2022-11-04 19:56:22'),(10,26,'lpl',200,0,0,'2022-11-04 19:56:22','2022-11-04 19:56:22'),(11,26,'geografia',100,0,0,'2022-11-04 19:56:22','2022-11-04 19:56:22'),(12,26,'tcc',100,0,0,'2022-11-04 19:56:22','2022-11-04 19:56:22');
/*!40000 ALTER TABLE `frequency` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
INSERT INTO `institution` VALUES (8,'ETEC Prof Eudécio Luiz Vicente3',NULL,'[{\"name\": \"Ensino médio legal\", \"period\": \"matutino\", \"classTheme\": [[{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"artes\", \"totalClasses\": 100}, {\"name\": \"fisica\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"educação fisica\", \"totalClasses\": 100}, {\"name\": \"espanhol\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"geografia\", \"totalClasses\": 100}, {\"name\": \"tcc\", \"totalClasses\": 100}]], \"lessonsPerDay\": 6}]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','2022-07-08 16:23:29','[]'),(9,'ETEC Prof Eudécio Luiz Vicente4',NULL,'[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','0000-00-00 00:00:00','null'),(11,'ETEC Prof Eudécio Luiz Vicente5',NULL,'[\"Ensino médio integrado ao técnico de Desenvolvimento de Sitemas\", \"Ensino médio integrado ao técnico de Administração\", \"Ensino médio integrado ao técnico de Informática para Internet\"]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','0000-00-00 00:00:00','0000-00-00 00:00:00','null'),(24,'ETEC Carlos Eduardo zzz','79.504.227/0001-24','[{\"name\": \"Ensino médio legal\", \"period\": \"matutino\", \"classTheme\": [[{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"artes\", \"totalClasses\": 100}, {\"name\": \"fisica\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"educação fisica\", \"totalClasses\": 100}, {\"name\": \"espanhol\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"geografia\", \"totalClasses\": 100}, {\"name\": \"tcc\", \"totalClasses\": 100}]], \"lessonsPerDay\": 6}]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Adamantina','2022-04-26 14:54:08','2022-07-01 16:31:32','[{\"year\": 2022, \"firstBim\": {\"endDate\": \"2022-1-2\", \"startDate\": \"2022-1-1\"}, \"thirdBim\": {\"endDate\": \"2022-1-4\", \"startDate\": \"2022-1-3\"}, \"fourthBim\": {\"endDate\": \"2022-4-7\", \"startDate\": \"2022-2-4\"}, \"secondBim\": {\"endDate\": \"2022-1-3\", \"startDate\": \"2022-1-2\"}}, {\"year\": 2021, \"firstBim\": {\"endDate\": \"2022-1-2\", \"startDate\": \"2022-1-1\"}, \"thirdBim\": {\"endDate\": \"2022-1-4\", \"startDate\": \"2022-1-3\"}, \"fourthBim\": {\"endDate\": \"2022-1-5\", \"startDate\": \"2022-1-4\"}, \"secondBim\": {\"endDate\": \"2022-1-3\", \"startDate\": \"2022-1-2\"}}]'),(25,'ETEC Prof Eudécio Luiz VVVVV','62.823.257/0055-93','[{\"name\": \"Ensino médio integrado ao Técnico de desenvolvimento de sistemas\", \"period\": \"matutino\", \"lessons\": {\"Friday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Monday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Tuesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Saturday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Thursday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}, \"Wednesday\": {\"1\": \"\", \"2\": \"\", \"3\": \"\", \"4\": \"\", \"5\": \"\", \"6\": \"\"}}, \"classTheme\": [[{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"artes\", \"totalClasses\": 100}, {\"name\": \"fisica\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"educação fisica\", \"totalClasses\": 100}, {\"name\": \"espanhol\", \"totalClasses\": 100}], [{\"name\": \"matemática\", \"totalClasses\": 200}, {\"name\": \"lpl\", \"totalClasses\": 200}, {\"name\": \"geografia\", \"totalClasses\": 100}, {\"name\": \"tcc\", \"totalClasses\": 100}]]}]','18 3521-2493','R. Líbero Badaró',600,'Vila Jamil de Lima',NULL,'Lucelia','2022-06-22 13:56:43','2022-06-22 14:10:51','[{\"year\": 2022, \"firstBim\": {\"endDate\": \"2022-1-2\", \"startDate\": \"2022-1-1\"}, \"thirdBim\": {\"endDate\": \"2022-1-4\", \"startDate\": \"2022-1-3\"}, \"fourthBim\": {\"endDate\": \"2022-4-7\", \"startDate\": \"2022-2-4\"}, \"secondBim\": {\"endDate\": \"2022-1-3\", \"startDate\": \"2022-1-2\"}}, {\"year\": 2021, \"firstBim\": {\"endDate\": \"2022-1-2\", \"startDate\": \"2022-1-1\"}, \"thirdBim\": {\"endDate\": \"2022-1-4\", \"startDate\": \"2022-1-3\"}, \"fourthBim\": {\"endDate\": \"2022-1-5\", \"startDate\": \"2022-1-4\"}, \"secondBim\": {\"endDate\": \"2022-1-3\", \"startDate\": \"2022-1-2\"}}]');
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
-- Table structure for table `permissionsrole`
--

DROP TABLE IF EXISTS `permissionsrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionsrole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idPermission` int NOT NULL,
  `idRole` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `permissionsrole_ibfk_1` (`idPermission`),
  KEY `permissionsrole_ibfk_2` (`idRole`),
  CONSTRAINT `permissionsrole_ibfk_1` FOREIGN KEY (`idPermission`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `permissionsrole_ibfk_2` FOREIGN KEY (`idRole`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionsrole`
--

LOCK TABLES `permissionsrole` WRITE;
/*!40000 ALTER TABLE `permissionsrole` DISABLE KEYS */;
INSERT INTO `permissionsrole` VALUES (2,1,1,'2022-07-12 15:12:05','2022-07-12 15:12:05'),(3,2,1,'2022-07-12 15:12:14','2022-07-12 15:12:14'),(4,3,1,'2022-07-12 15:12:18','2022-07-12 15:12:18'),(5,4,1,'2022-07-12 15:12:20','2022-07-12 15:12:20'),(6,5,1,'2022-07-12 15:12:23','2022-07-12 15:12:23'),(7,6,1,'2022-07-12 15:12:26','2022-07-12 15:12:26'),(8,7,1,'2022-07-12 15:12:29','2022-07-12 15:12:29'),(9,8,1,'2022-07-12 15:12:31','2022-07-12 15:12:31'),(10,9,1,'2022-07-12 15:12:34','2022-07-12 15:12:34'),(11,10,1,'2022-07-12 15:12:37','2022-07-12 15:12:37'),(12,11,1,'2022-07-12 15:12:40','2022-07-12 15:12:40'),(13,12,1,'2022-07-12 15:12:46','2022-07-12 15:12:46'),(14,13,1,'2022-07-12 15:12:49','2022-07-12 15:12:49'),(15,14,1,'2022-07-12 15:12:51','2022-07-12 15:12:51'),(16,15,1,'2022-07-12 15:12:53','2022-07-12 15:12:53'),(17,16,1,'2022-07-12 15:12:56','2022-07-12 15:12:56'),(18,17,1,'2022-07-12 15:12:58','2022-07-12 15:12:58'),(19,18,1,'2022-07-12 15:13:01','2022-07-12 15:13:01'),(20,19,1,'2022-07-12 15:13:04','2022-07-12 15:13:04'),(21,1,2,'2022-07-12 16:14:26','2022-07-12 16:14:26'),(22,2,2,'2022-07-12 16:14:33','2022-07-12 16:14:33'),(23,3,2,'2022-07-12 16:14:36','2022-07-12 16:14:36'),(24,4,2,'2022-07-12 16:14:39','2022-07-12 16:14:39'),(25,5,2,'2022-07-12 16:14:44','2022-07-12 16:14:44'),(26,6,2,'2022-07-12 16:14:47','2022-07-12 16:14:47'),(27,7,2,'2022-07-12 16:14:50','2022-07-12 16:14:50'),(28,8,2,'2022-07-12 16:14:52','2022-07-12 16:14:52'),(29,10,2,'2022-07-12 16:14:57','2022-07-12 16:14:57'),(30,14,2,'2022-07-12 16:15:03','2022-07-12 16:15:03'),(31,17,2,'2022-07-12 16:15:06','2022-07-12 16:15:06'),(32,18,2,'2022-07-12 16:15:09','2022-07-12 16:15:09'),(33,19,2,'2022-07-12 16:15:12','2022-07-12 16:15:12'),(34,1,3,'2022-07-12 16:23:10','2022-07-12 16:23:10'),(35,2,3,'2022-07-12 16:23:12','2022-07-12 16:23:12'),(36,3,3,'2022-07-12 16:23:15','2022-07-12 16:23:15'),(37,4,3,'2022-07-12 16:23:17','2022-07-12 16:23:17'),(38,5,3,'2022-07-12 16:23:20','2022-07-12 16:23:20'),(39,6,3,'2022-07-12 16:23:23','2022-07-12 16:23:23'),(40,7,3,'2022-07-12 16:23:25','2022-07-12 16:23:25'),(41,8,3,'2022-07-12 16:23:33','2022-07-12 16:23:33'),(42,10,3,'2022-07-12 16:23:45','2022-07-12 16:23:45'),(43,17,3,'2022-07-12 16:23:48','2022-07-12 16:23:48'),(44,18,3,'2022-07-12 16:23:50','2022-07-12 16:23:50'),(45,19,3,'2022-07-12 16:23:53','2022-07-12 16:23:53'),(46,3,4,'2022-07-12 16:25:27','2022-07-12 16:25:27'),(47,6,4,'2022-07-12 16:25:34','2022-07-12 16:25:34'),(48,7,4,'2022-07-12 16:25:37','2022-07-12 16:25:37'),(49,8,4,'2022-07-12 16:25:45','2022-07-12 16:25:45'),(50,3,5,'2022-07-12 16:26:19','2022-07-12 16:26:19'),(51,8,5,'2022-07-12 16:26:49','2022-07-12 16:26:49'),(52,8,6,'2022-07-12 16:27:51','2022-07-12 16:27:51');
/*!40000 ALTER TABLE `permissionsrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Admin','Administrador','2022-07-12 14:57:53','2022-07-12 14:57:53'),(2,'principal','Diretor','Diretor da instituição','2022-07-12 14:58:57','2022-07-12 14:58:57'),(3,'coordinator','Coordenador','Coordenador da instituição','2022-07-12 15:00:17','2022-07-12 15:00:17'),(4,'teacher','Professor','Professor da instituição','2022-07-12 15:01:31','2022-07-12 15:01:31'),(5,'parent','Pais','Pais','2022-07-12 15:01:56','2022-07-12 15:01:56'),(6,'student','Estudante','Estudante','2022-07-12 15:02:19','2022-07-12 15:02:19');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schoolcalls`
--

DROP TABLE IF EXISTS `schoolcalls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schoolcalls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTeacher` int NOT NULL,
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
  KEY `idUser` (`idTeacher`),
  KEY `idClass` (`idClass`),
  CONSTRAINT `schoolcalls_ibfk_1` FOREIGN KEY (`idClass`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `schoolcalls_ibfk_2` FOREIGN KEY (`idTeacher`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schoolcalls`
--

LOCK TABLES `schoolcalls` WRITE;
/*!40000 ALTER TABLE `schoolcalls` DISABLE KEYS */;
INSERT INTO `schoolcalls` VALUES (20,3,8,'lpl','2022-05-29 03:00:00','boa aula pa nois','[{\"absence\": 4, \"idStudent\": 18, \"justification\": \"\"}, {\"absence\": 1, \"idStudent\": 13, \"justification\": \"Atestado de covid\"}]','2022-05-29 19:07:49','2022-07-21 15:08:48','',0),(21,40,8,'lpl','2022-06-30 03:00:00','Aula de teste 2','[{\"absence\": 1, \"idStudent\": 13, \"justification\": \"Atestado de covid\"}]','2022-05-29 20:42:53','2022-05-29 21:44:58','',0),(22,40,8,'lpl','2022-07-01 03:00:00','Aula de teste 2','[{\"absence\": 4, \"idStudent\": 13, \"justification\": \"\"}]','2022-05-29 20:43:31','2022-06-05 18:39:02','',0),(33,40,8,'lpl','2022-06-05 03:00:00','Aula de teste 2','[{\"absence\": 2, \"idStudent\": 13, \"justification\": \"\"}]','2022-06-05 21:28:05','2022-06-05 21:28:11','A',0),(34,40,8,'lpl','2022-06-05 03:00:00','Aula de teste 2','[{\"absence\": 1, \"idStudent\": 18, \"justification\": \"\"}]','2022-06-05 21:30:23','2022-06-05 21:30:23','B',0),(35,40,8,'lpl','2022-06-05 03:00:00','Aula de teste 2','[{\"absence\": 2, \"idStudent\": 13, \"justification\": \"\"}, {\"absence\": 2, \"idStudent\": 18, \"justification\": \"\"}]','2022-06-05 21:33:10','2022-06-05 21:33:20','',0),(36,40,8,'lpl','2022-07-15 03:00:00','Aula de teste 3','[{\"absence\": 1, \"idStudent\": 13, \"justification\": \"\"}, {\"absence\": 1, \"idStudent\": 18, \"justification\": \"\"}]','2022-07-15 21:00:37','2022-07-15 21:00:37','',2),(37,40,8,'lpl','2022-07-15 03:00:00','Aula de teste 3','[{\"absence\": 3, \"idStudent\": 27, \"justification\": \"\"}, {\"absence\": 3, \"idStudent\": 18, \"justification\": \"\"}]','2022-07-18 15:19:56','2022-07-18 15:21:06','B',2),(38,3,8,'matematica','2022-07-15 03:00:00','Aula de teste 3','[]','2022-10-11 21:23:34','2022-10-11 21:56:21','',2),(40,3,8,'matematica','2023-10-21 03:00:00','Aula de teste 3','[{\"absence\": 2, \"justification\": \"\", \"idStudentClasses\": 14}, {\"absence\": 1, \"justification\": \"\", \"idStudentClasses\": 15}]','2022-10-12 14:52:18','2022-10-12 15:06:29','',2),(41,3,8,'lpl','2023-10-21 03:00:00','Aula de teste 3','[{\"absence\": 2, \"justification\": \"\", \"idStudentClasses\": 14}, {\"absence\": 1, \"justification\": \"\", \"idStudentClasses\": 26}]','2022-10-12 15:31:02','2022-10-12 15:31:48','B',2),(42,6,8,'lpl','2022-10-28 03:00:00','teste front\nteste fronttt','[{\"absence\": 5, \"justification\": \"\", \"idStudentClasses\": 14}, {\"absence\": 5, \"justification\": \"\", \"idStudentClasses\": 26}]','2022-10-29 00:01:05','2022-10-29 00:32:15','',1),(43,3,8,'lpl','2022-11-04 03:00:00','Aula para a turma A, a melhor\nteste chamada','[{\"absence\": 2, \"justification\": \"\", \"idStudentClasses\": 14}, {\"absence\": 2, \"justification\": \"\", \"idStudentClasses\": 26}]','2022-11-04 18:16:55','2022-11-04 18:33:27','',3),(44,6,8,'lpl','2022-11-03 03:00:00','teste chamada 2','[{\"absence\": 2, \"justification\": \"\", \"idStudentClasses\": 14}, {\"absence\": 2, \"justification\": \"\", \"idStudentClasses\": 26}]','2022-11-04 18:36:14','2022-11-04 18:36:14','B',4),(45,6,8,'lpl','2022-11-02 03:00:00','teste chamada 3','[{\"absence\": 16, \"justification\": \"\", \"idStudentClasses\": 26}, {\"absence\": 8, \"justification\": \"\", \"idStudentClasses\": 14}]','2022-11-04 18:36:38','2022-11-04 18:49:27','B',4);
/*!40000 ALTER TABLE `schoolcalls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20220508184724-update-foreignKeys-for-delete-cascade.js'),('20220513133823-remove-foreign-key-in-students.js'),('20220515013502-add-new-column-to-users-table.js'),('20220519120858-new-pivot-table-studentClasses.js'),('20220521164121-move-frequencyColumn-to-studentClasses.js'),('20220529145145-new-table-schoolCalls.js'),('20220603101827-ajustment-in-evaluation-table.js'),('20220605180151-add-column-gang-in-schoolcall.js'),('20220618165532-edit-tables-to-integrate-bulletin.js'),('20220622114657-new-columns-in-bulletin.js'),('20220711141124-delete-userpermissions-and-add-roles-and-permissionsroles-table.js'),('20220714170828-edit-evaluations-and-bulletin-tables.js'),('20220721142728-rename-column-in-school-calls.js');
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idStudent` (`idStudent`),
  KEY `idClass` (`idClass`),
  CONSTRAINT `studentclasses_ibfk_1` FOREIGN KEY (`idStudent`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentclasses_ibfk_2` FOREIGN KEY (`idClass`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentclasses`
--

LOCK TABLES `studentclasses` WRITE;
/*!40000 ALTER TABLE `studentclasses` DISABLE KEYS */;
INSERT INTO `studentclasses` VALUES (14,18,8,'B','2022-11-04 19:56:17','2022-11-04 20:04:54'),(15,13,8,'A','2022-11-04 19:56:11','2022-11-04 20:04:53'),(26,27,8,'B','2022-11-04 19:56:22','2022-11-04 20:04:54');
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (13,51,'51521541',3,'cursando','2022-05-15 20:31:48','2022-05-15 20:49:32'),(18,56,'5152154175',3,'cursando','2022-05-21 15:38:53','2022-05-21 15:38:53'),(26,67,'5959595s',3,'cursando','2022-06-22 13:51:34','2022-06-22 13:51:34'),(27,68,'59595957',3,'cursando','2022-07-12 21:38:21','2022-07-12 21:38:21');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacherClasses`
--

DROP TABLE IF EXISTS `teacherClasses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacherClasses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTeacher` int NOT NULL,
  `idClass` int NOT NULL,
  `gang` varchar(255) DEFAULT NULL,
  `classTheme` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacherClasses_ibfk_2` (`idClass`),
  KEY `teacherClasses_ibfk_1` (`idTeacher`),
  CONSTRAINT `teacherClasses_ibfk_1` FOREIGN KEY (`idTeacher`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacherClasses_ibfk_2` FOREIGN KEY (`idClass`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacherClasses`
--

LOCK TABLES `teacherClasses` WRITE;
/*!40000 ALTER TABLE `teacherClasses` DISABLE KEYS */;
INSERT INTO `teacherClasses` VALUES (1,3,8,'A','lpl','0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,6,8,NULL,'matematica','0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,6,8,'B','lpl','0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,6,8,NULL,'geografia','0000-00-00 00:00:00','0000-00-00 00:00:00'),(5,3,8,NULL,'tcc','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `teacherClasses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacherLessons`
--

DROP TABLE IF EXISTS `teacherLessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacherLessons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTeacher` int NOT NULL,
  `monday` json DEFAULT NULL,
  `tuesday` json DEFAULT NULL,
  `wednesday` json DEFAULT NULL,
  `thursday` json DEFAULT NULL,
  `friday` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacherLessons_ibfk_1` (`idTeacher`),
  CONSTRAINT `teacherLessons_ibfk_1` FOREIGN KEY (`idTeacher`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacherLessons`
--

LOCK TABLES `teacherLessons` WRITE;
/*!40000 ALTER TABLE `teacherLessons` DISABLE KEYS */;
INSERT INTO `teacherLessons` VALUES (1,6,'[{\"gang\": \"\", \"lesson\": 1, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 2, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 3, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 4, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 5, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 6, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}]',NULL,NULL,NULL,'[{\"gang\": \"\", \"lesson\": 1, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"lpl\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 2, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"lpl\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 4, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 5, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}, {\"gang\": \"\", \"lesson\": 6, \"period\": \"matutino\", \"classBlock\": \"E\", \"classTheme\": \"matemática\", \"classNumber\": 4}]','0000-00-00 00:00:00','2022-10-11 20:46:01');
/*!40000 ALTER TABLE `teacherLessons` ENABLE KEYS */;
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
INSERT INTO `teachers` VALUES (3,50,'banco de dados','2022-05-15 14:34:08','2022-07-08 16:25:00'),(6,59,'banco de dados, backend','2022-05-21 18:54:40','2022-07-08 16:25:00');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
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
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `number` int NOT NULL,
  `district` varchar(255) NOT NULL,
  `complement` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `resetPassword` varchar(255) DEFAULT NULL,
  `idRole` int NOT NULL,
  `avatarKey` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `birthDate` datetime NOT NULL,
  `CEP` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `Users_fk0` (`idInstitution`) USING BTREE,
  KEY `users_ibfk_2` (`idRole`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idInstitution`) REFERENCES `institution` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`idRole`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (40,24,'Carlos Eduardo t','$2b$10$KyZztosjNlLRBjyZxxp5..0bqycBYJ0I2LorrZkgn9WcTQZDg4k76','31544698008','600523123','cadadrlosgfgfdfda@email.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-08 20:19:39','2022-11-03 13:59:22','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjQwLCJpYXQiOjE2Njc0ODM5NjIsImV4cCI6MTY2NzQ5NDc2Mn0.3JsFvF6NcZPcfXqBAhE49njHzz5O0O2EcJD2SZkjlFY',1,'Avatar-1664146491159-foto nsa.jpg','','0000-00-00 00:00:00',''),(50,24,'professor pedro sgorlon','$2b$10$RXDQkOhDPCaDLYdIsqzCu.FZ.dy0zHh.VRZU2y7brdkmeoFgGuIzu','59822500076','856989859','penavin309@dufeed.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-15 14:34:08','2022-11-04 11:52:57',NULL,4,'Avatar-1667562777245-IMG-20221103-WA0001.jpg','Masculino','2004-08-11 03:00:00','18780000'),(51,24,'João Pedro Costa','$2b$10$rfxYmMH4eR5VLOptlaT8L.8tC765vikF1kfi6RCj0FodDeeR9.5Wq','93496185082','856989859','wawapa3877@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-15 20:31:48','2022-06-22 13:49:03','{\"token\": \"01478c0f22ddc512552b78c5e1776b96638a705d\", \"expiresIn\": \"2022-06-22T11:48:22.380Z\"}',6,'Avatar-1663931764628-defaultAvatarUser.jpg','','0000-00-00 00:00:00',''),(56,24,'victor','$2b$10$gsSFiyUDQ5oEqqqFN7D9N.VUj7ZtHwOoprHsDSrn77Dfqz0xW.XIW','93025203072','856989859','wawapa387gg7@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-05-21 15:38:53','2022-05-21 15:38:53',NULL,6,'Avatar-1663931764628-defaultAvatarUser.jpg','','0000-00-00 00:00:00',''),(59,24,'prof victor','$2b$10$Fa/xSwP0hzVwMdawQP2JR.UvIHwj09AjmfQEDtpNYHVTFCnDH1wWS','23934789064','856989859','wawapa@roxoas.com','18999996666','Rua alolol',969,'Centrol',NULL,'Adamantinass','2022-05-21 18:54:40','2022-11-02 21:34:46',NULL,4,'Avatar-1667424885302-League Of Legends - Clique no Pin.jpg','Masculino','1982-08-18 03:00:00','17800000'),(67,24,'Allan Goto','$2b$10$rGGuldUJQpcb9nBMSltqxOCUS/9Vv0qUngYKaXsWYWITkSw066Z6y','16727400024','856989859','waw387ggaassd7@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-06-22 13:51:34','2022-06-22 13:51:57',NULL,6,'Avatar-1663931764628-defaultAvatarUser.jpg','','0000-00-00 00:00:00',''),(68,24,'roberto','$2b$10$f3HH3efEKLWAR82jeGT/MODBLIx2l6aiEMZZcDybmp5sMI4FbKmIK','03524381006','856989859','waw387ggas45d7@roxoas.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-07-12 21:38:21','2022-10-28 22:51:29',NULL,6,'Avatar-1666997487786-doge.jpg','','0000-00-00 00:00:00',''),(78,24,'joaozinho','$2b$10$VCc1IKi7TC7wpJe10pCy0eYSgFn6D7M5zmvgDRFu1T/0Qt2BpRMLO','09152270025','856989859','waw387ggas45d7@rxxoxoasss.com','18999999999','Rua a',11,'Centro',NULL,'Adamantina','2022-09-23 16:08:43','2022-09-24 15:19:26',NULL,5,'Avatar-1664032764907-foto nsa.jpg','','0000-00-00 00:00:00','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-04 18:05:30
