-- phpMyAdmin SQL Dump
-- version 4.4.15
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 09, 2018 at 06:59 PM
-- Server version: 5.6.37-82.2
-- PHP Version: 5.4.45

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oen432_sklepsms`
--

-- --------------------------------------------------------

--
-- Table structure for table `apis`
--

CREATE TABLE IF NOT EXISTS `apis` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log` text COLLATE utf8_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE IF NOT EXISTS `members` (
  `id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL,
  `pass_hash` varchar(8) NOT NULL,
  `cookie` varchar(32) DEFAULT NULL,
  `active` tinyint(4) NOT NULL DEFAULT '0',
  `email` varchar(64) NOT NULL,
  `act_code` varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `networks`
--

CREATE TABLE IF NOT EXISTS `networks` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `partners` text COLLATE utf8_unicode_ci,
  `web_page` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `license_update` timestamp NULL DEFAULT NULL,
  `license_expire` timestamp NULL DEFAULT NULL,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `trial` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `network_apis`
--

CREATE TABLE IF NOT EXISTS `network_apis` (
  `id` int(11) NOT NULL,
  `api_id` int(11) NOT NULL,
  `net_id` int(11) NOT NULL,
  `title` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `api_key` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `network_services`
--

CREATE TABLE IF NOT EXISTS `network_services` (
  `network_id` int(11) NOT NULL,
  `service_id` varchar(16) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifis`
--

CREATE TABLE IF NOT EXISTS `notifis` (
  `id` int(11) NOT NULL,
  `title` text COLLATE utf8_unicode_ci NOT NULL,
  `desc` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifis_read`
--

CREATE TABLE IF NOT EXISTS `notifis_read` (
  `id` int(11) NOT NULL,
  `not_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `players_flags`
--

CREATE TABLE IF NOT EXISTS `players_flags` (
  `id` int(11) NOT NULL,
  `server` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `auth_data` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(34) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `a` int(11) NOT NULL DEFAULT '0',
  `b` int(11) NOT NULL DEFAULT '0',
  `c` int(11) NOT NULL DEFAULT '0',
  `d` int(11) NOT NULL DEFAULT '0',
  `e` int(11) NOT NULL DEFAULT '0',
  `f` int(11) NOT NULL DEFAULT '0',
  `g` int(11) NOT NULL DEFAULT '0',
  `h` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0',
  `j` int(11) NOT NULL DEFAULT '0',
  `k` int(11) NOT NULL DEFAULT '0',
  `l` int(11) NOT NULL DEFAULT '0',
  `m` int(11) NOT NULL DEFAULT '0',
  `n` int(11) NOT NULL DEFAULT '0',
  `o` int(11) NOT NULL DEFAULT '0',
  `p` int(11) NOT NULL DEFAULT '0',
  `q` int(11) NOT NULL DEFAULT '0',
  `r` int(11) NOT NULL DEFAULT '0',
  `s` int(11) NOT NULL DEFAULT '0',
  `t` int(11) NOT NULL DEFAULT '0',
  `u` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `v` int(11) NOT NULL DEFAULT '0',
  `w` int(11) NOT NULL DEFAULT '0',
  `x` int(11) NOT NULL DEFAULT '0',
  `z` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` text COLLATE utf8_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Otwarty','Zamknięty') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Otwarty'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports_answers`
--

CREATE TABLE IF NOT EXISTS `reports_answers` (
  `id` int(11) NOT NULL,
  `rep_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE IF NOT EXISTS `servers` (
  `id` int(11) NOT NULL,
  `net_id` int(11) NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `ip_address` varchar(22) COLLATE utf8_unicode_ci NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shop_version` varchar(6) COLLATE utf8_unicode_ci NOT NULL DEFAULT '1.0.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `server_services`
--

CREATE TABLE IF NOT EXISTS `server_services` (
  `id` int(11) NOT NULL,
  `service_id` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `server_id` int(11) NOT NULL,
  `prices` text COLLATE utf8_unicode_ci,
  `prices_json` text COLLATE utf8_unicode_ci,
  `flags` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `weapon_id` int(11) DEFAULT NULL,
  `api` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL,
  `service_id` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `service_title` text COLLATE utf8_unicode_ci NOT NULL,
  `service_description` text COLLATE utf8_unicode_ci NOT NULL,
  `service_suffix` text COLLATE utf8_unicode_ci NOT NULL,
  `service_type` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services_bought`
--

CREATE TABLE IF NOT EXISTS `services_bought` (
  `id` int(11) NOT NULL,
  `server_id` int(11) NOT NULL,
  `service_id` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `player` text COLLATE utf8_unicode_ci NOT NULL,
  `sms_code` text COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `cost` double(4,2) NOT NULL,
  `income` double(3,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `updates`
--

CREATE TABLE IF NOT EXISTS `updates` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` varchar(8) COLLATE utf8_unicode_ci NOT NULL,
  `text` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apis`
--
ALTER TABLE `apis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id` (`id`),
  ADD KEY `id_2` (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `networks`
--
ALTER TABLE `networks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `web_page` (`web_page`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `network_apis`
--
ALTER TABLE `network_apis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `network_services`
--
ALTER TABLE `network_services`
  ADD UNIQUE KEY `ss` (`service_id`,`network_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `network_services_ibfk_1` (`network_id`);

--
-- Indexes for table `notifis`
--
ALTER TABLE `notifis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `notifis_read`
--
ALTER TABLE `notifis_read`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `players_flags`
--
ALTER TABLE `players_flags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `reports_answers`
--
ALTER TABLE `reports_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ip_address` (`ip_address`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `server_services`
--
ALTER TABLE `server_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ss` (`server_id`,`service_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`),
  ADD UNIQUE KEY `service_id` (`service_id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `services_bought`
--
ALTER TABLE `services_bought`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `id_2` (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `updates`
--
ALTER TABLE `updates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `version` (`version`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apis`
--
ALTER TABLE `apis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `networks`
--
ALTER TABLE `networks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `network_apis`
--
ALTER TABLE `network_apis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `notifis`
--
ALTER TABLE `notifis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `notifis_read`
--
ALTER TABLE `notifis_read`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `players_flags`
--
ALTER TABLE `players_flags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `reports_answers`
--
ALTER TABLE `reports_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `server_services`
--
ALTER TABLE `server_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `services_bought`
--
ALTER TABLE `services_bought`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `updates`
--
ALTER TABLE `updates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `network_services`
--
ALTER TABLE `network_services`
  ADD CONSTRAINT `network_services_ibfk_1` FOREIGN KEY (`network_id`) REFERENCES `networks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `network_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `server_services`
--
ALTER TABLE `server_services`
  ADD CONSTRAINT `server_services_ibfk_1` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `server_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
