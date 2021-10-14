-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 13, 2021 at 04:31 PM
-- Server version: 8.0.26
-- PHP Version: 7.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `baza`
--

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `courseid` int NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `duration` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`courseid`, `name`, `description`, `duration`) VALUES
(1, 'Java', 'Neki super opis', 125),
(2, 'C', 'Mnogo dobar opis', 70);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userid`, `name`, `mail`, `role`) VALUES
('6yp8XQd5goVDM7PKCMF9werb1uP2', 'Mata FonIs', 'mateja.ivanovic@fonis.rs', 'user'),
('7RtSkfrPJYRnYMzTUkjbFsqTgLk2', 's2ssss', 's2stest123@gmail.com', 'user'),
('b1gQFJuMdZNXi4gJdrxU1pl0ESc2', 'Matin Nalog', 'matin.nalog@gmail.com', 'admin'),
('Qp7zpUim6KOJ6EE3PUiA8V9c9AF3', 'Mateja Ivanovic', 'mateja.ivanovic1998@gmail.com', 'creator'),
('WlCNTSeUfVeQlwSWmlI6srAvLME3', 'Pera fontele', 'pera.ostojic@gmail.com', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `usercourse`
--

CREATE TABLE `usercourse` (
  `userid` varchar(100) NOT NULL,
  `courseid` int NOT NULL,
  `unlockedat` date DEFAULT NULL,
  `finishedat` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usercourse`
--

INSERT INTO `usercourse` (`userid`, `courseid`, `unlockedat`, `finishedat`) VALUES
('b1gQFJuMdZNXi4gJdrxU1pl0ESc2', 1, '2021-09-13', NULL),
('b1gQFJuMdZNXi4gJdrxU1pl0ESc2', 2, '2021-09-10', NULL),
('Qp7zpUim6KOJ6EE3PUiA8V9c9AF3', 1, '2021-09-01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userfingerprint`
--

CREATE TABLE `userfingerprint` (
  `fingerprintid` int NOT NULL,
  `userid` varchar(100) NOT NULL,
  `fingerprint` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `userfingerprint`
--

INSERT INTO `userfingerprint` (`fingerprintid`, `userid`, `fingerprint`) VALUES
(12, 'b1gQFJuMdZNXi4gJdrxU1pl0ESc2', '{\"gpu\": \"ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0, D3D11-30.0.14.7141)\", \"cores\": 8, \"screen\": \"[1153, 2048]\", \"platform\": \"Win32\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36\", \"colorDepth\": 24, \"pixelDepth\": 24, \"orientation\": \"landscape-primary\"}'),
(13, 'Qp7zpUim6KOJ6EE3PUiA8V9c9AF3', '{\"gpu\": \"ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0, D3D11-30.0.14.7141)\", \"cores\": 8, \"screen\": \"[864, 1536]\", \"platform\": \"Win32\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36\", \"colorDepth\": 24, \"pixelDepth\": 24, \"orientation\": \"landscape-primary\"}'),
(16, '6yp8XQd5goVDM7PKCMF9werb1uP2', '{\"gpu\": \"Adreno (TM) 540\", \"cores\": 8, \"screen\": \"[823, 412]\", \"platform\": \"Linux armv8l\", \"userAgent\": \"Mozilla/5.0 (Linux; Android 11; Pixel 2 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36\", \"colorDepth\": 24, \"pixelDepth\": 24, \"orientation\": \"portrait-primary\"}'),
(17, 'WlCNTSeUfVeQlwSWmlI6srAvLME3', '{\"gpu\": \"Adreno (TM) 650\", \"cores\": 5, \"screen\": \"[851, 393]\", \"platform\": \"Linux aarch64\", \"userAgent\": \"Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Mobile Safari/537.36\", \"colorDepth\": 24, \"pixelDepth\": 24, \"orientation\": \"portrait-primary\"}'),
(18, '7RtSkfrPJYRnYMzTUkjbFsqTgLk2', '{\"gpu\": \"ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0, D3D11-30.0.14.7141)\", \"cores\": 8, \"screen\": \"[1153, 2048]\", \"platform\": \"Win32\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36\", \"colorDepth\": 24, \"pixelDepth\": 24, \"orientation\": \"landscape-primary\"}'),
(27, 'b1gQFJuMdZNXi4gJdrxU1pl0ESc2', '{\"gpu\": \"ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0, D3D11-30.0.14.7141)\", \"cores\": 8, \"screen\": \"[864, 1536]\", \"platform\": \"Win32\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36\", \"colorDepth\": 24, \"pixelDepth\": 24, \"orientation\": \"landscape-primary\"}');

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `videoid` int NOT NULL,
  `courseid` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `duration` int DEFAULT NULL,
  `path` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`videoid`, `courseid`, `name`, `duration`, `path`) VALUES
(1, 1, '1) Prvi video', 22, '1/Java/1) Uvod/1) Prvi video'),
(2, 1, '2) Drugi video', 5, '1/Java/1) Uvod/2) Drugi video'),
(3, 1, '1) Nesto', 1, '1/Java/2) Druga oblast/1) Nesto'),
(4, 1, '2) Nesto drugo', 5, '1/Java/2) Druga oblast/2) Nesto drugo'),
(5, 2, 'pera', 2, '2/C/pera');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`courseid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userid`);

--
-- Indexes for table `usercourse`
--
ALTER TABLE `usercourse`
  ADD PRIMARY KEY (`userid`,`courseid`);

--
-- Indexes for table `userfingerprint`
--
ALTER TABLE `userfingerprint`
  ADD PRIMARY KEY (`fingerprintid`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`videoid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `courseid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `userfingerprint`
--
ALTER TABLE `userfingerprint`
  MODIFY `fingerprintid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `videoid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
