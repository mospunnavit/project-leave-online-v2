-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: May 24, 2025 at 10:02 AM
-- Server version: 8.0.42
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testdb`
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
  `leave_type` varchar(100) DEFAULT NULL,
  `status` enum('waiting for head approval','waiting for manager approval','waiting for hr approval','rejected by head','rejected by hr','rejected by manager','approved','waiting') DEFAULT 'waiting',
  `image_filename` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leaveform`
--

INSERT INTO `leaveform` (`id`, `u_id`, `leave_date`, `start_time`, `end_time`, `reason`, `leave_type`, `status`, `image_filename`, `submitted_at`) VALUES
(1, 1, '2025-05-25', '09:00:00', '12:00:00', 'ไปพบแพทย์', 'ลากิจ', 'approved', 'sick-note.jpg', '2025-05-23 09:57:58'),
(4, 1, '2025-05-25', '09:00:00', '12:00:00', 'ไปพบแพทย์', 'ลากิจ', 'rejected by head', 'sick-note.jpg', '2025-05-23 10:16:01'),
(5, 1, '2025-05-25', '09:00:00', '12:00:00', 'ไปพบแพทย์', 'ลากิจ', 'waiting for head approval', 'sick-note.jpg', '2025-05-23 10:16:03'),
(33, 3, '2025-05-25', '01:00:00', '12:00:00', 'ไม่สบาย', 'มีใบรับรองแพทย์', 'waiting for head approval', 'upload_IThead1747638013065.jpg', '2025-05-23 10:46:02'),
(55, 3, '2025-05-24', '16:31:00', '17:35:00', '11115555666', 'มีใบรับรองแพทย์', 'waiting for head approval', 'upload_johndoe1747981889528.png', '2025-05-23 06:31:30'),
(56, 12, '2025-05-25', '13:30:00', '14:30:00', '55', 'ไม่มีใบรับรองแพทย์', 'waiting for manager approval', NULL, '2025-05-24 02:41:45'),
(57, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'waiting for manager approval', NULL, '2025-05-24 02:47:47'),
(58, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'มีใบรับรองแพทย์', 'waiting for manager approval', NULL, '2025-05-24 02:48:13'),
(59, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'มีใบรับรองแพทย์', 'waiting for manager approval', NULL, '2025-05-24 02:49:12'),
(60, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'มีใบรับรองแพทย์', 'waiting for manager approval', NULL, '2025-05-24 02:49:35'),
(61, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'waiting for manager approval', NULL, '2025-05-24 02:50:00'),
(62, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'waiting for manager approval', NULL, '2025-05-24 02:50:02'),
(63, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'waiting for manager approval', NULL, '2025-05-24 02:50:03'),
(64, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'waiting for manager approval', NULL, '2025-05-24 02:50:05'),
(65, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'waiting for manager approval', NULL, '2025-05-24 02:55:51'),
(66, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'approved', NULL, '2025-05-24 02:56:17'),
(67, 12, '2025-05-25', '01:00:00', '12:00:00', 'ไม่ขกละ', 'ลากิจ', 'waiting for manager approval', NULL, '2025-05-24 08:46:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user','manager','head','hr') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `department`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'Punnavit', 'Panchang', 'IT', '0809', '123456', 'user', '2025-05-22 09:04:23'),
(3, 'John', 'Doe', 'IT', 'johndoe', '$2b$10$l8IHt1JTZq.v29ijDueygesaFJocNJPJTVx/DbjDvuNWDCXlIgklK', 'user', '2025-05-22 09:24:52'),
(10, 'John', 'Doe', 'IT', 'johndoe2', '$2b$10$vXJiCyMbK/CGa.jVS67Jnus91XoV2ZN1xaY1QK7UOZw.XVBMTXlIG', 'user', '2025-05-22 09:29:45'),
(11, 'John', 'Doe', 'IT', 'johndoe233', '$2b$10$1HpvILa/evbDk3CTyL0cqOmop1TN0L0GsLba9XS9eLYlUKEa4dlEW', 'user', '2025-05-22 09:41:35'),
(12, 'Punnavit', 'Panchang', 'IT', 'IThead', '$2b$10$sgx3D5V.CQ49zUUz.h/rW.3pQ3ZVCKDE7ML9tTBiIysbOKZccg9Ry', 'head', '2025-05-23 06:38:06'),
(13, 'Punnavit', 'manager', 'IT', 'ITmanager', '$2b$10$EuKNXUu38LAkGA6xwJGc7eLh.rcLzPDOrqKWnA8RBZvLNkZFspqjG', 'manager', '2025-05-24 08:57:47'),
(14, 'Punnavit', 'Hr', 'HR', 'HR', '$2b$10$jmxEy0m4LpaCYs9gLeBV/O6pMGrd2V/nHPBT6KAJzkWK8u3t9lY.K', 'hr', '2025-05-24 08:58:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `leaveform`
--
ALTER TABLE `leaveform`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `leaveform`
--
ALTER TABLE `leaveform`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leaveform`
--
ALTER TABLE `leaveform`
  ADD CONSTRAINT `leaveform_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
