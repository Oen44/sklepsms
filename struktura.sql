-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Czas generowania: 18 Kwi 2017, 17:27
-- Wersja serwera: 10.1.21-MariaDB-cll-lve
-- Wersja PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `jaszcz12_shop`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_antispam_questions`
--

CREATE TABLE `ss_antispam_questions` (
  `id` int(11) NOT NULL,
  `question` varchar(128) NOT NULL,
  `answers` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_bought_services`
--

CREATE TABLE `ss_bought_services` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `payment` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `payment_id` varchar(16) NOT NULL,
  `service` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `server` int(11) NOT NULL,
  `amount` varchar(32) NOT NULL DEFAULT '',
  `auth_data` varchar(32) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `extra_data` varchar(256) NOT NULL DEFAULT '',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_groups`
--

CREATE TABLE `ss_groups` (
  `id` int(11) NOT NULL,
  `name` text COLLATE utf8_bin NOT NULL,
  `acp` tinyint(1) NOT NULL DEFAULT '0',
  `manage_settings` tinyint(1) NOT NULL DEFAULT '0',
  `view_groups` tinyint(1) NOT NULL DEFAULT '0',
  `manage_groups` tinyint(1) NOT NULL DEFAULT '0',
  `view_player_flags` tinyint(1) NOT NULL DEFAULT '0',
  `view_user_services` tinyint(1) NOT NULL DEFAULT '0',
  `manage_user_services` tinyint(1) NOT NULL DEFAULT '0',
  `view_income` tinyint(1) NOT NULL DEFAULT '0',
  `view_users` tinyint(1) NOT NULL DEFAULT '0',
  `manage_users` tinyint(1) NOT NULL DEFAULT '0',
  `view_sms_codes` tinyint(1) NOT NULL DEFAULT '0',
  `manage_sms_codes` tinyint(1) NOT NULL DEFAULT '0',
  `view_service_codes` tinyint(1) NOT NULL DEFAULT '0',
  `manage_service_codes` tinyint(1) NOT NULL DEFAULT '0',
  `view_antispam_questions` tinyint(1) NOT NULL DEFAULT '0',
  `manage_antispam_questions` tinyint(1) NOT NULL DEFAULT '0',
  `view_services` tinyint(1) NOT NULL DEFAULT '0',
  `manage_services` tinyint(1) NOT NULL DEFAULT '0',
  `view_servers` tinyint(1) NOT NULL DEFAULT '0',
  `manage_servers` tinyint(1) NOT NULL DEFAULT '0',
  `view_logs` tinyint(1) NOT NULL DEFAULT '0',
  `manage_logs` tinyint(1) NOT NULL DEFAULT '0',
  `update` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_logs`
--

