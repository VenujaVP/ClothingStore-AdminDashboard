-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2025 at 02:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `polocity`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int(11) NOT NULL,
  `customerID` int(11) NOT NULL,
  `contact_name` varchar(100) NOT NULL,
  `mobile_number` varchar(15) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `apt_suite_unit` varchar(50) DEFAULT NULL,
  `province` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `customerID`, `contact_name`, `mobile_number`, `street_address`, `apt_suite_unit`, `province`, `district`, `zip_code`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 10, 'Venuja', '7777777777', 'AAAAAAAAAAAAA, AAAAAAAAAAAAAAAA, AAAAAAAAAAA', 'AAAAAAAAAAA', 'Southern Province', 'Hambantota', '433534', 0, '2025-04-25 04:36:03', '2025-04-25 04:36:03'),
(2, 10, 'bbbbbbbbbbbbbb', '2222222222222', 'bbbbbbbbbbbbbbbbb, bbbbbbbbb, bbbbbbbbbbbb', 'bb', 'Western Province', 'Gampaha', '5555555', 1, '2025-04-25 04:36:39', '2025-04-25 04:36:39'),
(3, 11, 'dsvsdvsb', '35636346', 'kdddddddddddddd', 'bbbbbbbbbbbbbbbbb', 'Northern Province', 'Kilinochchi', '433534', 0, '2025-05-13 04:10:11', '2025-05-13 04:10:57'),
(4, 11, 'dddddddddddddddddddddddddd', 'e33333', 'vewwwwwwwwwwwwwwwww', 'fbsbszbf sz', 'North Western Province', 'Kurunegala', '333333', 1, '2025-05-13 04:10:57', '2025-05-13 04:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` int(11) NOT NULL,
  `customerID` int(11) NOT NULL,
  `ProductID` varchar(10) NOT NULL,
  `VariationID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`cart_item_id`, `customerID`, `ProductID`, `VariationID`, `quantity`, `added_at`, `updated_at`) VALUES
(1, 10, 'P002', 4, 5, '2025-04-25 04:33:46', '2025-04-25 04:34:04'),
(2, 10, 'P003', 6, 6, '2025-04-25 04:34:49', '2025-04-25 04:34:49'),
(6, 11, 'P002', 4, 6, '2025-05-13 04:07:55', '2025-05-13 04:07:55'),
(7, 11, 'P003', 7, 4, '2025-05-13 04:08:27', '2025-05-13 04:08:27');

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

CREATE TABLE `colors` (
  `ColorID` int(11) NOT NULL,
  `ColorValue` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `colors`
--

INSERT INTO `colors` (`ColorID`, `ColorValue`) VALUES
(4, 'Black'),
(2, 'Blue'),
(8, 'Gray'),
(3, 'Green'),
(10, 'Orange'),
(7, 'Pink'),
(9, 'Purple'),
(1, 'Red'),
(5, 'White'),
(6, 'Yellow');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `PHONE_NUM` varchar(15) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`ID`, `NAME`, `EMAIL`, `PHONE_NUM`, `PASSWORD`, `resetToken`, `resetTokenExpiry`, `createdAt`, `updatedAt`) VALUES
(10, 'Venuja Prasanjith', 'venujagamage2002@gmail.com', '5654765765', '$2b$10$kCH/XllJK0oU2osicHQWTOjCY2G8kYMaPAnDDnGq3tGlM4S65uW8O', NULL, NULL, '2025-04-25 04:33:08', '2025-04-25 04:33:08'),
(11, 'Venuja Prasanjith', 'airdropvpcryptonew@gmail.com', '5654765765', '$2b$10$gBc8cXL1Y4nMWZjUKhRHIOl9bv41W3C2hEKhwiDaTaOKJVm2vvcpG', NULL, NULL, '2025-05-13 04:07:00', '2025-05-13 04:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `employeedetails`
--

CREATE TABLE `employeedetails` (
  `EMPLOYEE_ID` int(11) NOT NULL,
  `USERNAME` varchar(255) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `F_NAME` varchar(50) NOT NULL,
  `L_NAME` varchar(50) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `ENTRY_DATE` datetime NOT NULL,
  `ROLE` varchar(50) NOT NULL,
  `PHONE_NUM1` varchar(15) DEFAULT NULL,
  `PHONE_NUM2` varchar(15) DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeedetails`
--

INSERT INTO `employeedetails` (`EMPLOYEE_ID`, `USERNAME`, `EMAIL`, `F_NAME`, `L_NAME`, `PASSWORD`, `ENTRY_DATE`, `ROLE`, `PHONE_NUM1`, `PHONE_NUM2`, `resetToken`, `resetTokenExpiry`, `createdAt`, `updatedAt`) VALUES
(9, 'fesgrdbd232e', 'venujaforex@gmail.com', 'gggfdgdg', 'gdgbdtbfdb', '$2b$10$gRmGNJigd5RsuHAlmk/LBetio1KeE5hmRzwUCHOiqzD6QI1VeEIL.', '2025-03-09 00:00:00', 'admin', '0703881642', '0703881642', NULL, NULL, '2025-03-08 20:50:13', '2025-03-08 20:50:13');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expenses_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `expenses_name` varchar(255) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expenses_id`, `date`, `expenses_name`, `cost`, `description`, `createdAt`, `updatedAt`) VALUES
(1, '2025-03-09', 'fvsfbv dsb', 100.00, 'cdsbvsedb edng edrgn d', '2025-03-09 09:49:26', '2025-03-09 09:49:26');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_ID` varchar(36) NOT NULL,
  `ID` int(11) NOT NULL,
  `ProductID` varchar(10) NOT NULL,
  `VariationID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL CHECK (`Quantity` > 0),
  `payment_id` varchar(36) DEFAULT NULL,
  `TotalAmount` decimal(10,2) NOT NULL CHECK (`TotalAmount` >= 0),
  `OrderStatus` enum('pending','processing','shipped','delivered','cancelled','returned','refunded') DEFAULT 'pending',
  `PaymentStatus` enum('pending','paid','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_at` timestamp NULL DEFAULT NULL,
  `DeliveryVia` varchar(50) DEFAULT NULL COMMENT 'Courier service name (e.g., FedEx, UPS)',
  `DeliveryDate` date DEFAULT NULL COMMENT 'Estimated delivery date',
  `tracking_number` varchar(100) DEFAULT NULL,
  `CourierEmployeeName` varchar(100) DEFAULT NULL COMMENT 'Name of delivery person',
  `CourierEmployeeNum` varchar(20) DEFAULT NULL COMMENT 'Phone number of delivery person'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Stores customer orders with delivery information';

-- --------------------------------------------------------

--
-- Table structure for table `owners`
--

CREATE TABLE `owners` (
  `ID` int(11) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `PHONE_NUM` varchar(15) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `F_NAME` varchar(255) DEFAULT NULL,
  `L_NAME` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `owners`
--

INSERT INTO `owners` (`ID`, `EMAIL`, `PHONE_NUM`, `PASSWORD`, `resetToken`, `resetTokenExpiry`, `createdAt`, `updatedAt`, `F_NAME`, `L_NAME`) VALUES
(4, 'venujaforex@gmail.com', '5654765765', '$2b$10$gBc8cXL1Y4nMWZjUKhRHIOl9bv41W3C2hEKhwiDaTaOKJVm2vvcpG', NULL, NULL, '2025-03-09 07:02:23', '2025-05-13 04:14:53', 'Venuja', 'Prasanjith'),
(5, 'venujagamage2002@gmail.com', '5654765765', '$2b$10$gBc8cXL1Y4nMWZjUKhRHIOl9bv41W3C2hEKhwiDaTaOKJVm2vvcpG', NULL, NULL, '2025-03-16 10:11:55', '2025-05-13 04:15:34', 'Venuja', 'Prasanjith');

-- --------------------------------------------------------

--
-- Table structure for table `product_table`
--

CREATE TABLE `product_table` (
  `ProductID` varchar(10) NOT NULL,
  `ProductName` varchar(255) NOT NULL,
  `ProductDescription` text DEFAULT NULL,
  `UnitPrice` decimal(10,2) NOT NULL,
  `DateAdded` date NOT NULL,
  `ShippingWeight` decimal(5,2) DEFAULT NULL,
  `Category1` varchar(100) NOT NULL,
  `Category2` varchar(100) DEFAULT NULL,
  `Category3` varchar(100) DEFAULT NULL,
  `Material` varchar(100) DEFAULT NULL,
  `FabricType` varchar(100) DEFAULT NULL,
  `ReturnPolicy` varchar(50) DEFAULT NULL,
  `WishlistCount` int(11) DEFAULT 0,
  `FinalRating` decimal(3,2) DEFAULT 0.00,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_table`
--

INSERT INTO `product_table` (`ProductID`, `ProductName`, `ProductDescription`, `UnitPrice`, `DateAdded`, `ShippingWeight`, `Category1`, `Category2`, `Category3`, `Material`, `FabricType`, `ReturnPolicy`, `WishlistCount`, `FinalRating`, `createdAt`, `updatedAt`) VALUES
('2ww2w2w', 'wwwwwwwwwwww', 'wwwwwwwwwwwww', 22.00, '2025-05-13', 22.00, 'WOMEN', NULL, NULL, NULL, NULL, NULL, 0, 0.00, '2025-05-13 10:27:57', '2025-05-13 10:27:57'),
('P001', 'Floral Printed Blouse', 'A stylish floral printed blouse for casual wear.', 19.00, '2025-03-16', 0.50, 'WOMEN', 'Tops & Tees', 'Crop Tops', 'Cotton', 'Velvet', '7 days return', 0, 1.00, '2025-03-16 15:19:56', '2025-03-17 08:46:16'),
('P002', 'Black Crop Top', 'Trendy black crop top for summer outfits.', 15.00, '2025-03-16', 0.30, 'WOMEN', 'Tops & Tees', 'Crop Tops', 'Cotton', 'Satin', '7 days return', 0, 0.00, '2025-03-16 15:21:33', '2025-03-16 15:21:33'),
('P003', 'Oversized Graphic T-Shirt', 'Casual oversized t-shirt with a trendy graphic print.', 22.00, '2025-03-16', 0.40, 'WOMEN', 'Tops & Tees', 'T-Shirts', 'Cotton', 'Jersey', '7 days return', 0, 0.00, '2025-03-16 15:22:49', '2025-03-16 15:22:49'),
('P004', 'Knitted Sweater', 'Warm and cozy knitted sweater for winter.', 29.00, '2025-03-16', 0.80, 'WOMEN', 'Tops & Tees', 'Hoodies & Sweaters', 'Wool', 'Ribbed', '14 days return', 0, 0.00, '2025-03-16 15:24:07', '2025-03-16 15:24:07'),
('P005', 'Elegant Evening Dress', 'Perfect dress for evening parties and special occasions.', 49.00, '2025-03-16', 1.00, 'WOMEN', 'Dresses & Bottoms', 'Dresses & Frocks', 'Silk', 'Satin', 'No return', 0, 0.00, '2025-03-16 15:26:14', '2025-03-16 15:26:14'),
('P006', 'Denim Skirt', 'A stylish denim skirt for casual outfits.', 25.00, '2025-03-16', 0.60, 'WOMEN', 'Dresses & Bottoms', 'Skirts', 'Denim', 'Canvas', 'No return', 0, 0.00, '2025-03-16 15:30:13', '2025-03-16 15:30:13'),
('P007', 'High-Waist Trousers', 'Comfortable high-waist trousers for office and casual wear.', 30.00, '2025-03-16', 0.70, 'WOMEN', 'Dresses & Bottoms', 'Trousers', NULL, NULL, '7 days return', 0, 0.00, '2025-03-16 15:31:28', '2025-03-16 15:31:28'),
('P0077', 'Kids\' Sneakers', 'Comfortable sneakers for kid', 10.00, '2025-03-16', 9.00, 'MEN', 'Bottoms', 'Trousers', NULL, NULL, 'Comfortable sneakers for kid', 0, 0.00, '2025-03-16 15:53:07', '2025-03-16 15:53:07'),
('P010', 'Silk Nightwear Set', 'Comfortable silk nightwear set for a luxurious sleep.', 45.00, '2025-03-16', 0.40, 'WOMEN', 'Special Categories', 'Night & Loungewear', 'Silk', 'Satin', '7 days return', 0, 0.00, '2025-03-16 15:32:32', '2025-03-16 15:32:32'),
('W002', 'Floral Printed Blouse', 'Casual and comfortable T-shirt for men', 10.00, '2025-03-16', 1.00, 'MEN', 'Bottoms', 'Trousers', 'Linen', 'Chiffon', '-', 0, 0.00, '2025-03-16 15:49:56', '2025-03-16 15:49:56');

-- --------------------------------------------------------

--
-- Table structure for table `product_variations`
--

CREATE TABLE `product_variations` (
  `VariationID` int(11) NOT NULL,
  `ProductID` varchar(10) NOT NULL,
  `SizeID` int(11) NOT NULL,
  `ColorID` int(11) NOT NULL,
  `units` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variations`
--

INSERT INTO `product_variations` (`VariationID`, `ProductID`, `SizeID`, `ColorID`, `units`) VALUES
(2, 'P001', 4, 8, 2),
(3, 'P001', 3, 9, 2),
(4, 'P002', 3, 4, 15),
(5, 'P002', 1, 7, 12),
(6, 'P003', 4, 2, 100),
(7, 'P003', 3, 9, 17),
(8, 'P003', 2, 10, 20),
(9, 'P004', 5, 3, 5),
(10, 'P004', 4, 9, 4),
(11, 'P004', 1, 9, 3),
(12, 'P005', 4, 7, 20),
(13, 'P005', 1, 1, 8),
(14, 'P005', 5, 9, 3),
(15, 'P005', 7, 8, 3),
(16, 'P006', 3, 4, 20),
(17, 'P006', 4, 4, 19),
(18, 'P006', 2, 7, 11),
(19, 'P006', 5, 5, 40),
(20, 'P007', 4, 4, 10),
(21, 'P007', 3, 2, 11),
(22, 'P007', 2, 10, 11),
(23, 'P007', 2, 4, 12),
(24, 'P010', 3, 1, 30),
(25, 'P010', 2, 5, 11),
(27, 'W002', 1, 5, 12),
(28, 'W002', 7, 1, 8),
(29, 'P0077', 4, 2, 11),
(90, '2ww2w2w', 1, 10, 22),
(91, '2ww2w2w', 3, 2, 22),
(92, '2ww2w2w', 3, 8, 18);

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `SizeID` int(11) NOT NULL,
  `SizeValue` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`SizeID`, `SizeValue`) VALUES
(4, 'L'),
(3, 'M'),
(2, 'S'),
(5, 'XL'),
(1, 'XS'),
(6, 'XXL'),
(7, 'XXXL');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `customerID` (`customerID`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD UNIQUE KEY `unique_user_product_variation` (`customerID`,`ProductID`,`VariationID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `VariationID` (`VariationID`);

--
-- Indexes for table `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`ColorID`),
  ADD UNIQUE KEY `ColorValue` (`ColorValue`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`);

--
-- Indexes for table `employeedetails`
--
ALTER TABLE `employeedetails`
  ADD PRIMARY KEY (`EMPLOYEE_ID`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expenses_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_ID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `VariationID` (`VariationID`),
  ADD KEY `idx_user` (`ID`),
  ADD KEY `idx_payment` (`payment_id`),
  ADD KEY `idx_tracking` (`tracking_number`),
  ADD KEY `idx_status` (`OrderStatus`,`PaymentStatus`);

--
-- Indexes for table `owners`
--
ALTER TABLE `owners`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `product_table`
--
ALTER TABLE `product_table`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `product_variations`
--
ALTER TABLE `product_variations`
  ADD PRIMARY KEY (`VariationID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `SizeID` (`SizeID`),
  ADD KEY `ColorID` (`ColorID`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`SizeID`),
  ADD UNIQUE KEY `SizeValue` (`SizeValue`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `colors`
--
ALTER TABLE `colors`
  MODIFY `ColorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `employeedetails`
--
ALTER TABLE `employeedetails`
  MODIFY `EMPLOYEE_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expenses_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `owners`
--
ALTER TABLE `owners`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_variations`
--
ALTER TABLE `product_variations`
  MODIFY `VariationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `SizeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `customers` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `customers` (`ID`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product_table` (`ProductID`),
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`VariationID`) REFERENCES `product_variations` (`VariationID`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `customers` (`ID`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product_table` (`ProductID`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`VariationID`) REFERENCES `product_variations` (`VariationID`);

--
-- Constraints for table `product_variations`
--
ALTER TABLE `product_variations`
  ADD CONSTRAINT `product_variations_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product_table` (`ProductID`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_variations_ibfk_2` FOREIGN KEY (`SizeID`) REFERENCES `sizes` (`SizeID`),
  ADD CONSTRAINT `product_variations_ibfk_3` FOREIGN KEY (`ColorID`) REFERENCES `colors` (`ColorID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
