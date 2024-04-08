-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2024 at 10:29 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webbangiay`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE DATABASE webbangiay;
USE webbangiay;

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `total_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `total_price`) VALUES
(0, 0),
(1, 500000),
(2, 300000);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `username` varchar(50) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`username`, `cart_id`, `password`, `fullname`, `phone`, `address`) VALUES
('admin', 0, '$2a$10$utEVZWEeGmjZzaWZqv4CI.e73uIF3/LC.b2r2o2iJ/HnP6/3H6.pG', '', '', ''),
('nguyenvana', 1, '$2a$10$u3AL7eyp4gqqy61eH7Yx9eJx0ykz5xW7N.nHkgRdkyCyaO6cV/CoK', 'Nguyễn Văn A', '0909000000', 'Hà Nội'),
('nguyenvanb', 2, '$2a$10$zAcmnqKkM1ist0wZ8r9AIuXgMWJsz8lWUprGZ3wAdcwgaYHAkvbYq', 'Nguyễn Văn B', '0909000111', 'Hà Nội');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `total_price` int(11) NOT NULL,
  `date` varchar(20) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `username`, `total_price`, `date`, `status`) VALUES
('17032024000000', 'nguyenvana', 100000, '17/03/2024 00:00:00', 'Hoàn thành'),
('17032024111111', 'nguyenvanb', 200000, '17/03/2024 11:11:11', 'Hoàn thành');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(20) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price` int(11) NOT NULL,
  `image` varchar(100) NOT NULL,
  `brand` varchar(20) NOT NULL,
  `catalog` varchar(50) NOT NULL,
  `deleted` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `color`, `description`, `price`, `image`, `brand`, `catalog`, `deleted`, `quantity`) VALUES
(1, 'Giày thể thao mẫu 1', 'Xanh', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 100000, 'giaythethao1.jpg', 'MWC', 'Giày thể thao', 0, 10),
(2, 'Giày thể thao mẫu 2', 'Xám', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 200000, 'giaythethao2.jpg', 'MWC', 'Giày thể thao', 0, 10),
(3, 'Giày thể thao mẫu 3', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 300000, 'giaythethao3.jpg', 'MWC', 'Giày thể thao', 0, 10),
(4, 'Giày tây mẫu 1', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 100000, 'giaytay1.jpg', 'MWC', 'Giày tây', 0, 10),
(5, 'Giày tây mẫu 2', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 200000, 'giaytay2.jpg', 'MWC', 'Giày tây', 0, 10),
(6, 'Giày tây mẫu 3', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 300000, 'giaytay3.jpg', 'MWC', 'Giày tây', 0, 10),
(7, 'Giày sandals mẫu 1', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 100000, 'sandals1.jpg', 'MWC', 'Giày sandals', 0, 10),
(8, 'Giày sandals mẫu 2', 'Trắng', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 200000, 'sandals2.jpg', 'MWC', 'Giày sandals', 0, 10),
(9, 'Giày sandals mẫu 3', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 300000, 'sandals3.jpg', 'MWC', 'Giày sandals', 0, 10),
(10, 'Giày lười mẫu 1', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 100000, 'giayluoi1.jpg', 'MWC', 'Giày lười', 0, 10),
(11, 'Giày lười mẫu 2', 'Trắng', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 200000, 'giayluoi2.jpg', 'MWC', 'Giày lười', 0, 10),
(12, 'Giày lười mẫu 3', 'Nâu', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 300000, 'giayluoi3.jpg', 'MWC', 'Giày lười', 0, 10),
(13, 'Giày boot mẫu 1', 'Vàng', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 100000, 'giayboot1.jpg', 'MWC', 'Giày boot', 0, 10),
(14, 'Giày boot mẫu 2', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 200000, 'giayboot2.jpg', 'MWC', 'Giày boot', 0, 10),
(15, 'Giày boot mẫu 3', 'Trắng', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 300000, 'giayboot3.jpg', 'MWC', 'Giày boot', 0, 10),
(16, 'Dép mẫu 1', 'Nâu', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 100000, 'dep1.jpg', 'MWC', 'Dép', 0, 10),
(17, 'Dép mẫu 2', 'Đen', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 200000, 'dep2.jpg', 'MWC', 'Dép', 0, 10),
(18, 'Dép mẫu 3', 'Trắng', 'Giày mang đến cho người mang một phong cách năng động và trẻ trung. Nó giúp bạn thể hiện phong cách thời trang riêng biệt và còn dễ dàng phối cùng nhiều trang phục khác để trở nên thật cá tính', 300000, 'dep3.jpg', 'MWC', 'Dép', 0, 10);

-- --------------------------------------------------------

--
-- Table structure for table `productcart`
--

CREATE TABLE `productcart` (
  `product_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `size` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `productcart`
--

INSERT INTO `productcart` (`product_id`, `cart_id`, `size`, `quantity`) VALUES
(1, 1, '39', 1),
(1, 2, '40', 1),
(2, 1, '41', 1),
(2, 2, '42', 1),
(5, 2, '43', 1);

-- --------------------------------------------------------

--
-- Table structure for table `productorder`
--

CREATE TABLE `productorder` (
  `product_id` int(11) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `size` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `productorder`
--

INSERT INTO `productorder` (`product_id`, `order_id`, `size`, `quantity`) VALUES
(1, '17032024000000', '39', 1),
(2, '17032024111111', '40', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`username`),
  ADD KEY `cart_id` (`cart_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `productcart`
--
ALTER TABLE `productcart`
  ADD PRIMARY KEY (`product_id`,`cart_id`,`size`),
  ADD KEY `cart_id` (`cart_id`);

--
-- Indexes for table `productorder`
--
ALTER TABLE `productorder`
  ADD PRIMARY KEY (`product_id`,`order_id`,`size`),
  ADD KEY `order_id` (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`username`) REFERENCES `customer` (`username`);

--
-- Constraints for table `productcart`
--
ALTER TABLE `productcart`
  ADD CONSTRAINT `productcart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `productcart_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`);

--
-- Constraints for table `productorder`
--
ALTER TABLE `productorder`
  ADD CONSTRAINT `productorder_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `productorder_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