CREATE TABLE `ss_logs` (
  `id` int(11) NOT NULL,
  `text` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_mybb_user_group`
--

CREATE TABLE `ss_mybb_user_group` (
  `uid` int(11) NOT NULL,
  `gid` int(11) NOT NULL,
  `expire` timestamp NULL DEFAULT NULL,
  `was_before` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_payment_admin`
--

CREATE TABLE `ss_payment_admin` (
  `id` int(11) NOT NULL,
  `aid` int(11) NOT NULL,
  `ip` varchar(16) NOT NULL,
  `platform` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_payment_code`
--

CREATE TABLE `ss_payment_code` (
  `id` int(11) NOT NULL,
  `code` varchar(16) NOT NULL,
  `ip` varchar(16) NOT NULL,
  `platform` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_payment_sms`
--

CREATE TABLE `ss_payment_sms` (
  `id` int(11) NOT NULL,
  `code` varchar(16) CHARACTER SET utf8 NOT NULL,
  `income` int(11) NOT NULL,
  `cost` int(11) NOT NULL,
  `text` varchar(32) CHARACTER SET utf8 NOT NULL,
  `number` varchar(16) CHARACTER SET utf8 NOT NULL,
  `ip` varchar(16) CHARACTER SET utf8 NOT NULL,
  `platform` text CHARACTER SET utf8 NOT NULL,
  `free` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_payment_transfer`
--

CREATE TABLE `ss_payment_transfer` (
  `id` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `income` int(11) NOT NULL,
  `transfer_service` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `ip` varchar(16) NOT NULL,
  `platform` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_payment_wallet`
--

CREATE TABLE `ss_payment_wallet` (
  `id` int(11) NOT NULL,
  `cost` int(11) NOT NULL,
  `ip` varchar(16) NOT NULL,
  `platform` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_players_flags`
--

CREATE TABLE `ss_players_flags` (
  `id` int(11) NOT NULL,
  `server` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `auth_data` varchar(32) NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_pricelist`
--

CREATE TABLE `ss_pricelist` (
  `id` int(11) NOT NULL,
  `service` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `tariff` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `server` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_servers`
--

CREATE TABLE `ss_servers` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `ip` varchar(16) NOT NULL,
  `port` varchar(8) NOT NULL,
  `sms_service` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `type` varchar(16) NOT NULL DEFAULT '',
  `version` varchar(8) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_servers_services`
--

CREATE TABLE `ss_servers_services` (
  `server_id` int(11) NOT NULL,
  `service_id` varchar(16) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_services`
--

CREATE TABLE `ss_services` (
  `id` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(32) NOT NULL,
  `short_description` varchar(28) NOT NULL,
  `description` text NOT NULL,
  `types` int(11) NOT NULL DEFAULT '0',
  `tag` varchar(16) NOT NULL,
  `module` varchar(32) NOT NULL DEFAULT '',
  `groups` text NOT NULL,
  `flags` varchar(25) NOT NULL DEFAULT '',
  `order` int(4) NOT NULL DEFAULT '1',
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_service_codes`
--

CREATE TABLE `ss_service_codes` (
  `id` int(11) NOT NULL,
  `code` varchar(16) NOT NULL,
  `service` varchar(16) NOT NULL,
  `server` int(11) NOT NULL DEFAULT '0',
  `tariff` int(11) NOT NULL DEFAULT '0',
  `uid` int(11) NOT NULL DEFAULT '0',
  `amount` double NOT NULL DEFAULT '0',
  `data` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_settings`
--

CREATE TABLE `ss_settings` (
  `key` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `value` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_sms_codes`
--

CREATE TABLE `ss_sms_codes` (
  `id` int(11) NOT NULL,
  `code` varchar(16) CHARACTER SET utf8 NOT NULL,
  `tariff` int(11) NOT NULL,
  `free` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_sms_numbers`
--

CREATE TABLE `ss_sms_numbers` (
  `number` varchar(16) NOT NULL,
  `tariff` int(11) NOT NULL,
  `service` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_tariffs`
--

CREATE TABLE `ss_tariffs` (
  `id` int(11) NOT NULL,
  `provision` int(11) NOT NULL DEFAULT '0',
  `predefined` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_transaction_services`
--

CREATE TABLE `ss_transaction_services` (
  `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(32) NOT NULL,
  `data` varchar(512) NOT NULL,
  `data_hidden` varchar(256) NOT NULL,
  `sms` tinyint(1) NOT NULL DEFAULT '0',
  `transfer` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_users`
--

CREATE TABLE `ss_users` (
  `uid` int(11) NOT NULL,
  `username` varchar(64) CHARACTER SET utf8 NOT NULL,
  `password` varchar(128) CHARACTER SET utf8 NOT NULL,
  `salt` varchar(8) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(128) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `forename` varchar(32) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `surname` varchar(64) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `groups` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '1',
  `regdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastactiv` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `wallet` int(11) NOT NULL DEFAULT '0',
  `regip` varchar(16) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `lastip` varchar(16) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `reset_password_key` varchar(32) CHARACTER SET utf8 NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_user_service`
--

CREATE TABLE `ss_user_service` (
  `id` int(11) NOT NULL,
  `service` varchar(16) COLLATE utf8_bin NOT NULL,
  `uid` int(11) NOT NULL,
  `expire` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_user_service_extra_flags`
--

CREATE TABLE `ss_user_service_extra_flags` (
  `us_id` int(11) NOT NULL,
  `service` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `server` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `auth_data` varchar(64) NOT NULL,
  `password` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `ss_user_service_mybb_extra_groups`
--

CREATE TABLE `ss_user_service_mybb_extra_groups` (
  `us_id` int(11) NOT NULL,
  `service` varchar(16) COLLATE utf8_bin NOT NULL,
  `mybb_uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indexes for table `ss_antispam_questions`
--
ALTER TABLE `ss_antispam_questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_bought_services`
--
ALTER TABLE `ss_bought_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderid` (`id`);

--
-- Indexes for table `ss_groups`
--
ALTER TABLE `ss_groups`
  ADD UNIQUE KEY `gid` (`id`);

--
-- Indexes for table `ss_logs`
--
ALTER TABLE `ss_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_mybb_user_group`
--
ALTER TABLE `ss_mybb_user_group`
  ADD PRIMARY KEY (`uid`,`gid`);

--
-- Indexes for table `ss_payment_admin`
--
ALTER TABLE `ss_payment_admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `aid` (`aid`);

--
-- Indexes for table `ss_payment_code`
--
ALTER TABLE `ss_payment_code`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_payment_sms`
--
ALTER TABLE `ss_payment_sms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_payment_transfer`
--
ALTER TABLE `ss_payment_transfer`
  ADD UNIQUE KEY `orderid` (`id`);

--
-- Indexes for table `ss_payment_wallet`
--
ALTER TABLE `ss_payment_wallet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_players_flags`
--
ALTER TABLE `ss_players_flags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `server+type+player` (`server`,`type`,`auth_data`);

--
-- Indexes for table `ss_pricelist`
--
ALTER TABLE `ss_pricelist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `price` (`service`,`tariff`,`server`);

--
-- Indexes for table `ss_servers`
--
ALTER TABLE `ss_servers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_servers_services`
--
ALTER TABLE `ss_servers_services`
  ADD UNIQUE KEY `ss` (`server_id`,`service_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `ss_services`
--
ALTER TABLE `ss_services`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_service_codes`
--
ALTER TABLE `ss_service_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_settings`
--
ALTER TABLE `ss_settings`
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `ss_sms_codes`
--
ALTER TABLE `ss_sms_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_sms_numbers`
--
ALTER TABLE `ss_sms_numbers`
  ADD UNIQUE KEY `numbertextservice` (`number`,`service`),
  ADD KEY `tariff` (`tariff`),
  ADD KEY `service` (`service`);

--
-- Indexes for table `ss_tariffs`
--
ALTER TABLE `ss_tariffs`
  ADD UNIQUE KEY `tariff` (`id`);

--
-- Indexes for table `ss_transaction_services`
--
ALTER TABLE `ss_transaction_services`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ss_users`
--
ALTER TABLE `ss_users`
  ADD UNIQUE KEY `uid` (`uid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `emial` (`email`);

--
-- Indexes for table `ss_user_service`
--
ALTER TABLE `ss_user_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service` (`service`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `ss_user_service_extra_flags`
--
ALTER TABLE `ss_user_service_extra_flags`
  ADD PRIMARY KEY (`us_id`),
  ADD UNIQUE KEY `server` (`server`,`service`,`type`,`auth_data`),
  ADD KEY `service` (`service`);

--
-- Indexes for table `ss_user_service_mybb_extra_groups`
--
ALTER TABLE `ss_user_service_mybb_extra_groups`
  ADD UNIQUE KEY `user_service` (`us_id`),
  ADD UNIQUE KEY `service` (`service`,`mybb_uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `ss_antispam_questions`
--
ALTER TABLE `ss_antispam_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT dla tabeli `ss_bought_services`
--
ALTER TABLE `ss_bought_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3963;
--
-- AUTO_INCREMENT dla tabeli `ss_groups`
--
ALTER TABLE `ss_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT dla tabeli `ss_logs`
--
ALTER TABLE `ss_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16061;
--
-- AUTO_INCREMENT dla tabeli `ss_payment_admin`
--
ALTER TABLE `ss_payment_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
--
-- AUTO_INCREMENT dla tabeli `ss_payment_code`
--
ALTER TABLE `ss_payment_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- AUTO_INCREMENT dla tabeli `ss_payment_sms`
--
ALTER TABLE `ss_payment_sms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3063;
--
-- AUTO_INCREMENT dla tabeli `ss_payment_wallet`
--
ALTER TABLE `ss_payment_wallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT dla tabeli `ss_players_flags`
--
ALTER TABLE `ss_players_flags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3544;
--
-- AUTO_INCREMENT dla tabeli `ss_pricelist`
--
ALTER TABLE `ss_pricelist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=432;
--
-- AUTO_INCREMENT dla tabeli `ss_servers`
--
ALTER TABLE `ss_servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT dla tabeli `ss_service_codes`
--
ALTER TABLE `ss_service_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT dla tabeli `ss_sms_codes`
--
ALTER TABLE `ss_sms_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;
--
-- AUTO_INCREMENT dla tabeli `ss_users`
--
ALTER TABLE `ss_users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;
--
-- AUTO_INCREMENT dla tabeli `ss_user_service`
--
ALTER TABLE `ss_user_service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2948;
--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `ss_payment_admin`
--
ALTER TABLE `ss_payment_admin`
  ADD CONSTRAINT `ss_payment_admin_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `ss_users` (`uid`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `ss_pricelist`
--
ALTER TABLE `ss_pricelist`
  ADD CONSTRAINT `ss_pricelist_ibfk_1` FOREIGN KEY (`service`) REFERENCES `ss_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `ss_servers_services`
--
ALTER TABLE `ss_servers_services`
  ADD CONSTRAINT `ss_servers_services_ibfk_1` FOREIGN KEY (`server_id`) REFERENCES `ss_servers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ss_servers_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `ss_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `ss_sms_numbers`
--
ALTER TABLE `ss_sms_numbers`
  ADD CONSTRAINT `ss_sms_numbers_ibfk_1` FOREIGN KEY (`service`) REFERENCES `ss_transaction_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `ss_user_service`
--
ALTER TABLE `ss_user_service`
  ADD CONSTRAINT `ss_user_service_ibfk_1` FOREIGN KEY (`service`) REFERENCES `ss_services` (`id`) ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `ss_user_service_extra_flags`
--
ALTER TABLE `ss_user_service_extra_flags`
  ADD CONSTRAINT `ss_user_service_extra_flags_ibfk_1` FOREIGN KEY (`us_id`) REFERENCES `ss_user_service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ss_user_service_extra_flags_ibfk_2` FOREIGN KEY (`service`) REFERENCES `ss_services` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ss_user_service_extra_flags_ibfk_3` FOREIGN KEY (`server`) REFERENCES `ss_servers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `ss_user_service_mybb_extra_groups`
--
ALTER TABLE `ss_user_service_mybb_extra_groups`
  ADD CONSTRAINT `ss_user_service_mybb_extra_groups_ibfk_1` FOREIGN KEY (`us_id`) REFERENCES `ss_user_service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ss_user_service_mybb_extra_groups_ibfk_2` FOREIGN KEY (`service`) REFERENCES `ss_services` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
