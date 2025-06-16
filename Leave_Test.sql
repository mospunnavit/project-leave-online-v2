-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jun 16, 2025 at 10:04 AM
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
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int NOT NULL,
  `department_code` char(10) NOT NULL,
  `department_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `department_code`, `department_name`) VALUES
(1, 'IT01', 'IT'),
(2, 'HR01', 'HR'),
(3, 'WH01', 'WH');

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

-- --------------------------------------------------------

--
-- Table structure for table `leave_conditions`
--

CREATE TABLE `leave_conditions` (
  `lc_id` int NOT NULL,
  `lc_code` varchar(10) DEFAULT NULL,
  `lc_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leave_conditions`
--

INSERT INTO `leave_conditions` (`lc_id`, `lc_code`, `lc_name`) VALUES
(1, '20003', 'ลาเต็มวัน'),
(2, '20004', 'ลาครึ่งวันก่อนพัก'),
(3, '20007', 'ลาครึ่งวันหลังพัก');

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `lt_id` int NOT NULL,
  `lt_code` varchar(10) DEFAULT NULL,
  `lt_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`lt_id`, `lt_code`, `lt_name`) VALUES
(1, '020003', 'ป่วยไม่มีใบแพทย์(วัน)'),
(2, '020004', 'ป่วยมีใบแพทย์(วัน)'),
(3, '020007-1', 'ลาป่วย - เกินสวัสดิการ'),
(4, '020005', 'ลากิจ(วัน)'),
(5, '020006-1', 'ลากิจ(ไม่หักเงิน)วัน'),
(6, '020006', 'ลาพักร้อน(วัน)');

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
(14, 'Punnavit', 'Hr', 'HR', 'HR', '$2b$10$jmxEy0m4LpaCYs9gLeBV/O6pMGrd2V/nHPBT6KAJzkWK8u3t9lY.K', 'hr', '2025-05-24 08:58:42'),
(15, 'mos', 'za', 'ADMIN', 'admin', '$2b$10$8IIlppR8shKLqVmA6gyvhuSaG17oFxjtmRCrXozoOS.NZIlfyCW1u', 'admin', '2025-06-02 04:02:42'),
(16, 'mos', 'za', 'IT', '0808', '$2b$10$g5dfg2ORS6BZEp9dyAkuCOSfW1oDDCeaSpS4LGpqjWK4m8MSeElCy', 'user', '2025-06-02 07:33:45'),
(17, 'John1', 'Doe1', NULL, 'john1', '123456', 'user', '2025-06-16 09:33:24'),
(19, 'John12', 'Doe1', NULL, 'john12', '123456', 'user', '2025-06-16 09:36:22'),
(20, 'mos', 'inwza', NULL, '9999', '123456', 'admin', '2025-06-16 09:56:22');

-- --------------------------------------------------------

--
-- Table structure for table `user_departments`
--

CREATE TABLE `user_departments` (
  `user_id` int NOT NULL,
  `department_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_departments`
--

INSERT INTO `user_departments` (`user_id`, `department_id`) VALUES
(19, 1),
(19, 2),
(20, 2),
(19, 3),
(20, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_code` (`department_code`);

--
-- Indexes for table `leaveform`
--
ALTER TABLE `leaveform`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `fk_lt_id` (`lt_code`),
  ADD KEY `fk_lc_code` (`lc_code`);

--
-- Indexes for table `leave_conditions`
--
ALTER TABLE `leave_conditions`
  ADD PRIMARY KEY (`lc_id`),
  ADD UNIQUE KEY `lc_code` (`lc_code`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`lt_id`),
  ADD UNIQUE KEY `lt_code` (`lt_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_departments`
--
ALTER TABLE `user_departments`
  ADD PRIMARY KEY (`user_id`,`department_id`),
  ADD KEY `department_id` (`department_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `leaveform`
--
ALTER TABLE `leaveform`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `leave_conditions`
--
ALTER TABLE `leave_conditions`
  MODIFY `lc_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `lt_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leaveform`
--
ALTER TABLE `leaveform`
  ADD CONSTRAINT `fk_lc_code` FOREIGN KEY (`lc_code`) REFERENCES `leave_conditions` (`lc_code`),
  ADD CONSTRAINT `fk_lt_id` FOREIGN KEY (`lt_code`) REFERENCES `leave_types` (`lt_code`);

--
-- Constraints for table `user_departments`
--
ALTER TABLE `user_departments`
  ADD CONSTRAINT `user_departments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_departments_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
