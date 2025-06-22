-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jun 22, 2025 at 04:47 PM
-- Server version: 9.2.0
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
(3, 'WH01', 'WH'),
(4, 'MK01', 'MK');

-- --------------------------------------------------------

--
-- Table structure for table `holiday`
--

CREATE TABLE `holiday` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `sunday` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `holiday`
--

INSERT INTO `holiday` (`id`, `date`, `remark`, `sunday`) VALUES
(176, '2021-01-01', 'วันขึ้นปีใหม่', 0),
(177, '2021-01-02', 'สลับวันหยุดกับวันที่ 3', 0),
(178, '2021-01-10', 'วันอาทิตย์', 1),
(179, '2021-01-17', 'วันอาทิตย์', 1),
(180, '2021-01-24', 'วันอาทิตย์', 1),
(181, '2021-01-31', 'วันอาทิตย์', 1),
(182, '2021-02-07', 'วันอาทิตย์', 1),
(183, '2021-02-14', 'วันอาทิตย์', 1),
(184, '2021-02-21', 'วันอาทิตย์', 1),
(185, '2021-02-28', 'วันอาทิตย์', 1),
(186, '2021-03-07', 'วันอาทิตย์', 1),
(187, '2021-03-14', 'วันอาทิตย์', 1),
(188, '2021-03-21', 'วันอาทิตย์', 1),
(189, '2021-03-28', 'วันอาทิตย์', 1),
(190, '2021-04-04', 'วันอาทิตย์', 1),
(191, '2021-04-11', 'วันอาทิตย์', 1),
(192, '2021-04-12', 'ชดเชยวันจักรี', 0),
(193, '2021-04-13', 'วันสงกรานต์', 0),
(194, '2021-04-14', 'วันสงกรานต์', 0),
(195, '2021-04-15', 'วันสงกรานต์', 0),
(196, '2021-04-18', 'วันอาทิตย์', 1),
(197, '2021-04-25', 'วันอาทิตย์', 1),
(198, '2021-05-01', 'วันแรงงานแห่งชาติ', 0),
(199, '2021-05-02', 'วันอาทิตย์', 1),
(200, '2021-05-09', 'วันอาทิตย์', 1),
(201, '2021-05-16', 'วันอาทิตย์', 1),
(202, '2021-05-23', 'วันอาทิตย์', 1),
(203, '2021-05-30', 'วันอาทิตย์', 1),
(204, '2021-06-06', 'วันอาทิตย์', 1),
(205, '2021-06-13', 'วันอาทิตย์', 1),
(206, '2021-06-20', 'วันอาทิตย์', 1),
(207, '2021-06-27', 'วันอาทิตย์', 1),
(208, '2021-06-05', 'ชดเชยวันเฉลิมพระชนมพรรษาพระบรมราชินี ร.10', 0),
(209, '2021-07-04', 'วันอาทิตย์', 1),
(210, '2021-07-11', 'วันอาทิตย์', 1),
(211, '2021-07-18', 'วันอาทิตย์', 1),
(212, '2021-07-24', 'วันอาสาฬหบูชา', 0),
(213, '2021-07-25', 'วันอาทิตย์', 1),
(214, '2021-07-31', 'ชดเชยวันเฉลิมพระชนมพรรษา ร.10', 0),
(215, '2021-08-01', 'วันอาทิตย์', 1),
(216, '2021-08-08', 'วันอาทิตย์', 1),
(217, '2021-08-14', 'ชดเชยวันแม่แห่งชาติ', 0),
(218, '2021-08-15', 'วันอาทิตย์', 1),
(219, '2021-08-22', 'วันอาทิตย์', 1),
(220, '2021-08-29', 'วันอาทิตย์', 1),
(221, '2021-09-05', 'วันอาทิตย์', 1),
(222, '2021-09-12', 'วันอาทิตย์', 1),
(223, '2021-09-19', 'วันอาทิตย์', 1),
(224, '2021-09-26', 'วันอาทิตย์', 1),
(225, '2021-10-03', 'วันอาทิตย์', 1),
(226, '2021-10-10', 'วันอาทิตย์', 1),
(227, '2021-10-23', 'วันปิยมหาราช', 0),
(228, '2021-10-24', 'วันอาทิตย์', 1),
(229, '2021-11-07', 'วันอาทิตย์', 1),
(230, '2021-11-14', 'วันอาทิตย์', 1),
(231, '2021-11-21', 'วันอาทิตย์', 1),
(232, '2021-11-28', 'วันอาทิตย์', 1),
(233, '2021-12-04', 'ชดเชยวันพ่อแห่งชาติ', 0),
(234, '2021-12-05', 'วันอาทิตย์', 1),
(235, '2021-12-12', 'วันอาทิตย์', 1),
(236, '2021-12-19', 'วันอาทิตย์', 1),
(237, '2021-12-26', 'วันอาทิตย์', 1),
(238, '2021-12-31', 'วันสิ้นปี', 0),
(239, '2021-10-17', 'วันอาทิตย์', 1),
(240, '2021-10-31', 'วันอาทิตย์', 1),
(241, '2022-01-01', 'วันปีใหม่', 0),
(242, '2022-01-02', 'วันอาทิตย์', 1),
(243, '2022-01-09', 'วันอาทิตย์', 1),
(244, '2022-01-16', 'วันอาทิตย์', 1),
(245, '2022-01-23', 'วันอาทิตย์', 1),
(246, '2022-01-30', 'วันอาทิตย์', 1),
(247, '2022-02-06', 'วันอาทิตย์', 1),
(248, '2022-02-13', 'วันอาทิตย์', 1),
(249, '2022-02-20', 'วันอาทิตย์', 1),
(250, '2022-02-27', 'วันอาทิตย์', 1),
(251, '2022-03-06', 'วันอาทิตย์', 1),
(252, '2022-03-13', 'วันอาทิตย์', 1),
(253, '2022-03-20', 'วันอาทิตย์', 1),
(254, '2022-03-27', 'วันอาทิตย์', 1),
(255, '2022-04-03', 'วันอาทิตย์', 1),
(256, '2022-04-10', 'วันอาทิตย์', 1),
(257, '2022-04-13', 'วันสงกรานต์', 0),
(258, '2022-04-14', 'วันสงกรานต์', 0),
(259, '2022-04-15', 'วันสงกรานต์', 0),
(260, '2022-04-16', 'วันสงกรานต์', 0),
(261, '2022-04-17', 'วันอาทิตย์', 1),
(262, '2022-04-24', 'วันอาทิตย์', 1),
(263, '2022-05-02', 'วันแรงงาน', 0),
(264, '2022-05-08', 'วันอาทิตย์', 1),
(265, '2022-05-14', 'วันวิสาขบูชา', 0),
(266, '2022-05-15', 'วันอาทิตย์', 1),
(267, '2022-05-22', 'วันอาทิตย์', 1),
(268, '2022-05-29', 'วันอาทิตย์', 1),
(269, '2022-06-04', 'วันเฉลิมพระชนมพรรษาพระบรมราชินี ร.10', 0),
(270, '2022-06-05', 'วันอาทิตย์', 1),
(271, '2022-06-12', 'วันอาทิตย์', 1),
(272, '2022-06-19', 'วันอาทิตย์', 1),
(273, '2022-06-26', 'วันอาทิตย์', 1),
(274, '2022-07-03', 'วันอาทิตย์', 1),
(275, '2022-07-10', '	วันอาทิตย์', 1),
(276, '2022-07-17', '	วันอาทิตย์', 1),
(277, '2022-07-24', '	วันอาทิตย์', 1),
(278, '2022-07-30', '28 วันเฉลิมพระชนมพรรษา ร.10 (สลับวันหยุด 30 )\r\n', 0),
(279, '2022-08-07', 'วันอาทิตย์', 1),
(280, '2022-08-13', '12 วันแม่ (สลับวันหยุด 13)', 0),
(281, '2022-08-14', 'วันอาทิตย์', 1),
(282, '2022-08-21', 'วันอาทิตย์', 1),
(283, '2022-08-28', '	วันอาทิตย์', 1),
(284, '2022-09-04', 'วันอาทิตย์', 1),
(285, '2022-09-11', 'วันอาทิตย์', 1),
(286, '2022-09-18', 'วันอาทิตย์', 1),
(287, '2022-09-25', 'วันอาทิตย์', 1),
(288, '2022-10-02', 'วันอาทิตย์', 1),
(289, '2022-10-09', 'วันอาทิตย์', 1),
(290, '2022-10-16', 'วันอาทิตย์', 1),
(291, '2022-10-22', '23 วินปิยะมหาราช (สลับวันหยุด 22)', 0),
(292, '2022-10-23', 'วันอาทิตย์', 1),
(293, '2022-11-06', 'วันอาทิตย์', 1),
(294, '2022-11-13', 'วันอาทิตย์', 1),
(295, '2022-11-20', 'วันอาทิตย์', 1),
(296, '2022-11-27', 'วันอาทิตย์', 1),
(297, '2022-12-04', 'วันอาทิตย์', 1),
(298, '2022-12-05', 'วันพ่อ', 0),
(299, '2022-12-11', 'วันอาทิตย์', 1),
(300, '2022-12-18', 'วันอาทิตย์', 1),
(301, '2022-12-25', 'วันอาทิตย์', 1),
(302, '2022-07-31', 'วันอาทิตย์', 1),
(303, '2022-12-31', 'วันสิ้นปี', 0),
(304, '2023-01-01', 'วันปีใหม่', 0),
(305, '2023-01-08', NULL, 1),
(306, '2023-01-15', NULL, 1),
(307, '2023-01-22', NULL, 1),
(308, '2023-01-29', NULL, 1),
(309, '2023-02-05', NULL, 1),
(310, '2023-02-12', NULL, 1),
(311, '2023-02-19', NULL, 1),
(312, '2023-02-26', NULL, 1),
(313, '2023-03-05', NULL, 1),
(314, '2023-03-06', 'วันมาฆบูชา', 0),
(315, '2023-03-12', NULL, 1),
(316, '2023-03-19', NULL, 1),
(317, '2023-03-26', NULL, 1),
(318, '2023-04-02', NULL, 1),
(319, '2023-04-09', NULL, 1),
(320, '2023-04-12', 'สลับวันหยุด วันจักรี', 0),
(321, '2023-04-13', 'วันสงกรานต์', 0),
(322, '2023-04-14', 'วันสงกรานต์', 0),
(324, '2023-04-15', 'วันสงกรานต์', 0),
(325, '2023-04-16', NULL, 1),
(326, '2023-04-23', NULL, 1),
(327, '2023-04-30', NULL, 1),
(328, '2023-05-01', 'วันแรงงาน', 0),
(329, '2023-05-07', NULL, 1),
(330, '2023-05-14', NULL, 1),
(331, '2023-05-21', NULL, 1),
(332, '2023-05-28', NULL, 1),
(333, '2023-06-03', 'วันวิสาขบูชา', 0),
(334, '2023-06-04', NULL, 1),
(335, '2023-06-05', 'วันพระชนมพรรษาพระบรมราชินี', 0),
(336, '2023-06-11', NULL, 1),
(338, '2023-06-18', NULL, 1),
(339, '2023-06-25', NULL, 1),
(340, '2023-07-02', NULL, 1),
(341, '2023-07-09', NULL, 1),
(342, '2023-07-16', NULL, 1),
(343, '2023-07-23', NULL, 1),
(344, '2023-07-29', 'วันพระชนมพรรษา ร.10', 0),
(345, '2023-07-30', NULL, 1),
(346, '2023-08-05', 'วันอาสาฬหบูชา', 0),
(347, '2023-08-06', NULL, 1),
(348, '2023-08-12', 'วันแม่', 0),
(349, '2023-08-13', NULL, 1),
(350, '2023-08-20', NULL, 1),
(351, '2023-08-27', NULL, 1),
(352, '2023-09-03', NULL, 1),
(353, '2023-09-10', NULL, 1),
(354, '2023-09-17', NULL, 1),
(355, '2023-09-24', NULL, 1),
(356, '2023-10-08', NULL, 1),
(357, '2023-10-15', NULL, 1),
(358, '2023-10-22', NULL, 1),
(359, '2023-10-29', NULL, 1),
(360, '2023-11-05', NULL, 1),
(361, '2023-11-12', NULL, 1),
(362, '2023-11-19', NULL, 1),
(363, '2023-11-26', NULL, 1),
(364, '2023-12-02', 'วันพ่อ', 0),
(365, '2023-12-03', NULL, 1),
(366, '2023-12-10', NULL, 1),
(367, '2023-12-17', NULL, 1),
(368, '2023-12-24', NULL, 1),
(369, '2023-12-30', 'วันสิ้นปี', 0),
(370, '2023-12-31', NULL, 1),
(371, '2024-01-01', 'วันปีใหม่', 0),
(372, '2024-01-02', 'วันหยุดทดแทน', 0),
(373, '2024-01-07', NULL, 1),
(374, '2024-01-14', NULL, 1),
(375, '2024-01-21', NULL, 1),
(376, '2024-01-28', NULL, 1),
(377, '2024-02-04', NULL, 1),
(378, '2024-02-11', NULL, 1),
(379, '2024-02-18', NULL, 1),
(380, '2024-02-25', NULL, 1),
(381, '2024-03-03', NULL, 1),
(382, '2024-03-10', NULL, 1),
(383, '2024-03-17', NULL, 1),
(384, '2024-03-24', NULL, 1),
(385, '2024-03-31', NULL, 1),
(386, '2024-04-07', NULL, 1),
(387, '2024-04-12', 'สงกรานต์', 0),
(388, '2024-04-13', 'สงกรานต์', 0),
(389, '2024-04-14', NULL, 1),
(390, '2024-04-15', 'สงกรานต์', 0),
(391, '2024-04-16', 'สงกรานต์', 0),
(392, '2024-04-21', NULL, 1),
(393, '2024-04-28', NULL, 1),
(394, '2024-05-01', 'วันแรงงาน', 0),
(395, '2024-05-05', NULL, 1),
(396, '2024-05-12', NULL, 1),
(397, '2024-05-19', NULL, 1),
(398, '2024-05-26', NULL, 1),
(399, '2024-06-02', NULL, 1),
(400, '2024-06-03', 'วันเฉลิมพระชนมพรรษาราชินีร.10', 0),
(401, '2024-06-09', NULL, 1),
(402, '2024-06-16', NULL, 1),
(403, '2024-06-23', NULL, 1),
(404, '2024-06-30', NULL, 1),
(405, '2024-07-07', NULL, 1),
(406, '2024-07-14', NULL, 1),
(407, '2024-07-20', 'วันอาสาฬหบูชา', 0),
(408, '2024-07-21', NULL, 1),
(409, '2024-07-27', 'วันเฉลิมพระชนมพรรษาร.10', 0),
(410, '2024-07-28', NULL, 1),
(411, '2024-08-04', NULL, 1),
(412, '2024-08-11', NULL, 1),
(413, '2024-08-12', 'วันแม่', 0),
(414, '2024-08-18', NULL, 1),
(415, '2024-08-25', NULL, 1),
(416, '2024-09-01', NULL, 1),
(417, '2024-09-08', NULL, 1),
(418, '2024-09-15', NULL, 1),
(419, '2024-09-22', NULL, 1),
(420, '2024-09-29', NULL, 1),
(421, '2024-10-06', NULL, 1),
(422, '2024-10-13', NULL, 1),
(423, '2024-10-20', NULL, 1),
(424, '2024-10-27', NULL, 1),
(425, '2024-11-03', NULL, 1),
(426, '2024-11-10', NULL, 1),
(427, '2024-11-17', NULL, 1),
(428, '2024-11-24', NULL, 1),
(429, '2024-12-01', NULL, 1),
(430, '2024-12-08', NULL, 1),
(431, '2024-12-15', NULL, 1),
(432, '2024-12-22', NULL, 1),
(433, '2024-12-28', 'พักร้อน', 0),
(434, '2024-12-29', NULL, 1),
(435, '2024-12-30', 'ทดแทนวันพ่อ', 0),
(436, '2024-12-31', 'วันสิ้นปี', 0),
(437, '2025-01-01', 'วันขึ้นปีใหม่', 0),
(438, '2025-01-02', 'วันพักร้อน', 0),
(439, '2023-12-28', 'วันหยุดทดแทน', 0),
(440, '2023-12-29', 'วันหยุดทดแทน', 0),
(441, '2025-01-05', NULL, 1),
(442, '2025-01-12', NULL, 1),
(443, '2025-01-19', NULL, 1),
(444, '2025-01-26', NULL, 1),
(445, '2025-02-02', NULL, 1),
(446, '2025-02-09', NULL, 1),
(447, '2025-02-16', NULL, 1),
(448, '2025-02-23', NULL, 1),
(449, '2025-03-02', NULL, 1),
(450, '2025-03-09', NULL, 1),
(451, '2025-03-16', NULL, 1),
(452, '2025-03-23', NULL, 1),
(453, '2025-03-30', NULL, 1),
(454, '2025-04-06', NULL, 1),
(455, '2025-04-12', 'หยุดแทนวันจักกรี', 0),
(456, '2025-04-13', 'วันสงกรานต์', 0),
(457, '2025-04-14', 'วันสงกรานต์', 0),
(458, '2025-04-15', 'วันสงกรานต์', 0),
(459, '2025-04-16', 'วันสงกรานต์', 0),
(460, '2025-04-20', NULL, 1),
(461, '2025-04-27', NULL, 1),
(462, '2025-05-01', 'วันแรงงาน', 0),
(463, '2025-05-04', NULL, 1),
(464, '2025-05-11', NULL, 1),
(465, '2025-05-18', NULL, 1),
(466, '2025-05-25', NULL, 1),
(467, '2025-06-01', NULL, 1),
(468, '2025-06-07', 'หยุดแทนวันเฉลิมพระชนมพรรษาพระบรมราชินี', 0),
(469, '2025-06-08', NULL, 1),
(470, '2025-06-15', NULL, 1),
(471, '2025-06-22', NULL, 1),
(472, '2025-06-29', NULL, 1),
(473, '2025-07-06', NULL, 1),
(474, '2025-07-12', 'หยุดแทนวันอาสาฬหบูชา', 0),
(475, '2025-07-13', NULL, 1),
(476, '2025-07-20', NULL, 1),
(477, '2025-07-27', NULL, 1),
(478, '2025-07-28', 'วันเฉลิมพระชนมพรรษา ร.10', 0),
(479, '2025-08-03', NULL, 1),
(480, '2025-08-10', NULL, 1),
(481, '2025-08-11', 'พักร้อน', 0),
(482, '2025-08-12', 'วันแม่', 0),
(483, '2025-08-17', NULL, 1),
(484, '2025-08-24', NULL, 1),
(485, '2025-08-31', NULL, 1),
(486, '2025-09-07', NULL, 1),
(487, '2025-09-14', NULL, 1),
(488, '2025-09-21', NULL, 1),
(489, '2025-09-28', NULL, 1),
(490, '2025-10-05', NULL, 1),
(491, '2025-10-12', NULL, 1),
(492, '2025-10-19', NULL, 1),
(493, '2025-10-26', NULL, 1),
(494, '2025-11-02', NULL, 1),
(495, '2025-11-09', NULL, 1),
(496, '2025-11-16', NULL, 1),
(497, '2025-11-23', NULL, 1),
(498, '2025-11-30', NULL, 1),
(499, '2025-12-07', NULL, 1),
(500, '2025-12-14', NULL, 1),
(501, '2025-12-21', NULL, 1),
(502, '2025-12-28', NULL, 1),
(503, '2025-12-29', 'หยุดแทนวันรัฐธรรมนูญ', 0),
(504, '2025-12-30', 'หยุดแทนวันพ่อ', 0),
(505, '2025-12-31', 'วันสิ้นปี', 0);

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
  `exported_at` datetime DEFAULT NULL,
  `end_leave_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leaveform`
