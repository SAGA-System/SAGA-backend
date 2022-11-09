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
INSERT INTO `SequelizeMeta` VALUES ('20220508184724-update-foreignKeys-for-delete-cascade.js'),('20220513133823-remove-foreign-key-in-students.js'),('20220515013502-add-new-column-to-users-table.js'),('20220519120858-new-pivot-table-studentClasses.js'),('20220521164121-move-frequencyColumn-to-studentClasses.js'),('20220529145145-new-table-schoolCalls.js'),('20220603101827-ajustment-in-evaluation-table.js'),('20220605180151-add-column-gang-in-schoolcall.js'),('20220618165532-edit-tables-to-integrate-bulletin.js'),('20220622114657-new-columns-in-bulletin.js'),('20220711141124-delete-userpermissions-and-add-roles-and-permissionsroles-table.js'),('20220714170828-edit-evaluations-and-bulletin-tables.js'),('20220721142728-rename-column-in-school-calls.js'),('20220918181752-add-url-avatar-column-in-users-table.js'),('20220930103432-change-reset-password-type.js'),('20221011155518-create-tables-to-troubleshoot-database-structural-problems.js'),('20221014205226-removing-redundant-data.js'),('20221102135130-new-columns-in-user-table.js'),('20221107223617-create-ptds-table.js');
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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulletin`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classLessons`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frequency`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

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
-- Table structure for table `ptds`
--

DROP TABLE IF EXISTS `ptds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ptds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idClass` int NOT NULL,
  `idTeacher` int NOT NULL,
  `classTheme` varchar(255) NOT NULL,
  `schoolYear` int NOT NULL,
  `semester` int NOT NULL,
  `fileKey` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idClass` (`idClass`),
  KEY `idTeacher` (`idTeacher`),
  CONSTRAINT `ptds_ibfk_1` FOREIGN KEY (`idClass`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ptds_ibfk_2` FOREIGN KEY (`idTeacher`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ptds`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schoolcalls`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentclasses`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacherClasses`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacherLessons`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-08 21:22:30
