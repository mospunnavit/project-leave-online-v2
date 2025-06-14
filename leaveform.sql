-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jun 14, 2025 at 09:59 AM
-- Server version: 9.3.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Leave_Test`
--

-- --------------------------------------------------------

--
-- Table structure for table `leaveform`
--

CREATE TABLE `leaveform` (
  `id` int NOT NULL,
  `u_id` int NOT NULL,
  `leave_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `reason` text,
  `status` enum('waiting for head approval','waiting for manager approval','waiting for hr approval','rejected by head','rejected by hr','rejected by manager','approved','waiting') DEFAULT 'waiting',
  `image_filename` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `leaveshift` varchar(20) DEFAULT NULL,
  `lt_code` varchar(20) DEFAULT NULL,
  `lc_code` varchar(20) DEFAULT NULL,
  `usequotaleave` decimal(5,2) DEFAULT NULL,
  `exported` tinyint(1) DEFAULT '0',
  `exported_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leaveform`
--

INSERT INTO `leaveform` (`id`, `u_id`, `leave_date`, `start_time`, `end_time`, `reason`, `status`, `image_filename`, `submitted_at`, `leaveshift`, `lt_code`, `lc_code`, `usequotaleave`, `exported`, `exported_at`) VALUES
(69, 16, '2025-06-05', '08:00:00', '17:00:00', '123', 'approved', NULL, '2025-06-05 07:46:19', 'กะเช้า', '020003', '20003', 1.00, 0, NULL),
(70, 16, '2025-06-05', '20:00:00', '04:30:00', '1212312121', 'approved', NULL, '2025-06-05 07:47:34', 'กะดึก', '020003', '20003', 1.00, 0, NULL),
(71, 16, '2025-06-13', '08:00:00', '17:00:00', '555', 'approved', NULL, '2025-06-05 07:48:09', 'กะเช้า', '020006', '20003', 1.00, 0, NULL),
(72, 16, '2025-06-15', '20:00:00', '04:30:00', 'ขก', 'approved', 'upload_08081749109983810.png', '2025-06-05 07:53:04', 'กะดึก', '020004', '20003', 1.00, 0, NULL),
(73, 16, '2025-06-13', '08:00:00', '15:00:00', '1591', 'approved', NULL, '2025-06-05 07:56:10', 'กะเช้า', '020003', '20003', 0.75, 0, NULL),
(74, 13, '2025-07-10', '08:00:00', '17:00:00', 'ขกมาก', 'approved', NULL, '2025-06-06 01:33:36', 'กะเช้า', '020005', '20003', 1.00, 0, NULL),
(75, 13, '2025-08-28', '08:00:00', '12:00:00', 'ง่วง', 'approved', 'upload_ITmanager1749173742050.jpg', '2025-06-06 01:35:42', 'กะเช้า', '020004', '20004', 0.50, 0, NULL),
(76, 13, '2025-07-03', '20:00:00', '04:30:00', 'อยากลาออก', 'waiting for hr approval', NULL, '2025-06-06 02:01:01', 'กะดึก', '020003', '20003', 1.00, 0, NULL),
(77, 14, '2025-06-07', '08:00:00', '17:00:00', '12', 'approved', NULL, '2025-06-06 03:09:09', 'กะเช้า', '020003', '20003', 1.00, 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `leaveform`
--
ALTER TABLE `leaveform`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `fk_lt_id` (`lt_code`),
  ADD KEY `fk_lc_code` (`lc_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `leaveform`
--
ALTER TABLE `leaveform`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leaveform`
--
ALTER TABLE `leaveform`
  ADD CONSTRAINT `fk_lc_code` FOREIGN KEY (`lc_code`) REFERENCES `leave_conditions` (`lc_code`),
  ADD CONSTRAINT `fk_lt_id` FOREIGN KEY (`lt_code`) REFERENCES `leave_types` (`lt_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
