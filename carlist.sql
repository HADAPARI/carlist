-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 23 juin 2021 à 12:38
-- Version du serveur :  10.4.18-MariaDB
-- Version de PHP : 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `carlist`
--

-- --------------------------------------------------------

--
-- Structure de la table `car`
--

CREATE TABLE `car` (
  `id` int(11) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `mark` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `engine` varchar(10) NOT NULL,
  `kilometer` int(11) NOT NULL,
  `year` varchar(4) NOT NULL,
  `gearbox` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `car`
--

INSERT INTO `car` (`id`, `fileName`, `mark`, `model`, `description`, `engine`, `kilometer`, `year`, `gearbox`, `price`, `createdAt`, `updatedAt`) VALUES
(1, '1.webp', 'PEUGEOT', '2008', '1.2 PureTech 82ch E6.c Style S&S', 'Essence', 17105, '2018', 'Manuelle', 13679, '2021-06-23 01:49:35', '2021-06-23 01:49:35'),
(2, '2.jpg', 'SEAT', ' Arona ', '1.6 TDI 95ch Start/Stop Urban DSG Euro6d-T', 'Diesel', 12548, '2020', 'Automatique', 20890, '2021-06-23 01:52:02', '2021-06-23 01:52:02'),
(3, '3.jpg', 'RENAULT', ' Twingo', '0.9 TCe 90ch energy Intens', 'Essence', 42749, '2016', 'Manuelle', 8490, '2021-06-23 01:52:02', '2021-06-23 01:52:02'),
(4, '4.jpg', 'AUDI', ' Q3', '35 TFSI 150ch Design S tronic 7', 'Hybride', 9471, '2020', 'Automatique', 40990, '2021-06-23 01:58:53', '2021-06-23 01:58:53'),
(5, '5.jpg', 'CITROEN', ' C4 Cactus', 'PureTech 110ch S&S Shine EAT6', 'Essence', 41891, '2018', 'Automatique', 15990, '2021-06-23 01:58:53', '2021-06-23 01:58:53'),
(6, '6.jpg', 'FORD', ' Puma', '1.0 EcoBoost 155ch mHEV ST-Line X 7cv', 'Essence', 10, '2020', 'Manuelle', 23990, '2021-06-23 02:07:20', '2021-06-23 02:07:20'),
(7, '7.jpg', 'MERCEDES', 'Cla Shooting Brake', '200 d 150ch Progressive Line 8G-DCT', 'Diesel', 19682, '2020', 'Automatique', 36920, '2021-06-23 02:07:20', '2021-06-23 02:07:20'),
(8, '8.jpg', 'VOLKSWAGEN', ' Golf', '1.4 eHybrid 245ch GTE DSG6', 'Hybride R', 1000, '2021', 'Automatique', 41990, '2021-06-23 02:12:23', '2021-06-23 02:12:23');

-- --------------------------------------------------------

--
-- Structure de la table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `senderId` varchar(40) NOT NULL,
  `carId` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` varchar(40) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `car`
--
ALTER TABLE `car`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
