-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: signup
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `ins_content`
--

DROP TABLE IF EXISTS `ins_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int DEFAULT NULL,
  `text` text NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_bde343a48729cfc9e803214bad5` (`menu_id`),
  CONSTRAINT `FK_bde343a48729cfc9e803214bad5` FOREIGN KEY (`menu_id`) REFERENCES `ins_menus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_content`
--

LOCK TABLES `ins_content` WRITE;
/*!40000 ALTER TABLE `ins_content` DISABLE KEYS */;
INSERT INTO `ins_content` VALUES (1,1,'<p>Welcome to SQL Home! This section covers the basics of SQL .</p><p>bjb</p><figure class=\"image image-style-side\"><img src=\"http://localhost:8081/uploads/1743665463388.png\" alt=\"dd\"></figure>','2025-03-31 10:50:50.505822',1),(2,2,'<p>SQL Introduction: SQL is a standard language for accessing databases.</p>','2025-03-31 10:50:50.505822',1),(3,3,'SQL Syntax: Learn how to write SQL queries using SELECT, INSERT, etc.','2025-03-31 10:50:50.505822',1),(4,4,'HTML Home: Introduction to HTML and web structure.','2025-03-31 10:50:50.505822',1),(5,5,'HTML Introduction: HTML stands for HyperText Markup Language.','2025-03-31 10:50:50.505822',1),(6,6,'HTML Elements: Learn about div, span, p, and other HTML elements.','2025-03-31 10:50:50.505822',1),(7,7,'CSS Home: Introduction to CSS for styling web pages.','2025-03-31 10:50:50.505822',1),(8,8,'CSS Syntax: Learn about selectors, properties, and values in CSS.','2025-03-31 10:50:50.505822',1),(9,9,'<figure class=\"table\"><table><tbody><tr><td>ww</td><td>e jks&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure><p>JS Home<strong>: JavaScript is a sc</strong>ripting language used for web development.</p>','2025-03-31 10:50:50.505822',1),(10,10,'JS Basics: Learn about variables, functions, and basic JS concepts.','2025-03-31 10:50:50.505822',1),(11,12,'qwdd','2025-03-31 10:50:50.505822',1),(12,12,'wdesd','2025-03-31 10:50:50.505822',1),(13,12,'<div className=\"bg-red\">hello</div>','2025-03-31 10:50:50.505822',1),(14,12,'<h2>Auth Again</h2>','2025-03-31 10:50:50.505822',1),(15,18,'<ul><li>hello Bacho Kya haal</li></ul>','2025-04-02 05:29:04.362110',1),(16,18,'<p>&nbsp;Again Updated content text</p>','2025-04-02 05:29:27.976829',1),(17,19,'<p>cs &nbsp;mnds &nbsp; &nbsp;</p>','2025-04-02 09:47:57.625148',1),(18,19,'<p>3222</p>','2025-04-02 10:10:01.850118',1),(19,19,'<p>15</p>','2025-04-02 11:06:16.678191',1),(20,4,'<figure class=\"table\"><table><tbody><tr><td>h</td><td>ndvdbf</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure>','2025-04-02 11:35:34.065788',1),(21,16,'<p>h</p>','2025-04-02 11:36:32.988724',1),(22,27,'<p><img src=\"http://localhost:8081/uploads/1743664890813.jpeg\">hlo</p>','2025-04-02 11:41:43.201676',1),(23,20,'<p>n hjjh</p>','2025-04-03 06:50:20.603520',1),(24,28,'<p>hii Bacha</p><figure class=\"image\"><img src=\"http://localhost:8081/uploads/1743665052985.jpeg\"><figcaption>&nbsp;</figcaption></figure><p>ninsa</p>','2025-04-03 07:23:57.000121',1),(25,28,'<p>hlo<br><img src=\"http://localhost:8081/uploads/1743665297639.jpeg\"></p>','2025-04-03 07:28:22.259029',1),(26,11,'<p>Hi hello guys &nbsp;bbye</p>','2025-04-03 08:57:33.426919',1),(27,1,'<p>hii</p>','2025-04-10 11:53:20.148701',1),(29,36,'<p>hii</p>','2025-04-10 12:54:42.751575',1),(30,36,'<p>h2 gt</p>','2025-04-10 12:57:11.710092',1),(31,35,'<p><img src=\"http://localhost:8081/uploads/1744294278041.png\">Hlo</p>','2025-04-10 13:40:33.987832',1);
/*!40000 ALTER TABLE `ins_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ins_courses`
--

DROP TABLE IF EXISTS `ins_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_54c6e152965e4049d762a2fe9c` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_courses`
--

LOCK TABLES `ins_courses` WRITE;
/*!40000 ALTER TABLE `ins_courses` DISABLE KEYS */;
INSERT INTO `ins_courses` VALUES (1,'SQL','2025-03-31 10:50:54.944704',1),(2,'HTML','2025-03-31 10:50:54.944704',1),(3,'CSS','2025-03-31 10:50:54.944704',1),(4,'JS','2025-03-31 10:50:54.944704',1),(11,'hii','2025-03-31 10:50:54.944704',1),(12,'Redux','2025-04-01 06:09:03.098495',1),(15,'Redux2','2025-04-01 17:50:56.208557',1),(25,'Redsi','2025-04-10 12:32:31.753123',1),(26,'Redis3','2025-04-10 12:35:40.794692',1),(27,'Redis 4','2025-04-10 12:36:03.159199',1),(28,'Redis 5','2025-04-10 12:36:28.048379',1);
/*!40000 ALTER TABLE `ins_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ins_images`
--

DROP TABLE IF EXISTS `ins_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int DEFAULT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_d7e188166f3a821b9e6d88d979e` (`menu_id`),
  CONSTRAINT `FK_d7e188166f3a821b9e6d88d979e` FOREIGN KEY (`menu_id`) REFERENCES `ins_menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_images`
--

LOCK TABLES `ins_images` WRITE;
/*!40000 ALTER TABLE `ins_images` DISABLE KEYS */;
INSERT INTO `ins_images` VALUES (5,6,'/uploads/1742455088231.png','2025-03-20 07:18:08.267640',1),(6,6,'/uploads/1742455720054.png','2025-03-20 07:28:40.084808',1),(7,10,'/uploads/1742456970596.png','2025-03-20 07:49:30.623359',1),(8,8,'/uploads/1742457365465.png','2025-03-20 07:56:05.492813',1),(9,7,'/uploads/1742457602347.jpeg','2025-03-20 08:00:02.359848',1),(10,7,'/uploads/1742457656132.png','2025-03-20 08:00:56.143952',1),(11,9,'/uploads/1742457831342.png','2025-03-20 08:03:51.354876',1),(12,5,'/uploads/1742458106935.png','2025-03-20 08:08:26.943822',1),(13,5,'/uploads/1742458150665.png','2025-03-20 08:09:10.689024',1),(14,5,'/uploads/1742458202954.png','2025-03-20 08:10:02.966278',1),(15,10,'/uploads/1742458270477.png','2025-03-20 08:11:10.506870',1),(16,8,'/uploads/1742458429449.png','2025-03-20 08:13:49.482526',1),(17,5,'/uploads/1742469715989.png','2025-03-20 11:21:56.082864',1),(18,1,'/uploads/1742533665260.png','2025-03-21 05:07:45.376510',1),(19,2,'/uploads/1742533701017.png','2025-03-21 05:08:21.028046',1),(20,3,'/uploads/1742533722927.png','2025-03-21 05:08:42.940723',1),(21,5,'/uploads/1742575988473.png','2025-03-21 16:53:08.577389',1),(22,4,'/uploads/1742882840567.png','2025-03-25 06:07:20.606101',1),(23,4,'/uploads/1742882841184.png','2025-03-25 06:07:21.192159',1),(24,4,'/uploads/1742884031302.png','2025-03-25 06:27:11.324061',1),(25,3,'/uploads/1742963151257.png','2025-03-26 04:25:51.315986',1),(26,6,'/uploads/1743070946843.png','2025-03-27 10:22:26.861774',1),(27,6,'/uploads/1743071005284.png','2025-03-27 10:23:25.296275',1),(28,9,'/uploads/1743071237756.png','2025-03-27 10:27:17.787257',1),(29,1,'/uploads/1743072169480.png','2025-03-27 10:42:49.502094',1),(30,1,'/uploads/1743072737644.png','2025-03-27 10:52:17.673029',1),(31,12,'/uploads/1743410562513.png','2025-03-31 08:42:42.539916',1),(32,12,'/uploads/1743415069754.png','2025-03-31 09:57:49.775121',1),(33,5,'/uploads/1743659316214.jpeg','2025-04-03 05:48:36.276929',1),(34,NULL,'/uploads/1743659983468.png','2025-04-03 05:59:43.591854',1),(35,9,'/uploads/1743662015141.jpg','2025-04-03 06:33:35.172837',1),(36,9,'/uploads/1743662152446.jpeg','2025-04-03 06:35:52.462732',1),(37,18,'/uploads/1743662332535.jpg','2025-04-03 06:38:52.579440',1),(38,18,'/uploads/1743662781439.jpeg','2025-04-03 06:46:21.526871',1),(39,19,'/uploads/1743662827394.jpeg','2025-04-03 06:47:07.436511',1),(40,NULL,'/uploads/1743662987154.jpeg','2025-04-03 06:49:47.175332',1),(41,NULL,'/uploads/1743663041950.jpeg','2025-04-03 06:50:41.978308',1),(42,20,'/uploads/1743663060066.jpg','2025-04-03 06:51:00.091597',1),(43,NULL,'/uploads/1743663671623.jpeg','2025-04-03 07:01:11.722066',1),(44,NULL,'http://localhost:8081/uploads/1743664574952.png','2025-04-03 07:16:15.037847',1),(45,27,'http://localhost:8081/uploads/1743664890813.jpeg','2025-04-03 07:21:30.918864',1),(46,28,'http://localhost:8081/uploads/1743665052985.jpeg','2025-04-03 07:24:13.036954',1),(47,NULL,'http://localhost:8081/uploads/1743665297639.jpeg','2025-04-03 07:28:17.681962',1),(48,1,'http://localhost:8081/uploads/1743665463388.png','2025-04-03 07:31:03.440259',1),(49,2,'http://localhost:8081/uploads/1743666205793.png','2025-04-03 07:43:25.866702',1),(50,2,'http://localhost:8081/uploads/1743666430168.jpeg','2025-04-03 07:47:10.284276',1),(51,2,'http://localhost:8081/uploads/1743666927649.jpeg','2025-04-03 07:55:27.766138',1),(52,NULL,'http://localhost:8081/uploads/1743743516666.jpeg','2025-04-04 05:11:56.951271',1),(53,35,'http://localhost:8081/uploads/1744292469782.png','2025-04-10 13:41:09.838124',1),(54,35,'http://localhost:8081/uploads/1744292507837.png','2025-04-10 13:41:47.858876',1),(55,35,'http://localhost:8081/uploads/1744292548203.png','2025-04-10 13:42:28.218515',1),(56,1,'http://localhost:8081/uploads/1744292822882.png','2025-04-10 13:47:02.902153',1),(57,30,'http://localhost:8081/uploads/1744293481204.png','2025-04-10 13:58:01.235347',1),(58,NULL,'http://localhost:8081/uploads/1744293551245.png','2025-04-10 13:59:11.267343',1),(59,NULL,'http://localhost:8081/uploads/1744293658997.png','2025-04-10 14:00:59.059036',1),(60,35,'http://localhost:8081/uploads/1744293690880.png','2025-04-10 14:01:30.919007',1),(61,35,'http://localhost:8081/uploads/1744293879380.png','2025-04-10 14:04:39.562958',1),(62,35,'http://localhost:8081/uploads/1744293901975.png','2025-04-10 14:05:01.996086',1),(63,35,'http://localhost:8081/uploads/1744294001125.png','2025-04-10 14:06:41.176734',1),(64,35,'http://localhost:8081/uploads/1744294058377.png','2025-04-10 14:07:38.410080',1),(65,35,'http://localhost:8081/uploads/1744294278041.png','2025-04-10 14:11:18.099268',1);
/*!40000 ALTER TABLE `ins_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ins_locations`
--

DROP TABLE IF EXISTS `ins_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `label` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_locations`
--

LOCK TABLES `ins_locations` WRITE;
/*!40000 ALTER TABLE `ins_locations` DISABLE KEYS */;
INSERT INTO `ins_locations` VALUES (1,28.4179983,77.1030098,'Office 1','2025-04-04 08:20:53.000000',1),(2,28.9930836,77.0470837,'Office 2','2025-04-04 08:20:53.000000',1),(3,28.9930824,77.0150736,'Office 3','2025-04-04 08:20:53.000000',1),(4,28.985126422690417,77.13693242543762,'Office 5','2025-04-04 08:20:53.000000',1),(5,28.99337830350321,77.01372223127251,'Office 7','2025-04-04 08:20:53.000000',1),(6,28.965306684230228,76.93969190332068,'Office 8','2025-04-04 08:20:53.000000',1),(7,28.413580895720756,77.1614789366312,'Office 9','2025-04-04 08:20:53.000000',1),(8,28.40617984291001,77.13431797868928,'Office 10','2025-04-04 08:20:53.000000',1),(9,28.427088420616755,76.4687052670486,'Office 11','2025-04-04 09:16:58.000000',1),(10,28.42950937048511,76.4693027247205,'Office 12','2025-04-04 09:18:37.000000',1),(11,28.41722326127954,76.46677418239167,'Office 13','2025-04-04 09:19:14.000000',1),(12,28.4375040518212,76.46001388074045,'Office 14','2025-04-04 09:19:53.000000',1),(13,28.329046849782443,76.52173418238834,'Office 15','2025-04-04 09:22:00.000000',1),(14,28.329046849782443,76.52173418238834,'Office 15','2025-04-04 09:22:32.000000',1);
/*!40000 ALTER TABLE `ins_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ins_menus`
--

DROP TABLE IF EXISTS `ins_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_bc39882d3632ba60f85760fbcd9` (`courseId`),
  CONSTRAINT `FK_bc39882d3632ba60f85760fbcd9` FOREIGN KEY (`courseId`) REFERENCES `ins_courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_menus`
--

LOCK TABLES `ins_menus` WRITE;
/*!40000 ALTER TABLE `ins_menus` DISABLE KEYS */;
INSERT INTO `ins_menus` VALUES (1,1,'SQL Home','2025-03-31 10:51:05.057726',1),(2,1,'SQL Introduction','2025-03-31 10:51:05.057726',1),(3,1,'SQL Syntax','2025-03-31 10:51:05.057726',1),(4,2,'HTML Home','2025-03-31 10:51:05.057726',1),(5,2,'HTML Introduction','2025-03-31 10:51:05.057726',1),(6,2,'HTML Elements','2025-03-31 10:51:05.057726',1),(7,3,'CSS Home','2025-03-31 10:51:05.057726',1),(8,3,'CSS Syntax','2025-03-31 10:51:05.057726',1),(9,4,'JS Home','2025-03-31 10:51:05.057726',1),(10,4,'JS Basics','2025-03-31 10:51:05.057726',1),(11,1,'jknkqwqd','2025-03-31 10:51:05.057726',1),(12,11,'hello','2025-03-31 10:51:05.057726',1),(13,11,'Hii test2','2025-03-31 10:51:05.057726',1),(14,11,'TEST3','2025-03-31 10:51:05.057726',1),(15,2,'HTML SYNTAX','2025-03-31 10:51:05.057726',1),(16,4,'JS Advance','2025-03-31 10:51:05.057726',1),(17,4,'JS ULTRA','2025-03-31 11:14:36.353618',1),(18,12,'Redux Intro','2025-04-01 06:36:49.238587',1),(19,12,'Redux Syntax','2025-04-01 06:40:10.573443',1),(20,12,'Redux Menu','2025-04-01 06:51:43.185257',1),(27,12,'feew','2025-04-01 08:26:23.368849',1),(28,15,'intro','2025-04-02 05:43:44.022650',1),(29,15,'try','2025-04-07 11:03:42.117589',1),(30,11,'test','2025-04-08 09:52:36.345494',1),(32,25,'2','2025-04-10 12:33:00.124732',1),(33,28,'hii','2025-04-10 12:39:09.227377',1),(34,28,'2','2025-04-10 12:48:26.920110',1),(35,28,'3','2025-04-10 12:51:09.383564',1),(36,28,'4','2025-04-10 12:51:54.295579',1),(37,25,'3','2025-04-10 13:48:49.661466',1);
/*!40000 ALTER TABLE `ins_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ins_meta_title`
--

DROP TABLE IF EXISTS `ins_meta_title`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_meta_title` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7c5441ee4fb9bb853153758f4a` (`page`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_meta_title`
--

LOCK TABLES `ins_meta_title` WRITE;
/*!40000 ALTER TABLE `ins_meta_title` DISABLE KEYS */;
INSERT INTO `ins_meta_title` VALUES (1,'/login','Login | My Website','2025-03-31 10:51:11.500192',1),(2,'/register','Register | My Website','2025-03-31 10:51:11.500192',1),(3,'/home','Home | My Website','2025-03-31 10:51:11.500192',1),(4,'/course/1','SQL Course | My Website','2025-03-31 10:51:11.500192',1),(5,'/course/2','HTML Course | My Website','2025-03-31 10:51:11.500192',1),(6,'/course/3','CSS Course | My Website','2025-03-31 10:51:11.500192',1),(7,'/course/4','JavaScript Course | My Website','2025-03-31 10:51:11.500192',1),(8,'/menu/1','SQL Home','2025-03-31 10:51:11.500192',1),(9,'/menu/2','SQL Introduction','2025-03-31 10:51:11.500192',1),(10,'/menu/3','SQL Syntax','2025-03-31 10:51:11.500192',1),(11,'/menu/7','CSS Home','2025-03-31 10:51:11.500192',1),(12,'/menu/8','CSS Syntax','2025-03-31 10:51:11.500192',1),(13,'/menu/4','HTML HOME','2025-03-31 10:51:11.500192',1),(14,'/menu/5','HTML Introduction','2025-03-31 10:51:11.500192',1),(15,'/menu/6','HTML Elements','2025-03-31 10:51:11.500192',1),(16,'/menu/9','JS Home','2025-03-31 10:51:11.500192',1),(17,'/menu/10','JS Basics','2025-03-31 10:51:11.500192',1);
/*!40000 ALTER TABLE `ins_meta_title` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ins_users`
--

DROP TABLE IF EXISTS `ins_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_127b916f7dc4ca4f8150c64903` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_users`
--

LOCK TABLES `ins_users` WRITE;
/*!40000 ALTER TABLE `ins_users` DISABLE KEYS */;
INSERT INTO `ins_users` VALUES (1,'Pankaj','pgarg9355@gmail.com','$2b$10$j8qDOobuIFsJz13D6uB0AO8Mrzic/md5cRUskzM2.crsR2SWjG1hS','admin','2025-03-31 10:49:02.822862',1,'28.9930823','77.0150735'),(8,'Pankaj','ecom.test.webdev@gmail.com',NULL,'user','2025-04-04 15:37:34.226059',1,'28.4187198','76.4671957'),(11,'PANKAJ PANKA','21001008049@jcboseust.ac.in',NULL,'user','2025-04-08 09:49:55.965187',1,'28.9930823','77.0150735'),(12,'1','1@a.com','$2b$10$LokECt/Yr7XzeHv67h1PiObT84g9B6O3DP0T4Qx1xqcHpQYd6kQsK','user','2025-04-08 09:59:57.721724',1,'28.9930823','77.0150735'),(13,'Pankaj Garg','pankaj.garg@cardekho.com',NULL,'user','2025-04-10 04:59:21.355975',1,'28.9930823','77.0150735');
/*!40000 ALTER TABLE `ins_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10 20:54:00