--

INSERT INTO `leaveform` (`id`, `u_id`, `leave_date`, `start_time`, `end_time`, `reason`, `status`, `image_filename`, `submitted_at`, `leaveshift`, `lt_code`, `lc_code`, `usequotaleave`, `exported`, `exported_at`, `end_leave_date`) VALUES
(78, 25, '2025-06-22', '08:00:00', '17:00:00', 'ไปธุระกิจ', 'waiting for manager approval', NULL, '2025-06-17 06:07:57', 'กะเช้า', '020005', '20003', 1.00, 0, NULL, NULL),
(79, 27, '2025-06-22', '13:00:00', '17:00:00', 'ovo', 'waiting for head approval', NULL, '2025-06-17 06:16:43', 'กะเช้า', '020005', '20007', 0.50, 0, NULL, NULL),
(80, 30, '2025-06-20', '08:00:00', '17:00:00', '55556', 'waiting for head approval', NULL, '2025-06-17 09:27:40', 'กะเช้า', '020005', '20003', 1.00, 0, NULL, NULL),
(81, 32, '2025-06-28', '08:00:00', '17:00:00', '1591', 'waiting for manager approval', NULL, '2025-06-18 03:18:45', 'กะเช้า', '020003', '20003', 1.00, 0, NULL, NULL),
(83, 33, '2025-06-20', '08:00:00', '17:00:00', '123', 'approved', NULL, '2025-06-18 07:45:17', 'กะเช้า', '020003', '20003', 1.00, 1, NULL, NULL),
(84, 30, '2025-06-20', '20:00:00', '04:30:00', 'ท้อง', 'waiting for head approval', NULL, '2025-06-19 06:13:34', 'กะดึก', '020007', '20003', 1.00, 0, NULL, '2025-06-24'),
(85, 33, '2025-06-20', '08:00:00', '17:00:00', '123', 'waiting for hr approval', NULL, '2025-06-20 07:15:49', 'กะเช้า', '020007-1', '20003', 1.00, 0, NULL, '2025-06-19'),
(86, 33, '2025-06-20', '08:00:00', '17:00:00', '100', 'approved', NULL, '2025-06-20 07:59:11', 'กะเช้า', '020006', '20003', 8.00, 1, NULL, '2025-06-28'),
(87, 30, '2025-06-24', '08:00:00', '17:00:00', '555', 'approved', NULL, '2025-06-22 08:19:22', 'กะเช้า', '020006-1', '20003', 5.00, 1, NULL, '2025-06-30'),
(88, 30, '2025-05-22', '20:00:00', '04:30:00', '555', 'approved', NULL, '2025-06-22 08:34:58', 'กะดึก', '020003', '20003', 6.00, 1, NULL, '2025-05-27'),
(89, 30, '2025-06-20', '08:00:00', '17:00:00', '1111', 'waiting for head approval', NULL, '2025-06-22 10:31:21', 'กะเช้า', '020007', '20003', 8.00, 0, NULL, '2025-06-28'),
(90, 30, '2025-06-24', '20:00:00', '04:30:00', '121', 'waiting for head approval', NULL, '2025-06-22 10:57:34', 'กะดึก', '020007', '20003', 6.00, 0, NULL, '2025-06-30');

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
(6, '020006', 'ลาพักร้อน(วัน)'),
(7, '020007', 'ลาคลอด');

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
(15, 'mos', 'za', 'ADMIN', 'admin', '$2b$10$8IIlppR8shKLqVmA6gyvhuSaG17oFxjtmRCrXozoOS.NZIlfyCW1u', 'admin', '2025-06-02 04:02:42'),
(20, 'mos', 'inwza', NULL, '9999', '123456', 'admin', '2025-06-16 09:56:22'),
(21, 'mosza', 'inwza', '2', '8888', '123456', 'manager', '2025-06-17 01:05:46'),
(22, 'Ake', 'eoei', '2', '7777', '$2b$10$gKE8/DWfbRZlcVATUYUHd.ErbftuQgVu8v4hMsQN93NkCbQ0SBUSm', 'admin', '2025-06-17 01:31:50'),
(23, 'yoyo', 'yaya', '3', '1115', '$2b$10$3ovJnvNpJF4GEqhuSXv7dezSjRdO0X0Ed7aVj/fXeJcl87oVI6k0K', 'head', '2025-06-17 02:23:48'),
(24, 'IT', '1', '1', 'IT', '$2b$10$rEE6XSuQdTvTtBA.T8xLfOpB3jleD5DH9j3kuZG5QulEYdPV9E/Pm', 'user', '2025-06-17 02:25:04'),
(25, 'IT', 'head', '1', 'IThead', '$2b$10$eEgl7SebE2Bp6aRUWq5iGexh4D8mL3AhzSK6wzpWpqChqbcLXRq1O', 'head', '2025-06-17 03:53:44'),
(26, 'IT', 'head2', '1', 'IThead2', '$2b$10$nXRXIQLyAS69FCh5WYZ9KOCh4lSqusj/qZ/Ms7d9iIhbnh39OKfFK', 'head', '2025-06-17 06:10:30'),
(27, 'WH', 'user', '3', 'WH', '$2b$10$Wx0JfxVpiwWW3mLR1MAQkO6fH/xZqyxd1aOplo04SWYIoSPGafqVG', 'user', '2025-06-17 06:10:57'),
(28, 'WH', 'head', '3', 'WHhead', '$2b$10$9LPh7IrlO3KhWHwbiypdmeUgvyajcsiiKif7xLG.naJS7BOd.lY0y', 'head', '2025-06-17 06:15:57'),
(29, 'HR', 'inwza', '2', 'mosza', '$2b$10$.P.5Bm9DGkPvJ4ILm7DlsOhFUyQknEWGzleH8mOIygRJ1nvBm3nEi', 'user', '2025-06-17 09:22:08'),
(30, 'HR', 'HR', '2', 'HR2', '$2b$10$83EYg7kjL807Jk/9gs/TiOs7ayrYL.JfViBJEMSbMBSeap23z.LCW', 'user', '2025-06-17 09:23:14'),
(31, 'WH', '2', '3', 'WH2', '$2b$10$LVb0YwzN7pXmOSaM0mcEFuNUyv.6iATJmOCBjHZjcoufvu3Ct4mDO', 'user', '2025-06-17 09:25:03'),
(32, 'HR', 'head', '2', 'HRhead', '$2b$10$8aDBTwJ1qC0BFPYEMZ14sut1fmGCWWVtXKf8HNn1E5d2vz4HAxLlW', 'head', '2025-06-18 01:11:10'),
(33, 'HR', 'manager', '2', 'HRmanager', '$2b$10$9BwOd5kP3o0L/1hontKzg.mkAUhNxCcdFGUsxZ0n5SuOJxO70tDjm', 'manager', '2025-06-18 01:11:49'),
(34, '1111', '2222', '3', '7537', '$2b$10$ZjDrIqsAwPQKCLIMN81oau90x3rfUmJQg4LLZszIvC8hd.IzeAZ4m', 'admin', '2025-06-18 03:14:25');

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
(23, 1),
(24, 1),
(26, 1),
(20, 2),
(22, 2),
(23, 2),
(30, 2),
(20, 3),
(21, 3),
(23, 3),
(25, 3),
(26, 3),
(28, 3),
(34, 3);

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
-- Indexes for table `holiday`
--
ALTER TABLE `holiday`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_date` (`date`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `holiday`
--
ALTER TABLE `holiday`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=507;

--
-- AUTO_INCREMENT for table `leaveform`
--
ALTER TABLE `leaveform`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `leave_conditions`
--
ALTER TABLE `leave_conditions`
  MODIFY `lc_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `lt_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
