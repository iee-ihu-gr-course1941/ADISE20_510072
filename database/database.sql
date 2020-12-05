-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Dec 04, 2020 at 04:24 PM
-- Server version: 8.0.22
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `data`
--
CREATE DATABASE IF NOT EXISTS `data` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `data`;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int NOT NULL,
  `token` varchar(36) NOT NULL COMMENT 'uuidv4',
  `user_1_id` int NOT NULL,
  `user_2_id` int DEFAULT NULL,
  `status` enum('CREATED','STARTED','COMPLETED','ABANDONED') NOT NULL DEFAULT 'CREATED',
  `created_timestamp` int NOT NULL,
  `last_updated_timestamp` int NOT NULL,
  `ended_timestamp` int DEFAULT NULL,
  `locked` tinyint NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `games_history`
--

CREATE TABLE `games_history` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `current_player` enum('1','2') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `next_player` enum('1','2') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `board` json NOT NULL,
  `ended` tinyint NOT NULL DEFAULT '0',
  `draw` tinyint NOT NULL DEFAULT '0',
  `winner` enum('1','2') DEFAULT NULL,
  `timestamp` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL COMMENT 'sha256',
  `score` int NOT NULL DEFAULT '0',
  `registered_timestamp` int NOT NULL,
  `blocked` tinyint NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `status` (`status`),
  ADD KEY `created_timestamp` (`created_timestamp`),
  ADD KEY `ended_timestamp` (`ended_timestamp`),
  ADD KEY `locked` (`locked`),
  ADD KEY `user_1_id` (`user_1_id`) USING BTREE,
  ADD KEY `user_2_id` (`user_2_id`) USING BTREE;

--
-- Indexes for table `games_history`
--
ALTER TABLE `games_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timestamp` (`timestamp`),
  ADD KEY `ended` (`ended`),
  ADD KEY `draw` (`draw`),
  ADD KEY `game_id` (`game_id`) USING BTREE,
  ADD KEY `current_player` (`current_player`),
  ADD KEY `next_player` (`next_player`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `password` (`password`),
  ADD KEY `score` (`score`),
  ADD KEY `first_name` (`first_name`),
  ADD KEY `last_name` (`last_name`),
  ADD KEY `registered_timestamp` (`registered_timestamp`),
  ADD KEY `blocked` (`blocked`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `games_history`
--
ALTER TABLE `games_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
