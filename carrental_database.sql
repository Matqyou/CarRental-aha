CREATE DATABASE  IF NOT EXISTS `car_rental` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `car_rental`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: car_rental
-- ------------------------------------------------------
-- Server version	8.3.0

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
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrator` (
  `user_id` int NOT NULL,
  `admin_since` date NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrator`
--

LOCK TABLES `administrator` WRITE;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` VALUES (1,'2024-06-06');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `client_id` int NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(12) NOT NULL,
  `billing_address` varchar(64) NOT NULL,
  `card_information` varchar(16) NOT NULL,
  `is_active` tinyint NOT NULL,
  PRIMARY KEY (`client_id`),
  CONSTRAINT `client_id` FOREIGN KEY (`client_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'2024-06-06','25565815','my adres','2820498204982340',1),(14,'2024-06-15','25565815','my address','2838928390289038',1);
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `ticket_id` int NOT NULL,
  `send_date` date NOT NULL,
  `content` varchar(1024) NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `sender_id_idx` (`sender_id`),
  KEY `ticket_id_idx` (`ticket_id`),
  CONSTRAINT `sender_id` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `online_user`
--

DROP TABLE IF EXISTS `online_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `online_user` (
  `user_id` int NOT NULL,
  `session_id` varchar(16) NOT NULL,
  `session_started` date NOT NULL,
  `session_updated` date NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `onlineuser_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `online_user`
--

