-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 21-Jan-2022 às 20:11
-- Versão do servidor: 5.5.68-MariaDB
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `loja_integrada`
--
CREATE DATABASE IF NOT EXISTS `loja_integrada` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `loja_integrada`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `carrinhos`
--

CREATE TABLE IF NOT EXISTS `carrinhos` (
  `id` int(11) NOT NULL,
  `usuarios_id` int(11) DEFAULT NULL,
  `num_produtos` int(11) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  `cupom` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Estrutura da tabela `cupons`
--

CREATE TABLE IF NOT EXISTS `cupons` (
  `id` int(11) NOT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `desconto` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `cupons`
--

INSERT INTO `cupons` (`id`, `codigo`, `desconto`, `createdAt`, `updatedAt`) VALUES
(1, 'EXTRAGOOD', 0.05, '2022-01-21 16:18:00', '2022-01-21 02:00:00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `itens_carrinhos`
--

CREATE TABLE IF NOT EXISTS `itens_carrinhos` (
  `id` int(11) NOT NULL,
  `carrinhos_id` int(11) DEFAULT NULL,
  `produtos_id` int(11) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `preco` double DEFAULT NULL,
  `estoque` int(11) DEFAULT NULL,
  `disponivel` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `produtos`
--

INSERT INTO `produtos` (`id`, `nome`, `descricao`, `preco`, `estoque`, `disponivel`, `createdAt`, `updatedAt`) VALUES
(1, 'Jaleco', 'Jaleco de alta qualidade para atender aos clientes mais exigentes', 101, 2, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(2, 'Camiseta Hurley', 'Camiseta azul com estampas amarelas', 102, 4, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(3, 'Jaqueta de couro', 'Jaqueta de couro para os dias frios de inverno', 156, 2, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(4, 'Calça Jeans', 'Calça jeans preta sem rasgos', 54, 3, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(5, 'Bonê Preto Oakle', 'Bonê preto da oakle para você andar com estilo', 163, 4, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(6, 'Terno azul slim', 'Terno social azul slim', 433, 1, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(7, 'Terno verde slim', 'Terno social verde slim', 433, 1, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(8, 'Saia jeans', 'Saia jeans feminina', 433, 1, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(9, 'Sapato social', 'Sapato social de couro', 433, 1, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(10, 'Gravata', 'Gravata de seda 7,5 jacquard vermelha', 113, 2, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33'),
(11, 'Pijama', 'Conjunto de pijama feminino para um bom sono', 138, 2, 1, '2022-01-21 04:24:33', '2022-01-21 04:24:33');

-- --------------------------------------------------------

--
-- Estrutura da tabela `SequelizeMeta`
--

CREATE TABLE IF NOT EXISTS `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20220120032119-create-usuarios.js'),
('20220120045847-AlterarUsuarios.js'),
('20220120052420-create-produtos.js'),
('20220120194822-create-carrinho.js'),
('20220120195109-create-carrinhos-ativos.js'),
('20220120195303-create-cupons.js'),
('20220120201540-create-carrinhos.js'),
('20220120201818-create-itens-carrinho.js'),
('20220121041421-create-cupons.js'),
('20220121042356-create-cupons.js'),
('20220121135648-add_column_in_carrinhos.js');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carrinhos`
--
ALTER TABLE `carrinhos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cupons`
--
ALTER TABLE `cupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itens_carrinhos`
--
ALTER TABLE `itens_carrinhos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carrinhos`
--
ALTER TABLE `carrinhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `cupons`
--
ALTER TABLE `cupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `itens_carrinhos`
--
ALTER TABLE `itens_carrinhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=27;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
