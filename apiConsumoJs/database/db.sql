-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2021 at 05:55 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_sushi`
--

-- --------------------------------------------------------

--
-- Table structure for table `adicionales`
--

CREATE TABLE `adicionales` (
  `id_adi` int(11) NOT NULL,
  `id_produ` int(11) DEFAULT NULL,
  `nombre` varchar(30) NOT NULL,
  `precio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `anexo`
--

CREATE TABLE `anexo` (
  `id_anexo` int(11) NOT NULL,
  `nombre` varchar(90) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `anexo`
--

INSERT INTO `anexo` (`id_anexo`, `nombre`) VALUES
(0, 'sushickae'),
(0, 'chusi');

-- --------------------------------------------------------

--
-- Table structure for table `direcciones`
--

CREATE TABLE `direcciones` (
  `id_direc` int(11) NOT NULL,
  `direccion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `direcciones`
--

INSERT INTO `direcciones` (`id_direc`, `direccion`) VALUES
(1, 'Av Alemana'),
(2, 'av bush');

-- --------------------------------------------------------

--
-- Table structure for table `pijo`
--

CREATE TABLE `pijo` (
  `id_seccion` int(11) NOT NULL,
  `nombre` varchar(40) DEFAULT NULL,
  `productos` varchar(49) DEFAULT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `imagen` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pijo`
--

INSERT INTO `pijo` (`id_seccion`, `nombre`, `productos`, `descripcion`, `precio`, `imagen`) VALUES
(1, 'sushickae', 'pija', 'erwfwer', NULL, NULL),
(2, NULL, 'pgerija', 'erwfgerwer', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pijo2`
--

CREATE TABLE `pijo2` (
  `id_seccion` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `productos` varchar(30) DEFAULT NULL,
  `descripcion` varchar(30) DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `imagen` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pijo2`
--

INSERT INTO `pijo2` (`id_seccion`, `nombre`, `productos`, `descripcion`, `precio`, `imagen`) VALUES
(1, 'chusi', 'pijo', 'afwefwe', NULL, NULL),
(2, NULL, 'pijo', 'afwefwe', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id_produ` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `precio` int(10) NOT NULL,
  `id_sec` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`id_produ`, `nombre`, `descripcion`, `precio`, `id_sec`) VALUES
(34, 'pija', '30', 0, 17),
(35, 'pijad', '40', 0, 17),
(37, 'nuevo', 'perro', 10, 17);

-- --------------------------------------------------------

--
-- Table structure for table `secciones`
--

CREATE TABLE `secciones` (
  `id_sec` int(11) NOT NULL,
  `id_direc` int(11) NOT NULL,
  `nombresec` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `secciones`
--

INSERT INTO `secciones` (`id_sec`, `id_direc`, `nombresec`) VALUES
(17, 2, 'perro chuto'),
(21, 2, 'pijochuto');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_name` varchar(16) NOT NULL,
  `password` varchar(60) NOT NULL,
  `id_direc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_name`, `password`, `id_direc`) VALUES
(2, 'alemana@sushicak', 'alemana123', 1),
(3, 'bush@sushicake.c', 'bush123', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adicionales`
--
ALTER TABLE `adicionales`
  ADD PRIMARY KEY (`id_adi`),
  ADD KEY `fk_adi_id_produ` (`id_produ`);

--
-- Indexes for table `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id_direc`);

--
-- Indexes for table `pijo`
--
ALTER TABLE `pijo`
  ADD PRIMARY KEY (`id_seccion`);

--
-- Indexes for table `pijo2`
--
ALTER TABLE `pijo2`
  ADD PRIMARY KEY (`id_seccion`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_produ`),
  ADD KEY `fk_pro_sec` (`id_sec`);

--
-- Indexes for table `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`id_sec`),
  ADD KEY `fk_sec_id_dir` (`id_direc`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_direc` (`id_direc`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adicionales`
--
ALTER TABLE `adicionales`
  MODIFY `id_adi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id_direc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pijo`
--
ALTER TABLE `pijo`
  MODIFY `id_seccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pijo2`
--
ALTER TABLE `pijo2`
  MODIFY `id_seccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_produ` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_sec` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adicionales`
--
ALTER TABLE `adicionales`
  ADD CONSTRAINT `fk_adi_id_produ` FOREIGN KEY (`id_produ`) REFERENCES `productos` (`id_produ`) ON DELETE CASCADE;

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_pro_sec` FOREIGN KEY (`id_sec`) REFERENCES `secciones` (`id_sec`) ON DELETE CASCADE;

--
-- Constraints for table `secciones`
--
ALTER TABLE `secciones`
  ADD CONSTRAINT `fk_sec_id_dir` FOREIGN KEY (`id_direc`) REFERENCES `direcciones` (`id_direc`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