LOCK TABLES `online_user` WRITE;
/*!40000 ALTER TABLE `online_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `online_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `payer_id` int NOT NULL,
  `subscription_id` int NOT NULL,
  `amount` float NOT NULL,
  `due_date` date NOT NULL,
  `state` enum('Unpaid','Paid','Due') NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `payer_id_idx` (`payer_id`),
  KEY `subscription_id_idx` (`subscription_id`),
  CONSTRAINT `payer_id` FOREIGN KEY (`payer_id`) REFERENCES `client` (`client_id`),
  CONSTRAINT `subscription_id` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `subscriber_id` int NOT NULL,
  `vehicle_id` int NOT NULL,
  `creation_date` date NOT NULL,
  `begin_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`subscription_id`),
  KEY `subscriber_id_idx` (`subscriber_id`),
  KEY `vehicle_id_idx` (`vehicle_id`),
  CONSTRAINT `subscriber_id` FOREIGN KEY (`subscriber_id`) REFERENCES `client` (`client_id`),
  CONSTRAINT `vehicle_id` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
INSERT INTO `subscription` VALUES (3,1,7,'2024-06-05','2024-06-14','2024-06-15'),(4,1,7,'2024-06-05','2024-06-15','2024-06-16'),(5,1,7,'2024-06-05','2024-06-15','2024-06-16'),(6,1,7,'2024-06-05','2024-06-15','2024-06-16'),(7,1,7,'2024-06-05','2024-06-15','2024-06-16'),(8,1,7,'2024-06-05','2024-06-15','2024-06-16'),(9,1,7,'2024-06-05','2024-06-15','2024-06-16'),(10,1,7,'2024-06-05','2024-06-07','2024-06-05'),(11,1,7,'2024-06-05','2024-06-07','2024-06-05'),(12,1,7,'2024-06-05','2024-06-07','2024-06-05'),(13,1,7,'2024-06-05','2024-06-07','2024-06-05'),(14,1,7,'2024-06-05','2024-06-07','2024-06-05'),(15,1,7,'2024-06-05','2024-06-07','2024-06-05'),(16,1,7,'2024-06-05','2024-06-07','2024-06-05'),(17,1,7,'2024-06-05','2024-06-07','2024-06-05'),(18,1,7,'2024-06-05','2024-06-07','2024-06-05'),(19,1,7,'2024-06-05','2024-06-07','2024-06-05'),(20,1,7,'2024-06-05','2024-06-07','2024-06-05'),(21,1,7,'2024-06-05','2024-06-07','2024-06-05'),(22,1,7,'2024-06-05','2024-06-07','2024-06-05'),(23,1,7,'2024-06-05','2024-06-07','2024-06-05'),(24,1,7,'2024-06-05','2024-06-07','2024-06-05'),(25,1,7,'2024-06-05','2024-06-07','2024-06-05'),(26,1,7,'2024-06-05','2024-06-07','2024-06-05'),(27,1,7,'2024-06-05','2024-06-07','2024-06-05'),(28,1,7,'2024-06-05','2024-06-07','2024-06-05'),(29,1,7,'2024-06-05','2024-06-07','2024-06-05'),(30,1,7,'2024-06-05','2024-06-07','2024-06-05'),(31,1,7,'2024-06-05','2024-06-07','2024-06-05'),(32,1,7,'2024-06-05','2024-06-07','2024-06-05'),(33,1,7,'2024-06-05','2024-06-07','2024-06-05'),(34,1,7,'2024-06-05','2024-06-07','2024-06-05'),(35,1,7,'2024-06-05','2024-06-07','2024-06-05'),(36,1,7,'2024-06-05','2024-06-07','2024-06-05'),(37,1,7,'2024-06-05','2024-06-07','2024-06-05'),(38,1,7,'2024-06-05','2024-06-07','2024-06-05'),(39,1,7,'2024-06-05','2024-06-07','2024-06-05'),(40,1,7,'2024-06-05','2024-06-07','2024-06-08'),(41,1,7,'2024-06-05','2024-06-07','2024-06-08'),(42,1,1,'2024-06-05','2024-06-07','2024-06-14'),(43,1,7,'2024-06-06','2024-06-14','2024-06-15');
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int NOT NULL,
  `creation_date` date NOT NULL,
  `is_open` tinyint NOT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `creator_id_idx` (`creator_id`),
  CONSTRAINT `creator_id` FOREIGN KEY (`creator_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(64) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(64) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='no comment';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `last_commisioned` date DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` float NOT NULL,
  `seating_capacity` int NOT NULL,
  `transmission_type` enum('Automatic','Manual') NOT NULL,
  `times_ordered` int NOT NULL,
  `in_use` tinyint NOT NULL,
  `state` enum('GoodCondition','BadCondition','Unusable') NOT NULL,
  PRIMARY KEY (`vehicle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle` VALUES (1,NULL,'Toyota Camry','/cars/toyota_camry.jpg','A reliable sedan with great fuel efficiency.',50,5,'Automatic',500,0,'GoodCondition'),(2,NULL,'Honda Civic','/cars/honda_civic.jpg','A popular compact car known for its reliability.',45,5,'Automatic',1000,0,'GoodCondition'),(3,NULL,'Ford Mustang','/cars/ford_mustang.jpg','An iconic muscle car with powerful performance.',70,4,'Automatic',800,1,'GoodCondition'),(4,NULL,'Jeep Wrangler','/cars/jeep_wrangler.jpg','A rugged SUV ideal for off-road adventures.',60,4,'Automatic',600,0,'GoodCondition'),(5,NULL,'Toyota RAV4','/cars/toyota_rav4.jpg','A versatile compact SUV offering ample cargo space.',55,5,'Automatic',700,0,'GoodCondition'),(6,NULL,'Chevrolet Tahoe','/cars/chevrolet_tahoe.jpg','A full-size SUV with spacious interior and towing capabilities.',80,8,'Automatic',400,0,'GoodCondition'),(7,NULL,'Tesla Model S','/cars/tesla_model_s.jpg','A luxury electric sedan with cutting-edge technology.',100,5,'Automatic',1200,0,'GoodCondition'),(8,NULL,'BMW 3 Series','/cars/bmw_3_series.jpg','A premium compact sedan offering luxury and performance.',90,5,'Automatic',300,0,'GoodCondition'),(9,NULL,'Mercedes-Benz C-Class','/cars/mercedes_c_class.jpg','A luxury compact sedan with a refined interior.',95,5,'Automatic',100,1,'GoodCondition'),(10,NULL,'Nissan Rogue','/cars/nissan_rogue.jpg','A compact SUV with a comfortable interior and user-friendly features.',55,5,'Automatic',900,1,'GoodCondition');
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-06  4:09:10
